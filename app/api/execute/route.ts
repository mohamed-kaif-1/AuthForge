import { executeActionIfApproved } from "@/lib/approvals/approval-service";
import { badRequest, ok, serverError } from "@/lib/http/responses";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const actionId = typeof body.actionId === "string" ? body.actionId.trim() : "";

    if (!actionId) {
      return badRequest("actionId is required.");
    }

    const result = await executeActionIfApproved(actionId);
    return ok(result);
  } catch (error) {
    return serverError(error);
  }
}
