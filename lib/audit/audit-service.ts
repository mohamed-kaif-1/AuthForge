import { createAuditLog } from "@/lib/db/repositories";
import { AuditEventType } from "@/lib/types/workflow";

export async function recordAuditEvent(input: {
  requestId?: string | null;
  actionId?: string | null;
  eventType: AuditEventType;
  message: string;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  await createAuditLog({
    requestId: input.requestId ?? null,
    actionId: input.actionId ?? null,
    eventType: input.eventType,
    message: input.message,
    metadata: input.metadata ?? null,
  });
}
