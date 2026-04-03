import { recordAuditEvent } from "@/lib/audit/audit-service";
import { updateAction } from "@/lib/db/repositories";
import { syncRequestStatus } from "@/lib/requests/request-state";
import { ActionRecord } from "@/lib/types/workflow";

export async function executeApprovedAction(action: ActionRecord): Promise<ActionRecord> {
  await updateAction({ actionId: action.id, status: "executing" });

  await recordAuditEvent({
    requestId: action.requestId,
    actionId: action.id,
    eventType: "execution_started",
    message: `Execution started for ${action.actionName}.`,
  });

  try {
    const result = await simulateExecution(action);
    const updatedAction = await updateAction({
      actionId: action.id,
      status: "executed",
      executionResult: result,
    });

    await syncRequestStatus(action.requestId);
    await recordAuditEvent({
      requestId: action.requestId,
      actionId: action.id,
      eventType: "execution_completed",
      message: `Execution completed for ${action.actionName}.`,
      metadata: result,
    });

    return updatedAction;
  } catch (error) {
    const failureMessage =
      error instanceof Error ? error.message : "Unknown execution error";

    await updateAction({
      actionId: action.id,
      status: "failed",
      executionResult: { error: failureMessage },
    });

    await syncRequestStatus(action.requestId);
    await recordAuditEvent({
      requestId: action.requestId,
      actionId: action.id,
      eventType: "execution_failed",
      message: `Execution failed for ${action.actionName}.`,
      metadata: { error: failureMessage },
    });

    throw error;
  }
}

async function simulateExecution(
  action: ActionRecord,
): Promise<Record<string, unknown>> {
  return {
    executor: "mock-execution-layer",
    action: action.actionName,
    target: action.target,
    completedAt: new Date().toISOString(),
  };
}
