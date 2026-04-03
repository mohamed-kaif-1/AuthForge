import { approveAction } from "@/lib/approvals/approval-service";
import { badRequest, ok, serverError } from "@/lib/http/responses";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const approvalId =
      typeof body.approvalId === "string" ? body.approvalId.trim() : "";
    const approverId =
      typeof body.approverId === "string" ? body.approverId.trim() : "";
    const reason = typeof body.reason === "string" ? body.reason.trim() : undefined;

    if (!approvalId || !approverId) {
      return badRequest("approvalId and approverId are required.");
    }

    const result = await approveAction({ approvalId, approverId, reason });
    return ok(result);
  } catch (error) {
    return serverError(error);
  }
}
