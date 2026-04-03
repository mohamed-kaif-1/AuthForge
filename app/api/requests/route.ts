import { listRequests } from "@/lib/db/repositories";
import { ok, serverError } from "@/lib/http/responses";

export async function GET() {
  try {
    const requests = await listRequests();
    return ok({ requests });
  } catch (error) {
    return serverError(error);
  }
}
