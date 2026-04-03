import { APPROVAL_TIMEOUT_HOURS } from "@/lib/config/policy";
import { recordAuditEvent } from "@/lib/audit/audit-service";
import {
  createApproval,
  getActionById,
  getApprovalById,
  updateAction,
  updateApproval,
} from "@/lib/db/repositories";
import { executeApprovedAction } from "@/lib/execution/execution-service";
import { syncRequestStatus } from "@/lib/requests/request-state";
import { ApproveActionInput, RejectActionInput } from "@/lib/types/workflow";

export async function createApprovalForAction(input: {
  requestId: string;
  actionId: string;
  approverId: string;
  fallbackApproverId?: string | null;
}): Promise<void> {
  const expiresAt = new Date(
    Date.now() + APPROVAL_TIMEOUT_HOURS * 60 * 60 * 1000,
  ).toISOString();

  await createApproval({
    actionId: input.actionId,
    approverId: input.approverId,
    expiresAt,
    escalatedTo: input.fallbackApproverId ?? null,
  });

  await updateAction({
    actionId: input.actionId,
    status: "pending_approval",
    approverId: input.approverId,
  });

  await syncRequestStatus(input.requestId);
  await recordAuditEvent({
    requestId: input.requestId,
    actionId: input.actionId,
    eventType: "approval_created",
    message: `Approval request created for action ${input.actionId}.`,
    metadata: {
      approverId: input.approverId,
      fallbackApproverId: input.fallbackApproverId ?? null,
      expiresAt,
    },
  });
}

export async function approveAction(input: ApproveActionInput) {
  const approval = await getApprovalById(input.approvalId);
  if (!approval || !approval.action) throw new Error("Approval not found.");
  if (approval.approverId !== input.approverId) {
    throw new Error("Approver is not assigned to this approval.");
  }
  if (approval.status !== "pending") throw new Error("Approval is no longer pending.");

  const decidedAt = new Date().toISOString();

  await updateApproval({
    approvalId: approval.id,
    status: "approved",
    decision: "approved",
    reason: input.reason ?? null,
    decidedAt,
  });

  const updatedAction = await updateAction({
    actionId: approval.action.id,
    status: "approved",
  });

  await syncRequestStatus(updatedAction.requestId);
  await recordAuditEvent({
    requestId: updatedAction.requestId,
    actionId: updatedAction.id,
    eventType: "approval_approved",
    message: `Approval granted for ${updatedAction.actionName}.`,
    metadata: { approverId: input.approverId, reason: input.reason ?? null },
  });

  return executeApprovedAction(updatedAction);
}

export async function rejectAction(input: RejectActionInput) {
  const approval = await getApprovalById(input.approvalId);
  if (!approval || !approval.action) throw new Error("Approval not found.");
  if (approval.approverId !== input.approverId) {
    throw new Error("Approver is not assigned to this approval.");
  }
  if (approval.status !== "pending") throw new Error("Approval is no longer pending.");

  const decidedAt = new Date().toISOString();

  await updateApproval({
    approvalId: approval.id,
    status: "rejected",
    decision: "rejected",
    reason: input.reason ?? null,
    decidedAt,
  });

  const updatedAction = await updateAction({
    actionId: approval.action.id,
    status: "rejected",
  });

  await syncRequestStatus(updatedAction.requestId);
  await recordAuditEvent({
    requestId: updatedAction.requestId,
    actionId: updatedAction.id,
    eventType: "approval_rejected",
    message: `Approval rejected for ${updatedAction.actionName}.`,
    metadata: { approverId: input.approverId, reason: input.reason ?? null },
  });

  return updatedAction;
}

export async function executeActionIfApproved(actionId: string) {
  const action = await getActionById(actionId);
  if (!action) throw new Error("Action not found.");
  if (action.status !== "approved" && action.status !== "approved_direct") {
    throw new Error("Action must be approved before execution.");
  }

  return executeApprovedAction(action);
}
