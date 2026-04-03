import { listAuditLogs } from "@/lib/db/repositories";
import { ok, serverError } from "@/lib/http/responses";

export async function GET() {
  try {
    const logs = await listAuditLogs();
    return ok({ logs });
  } catch (error) {
    return serverError(error);
  }
}
