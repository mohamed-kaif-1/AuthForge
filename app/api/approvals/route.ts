import { listPendingApprovalsForApprover } from "@/lib/db/repositories";
import { badRequest, ok, serverError } from "@/lib/http/responses";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const approverId = searchParams.get("approverId")?.trim() ?? "";

    if (!approverId) {
      return badRequest("approverId query parameter is required.");
    }

    const approvals = await listPendingApprovalsForApprover(approverId);
    return ok({ approvals });
  } catch (error) {
    return serverError(error);
  }
}
