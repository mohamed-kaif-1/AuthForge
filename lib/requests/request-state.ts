import { listActionsByRequestId, updateRequestStatus } from "@/lib/db/repositories";
import { ActionRecord, RequestStatus } from "@/lib/types/workflow";

export async function syncRequestStatus(requestId: string): Promise<RequestStatus> {
  const actions = await listActionsByRequestId(requestId);
  const status = deriveRequestStatus(actions);
  await updateRequestStatus(requestId, status);
  return status;
}

function deriveRequestStatus(actions: ActionRecord[]): RequestStatus {
  if (actions.length === 0) return "submitted";

  const hasRejected = actions.some((action) => action.status === "rejected");
  const hasPending = actions.some((action) => action.status === "pending_approval");
  const hasApprovedFamily = actions.some((action) => isApprovedFamily(action.status));

  if (actions.some((action) => action.status === "failed")) return "failed";
  if (actions.every((action) => action.status === "rejected")) return "rejected";

  if (hasPending) {
    if (hasApprovedFamily || hasRejected) return "partially_approved";
    return "pending_approval";
  }

  if (actions.every((action) => action.status === "executed")) return "executed";
  if (actions.every((action) => isApprovedFamily(action.status))) return "approved";
  if (hasRejected && hasApprovedFamily) return "partially_approved";
  if (actions.every((action) => action.status === "extracted")) return "parsed";

  return "parsed";
}

function isApprovedFamily(status: ActionRecord["status"]) {
  return (
    status === "approved_direct" ||
    status === "approved" ||
    status === "executing" ||
    status === "executed"
  );
}
