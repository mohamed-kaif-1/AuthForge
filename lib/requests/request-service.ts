import { recordAuditEvent } from "@/lib/audit/audit-service";
import { evaluateAuthorization } from "@/lib/authz/authorization";
import { createApprovalForAction } from "@/lib/approvals/approval-service";
import {
  createActions,
  createRequest,
  getRequestById,
  getUserById,
} from "@/lib/db/repositories";
import { executeApprovedAction } from "@/lib/execution/execution-service";
import { parsePromptToActions } from "@/lib/parser/action-parser";
import { classifyRecipientForAction } from "@/lib/recipient-classifier/recipient-classifier";
import { syncRequestStatus } from "@/lib/requests/request-state";
import { classifyActionRisk } from "@/lib/risk/risk-classifier";
import { ClassifiedAction, SubmitRequestInput } from "@/lib/types/workflow";

export async function submitGovernedRequest(input: SubmitRequestInput) {
  const requester = await getUserById(input.userId);
  if (!requester) throw new Error("Requesting user not found.");

  const request = await createRequest({
    userId: input.userId,
    originalPrompt: input.prompt,
    status: "submitted",
  });

  await recordAuditEvent({
    requestId: request.id,
    eventType: "request_submitted",
    message: "Natural language request submitted.",
    metadata: { prompt: input.prompt, userId: input.userId },
  });

  const parsedActions = await parsePromptToActions(input.prompt);
  await recordAuditEvent({
    requestId: request.id,
    eventType: "actions_extracted",
    message: "Actions extracted from prompt.",
    metadata: { actions: parsedActions },
  });

  const classifiedActions: ClassifiedAction[] = [];

  for (const action of parsedActions) {
    const recipientType = await classifyRecipientForAction(action, input.prompt);
    const riskLevel = classifyActionRisk(action, recipientType);
    const authorization = await evaluateAuthorization(requester, riskLevel);

    classifiedActions.push({
      ...action,
      recipientType,
      riskLevel,
      requiresApproval: authorization.requiresApproval,
      assignedApproverId: authorization.approverId,
      actionStatus: authorization.allowedDirect
        ? "approved_direct"
        : "pending_approval",
    });
  }

  const createdActions = await createActions(
    classifiedActions.map((action) => ({
      requestId: request.id,
      actionName: action.action,
      target: action.target,
      recipientEmail: action.recipientEmail ?? null,
      recipientGroup: action.recipientGroup ?? null,
      recipientType: action.recipientType,
      riskLevel: action.riskLevel,
      status: action.actionStatus,
      approverId: action.assignedApproverId,
      rationale: action.rationale ?? null,
    })),
  );

  for (const action of createdActions) {
    await recordAuditEvent({
      requestId: request.id,
      actionId: action.id,
      eventType: "recipient_classified",
      message: `Recipient classified for ${action.actionName}.`,
      metadata: {
        recipientEmail: action.recipientEmail,
        recipientGroup: action.recipientGroup,
        recipientType: action.recipientType,
      },
    });

    await recordAuditEvent({
      requestId: request.id,
      actionId: action.id,
      eventType: "risk_assigned",
      message: `Risk level assigned for ${action.actionName}.`,
      metadata: { riskLevel: action.riskLevel, status: action.status },
    });
  }

  for (const action of createdActions) {
    if (action.status === "pending_approval" && action.approverId) {
      await createApprovalForAction({
        requestId: action.requestId,
        actionId: action.id,
        approverId: action.approverId,
        fallbackApproverId: requester.backupApproverId,
      });
      continue;
    }

    if (action.status === "approved_direct") {
      await executeApprovedAction(action);
    }
  }

  const finalStatus = await syncRequestStatus(request.id);
  const hydratedRequest = await getRequestById(request.id);

  return {
    requestId: request.id,
    status: finalStatus,
    actions: hydratedRequest?.actions ?? createdActions,
  };
}
