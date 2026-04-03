import { getSupabaseServerClient } from "@/lib/db/supabase";
import {
  ActionRecord,
  ApprovalRecord,
  ApprovalWithAction,
  AuditLogRecord,
  ContactRecord,
  RecipientGroupRecord,
  RequestRecord,
  RequestStatus,
  RequestWithActions,
  User,
} from "@/lib/types/workflow";

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return mapUser(data);
}

export async function getManagerForUser(userId: string): Promise<User | null> {
  const user = await getUserById(userId);
  if (!user?.managerId) return null;
  return getUserById(user.managerId);
}

export async function createRequest(input: {
  userId: string;
  originalPrompt: string;
  status: RequestStatus;
}): Promise<RequestRecord> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("requests")
    .insert({
      user_id: input.userId,
      original_prompt: input.originalPrompt,
      status: input.status,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRequest(data);
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
): Promise<RequestRecord> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .select("*")
    .single();

  if (error) throw error;
  return mapRequest(data);
}

export async function createActions(
  actions: Array<{
    requestId: string;
    actionName: string;
    target: string | null;
    recipientEmail: string | null;
    recipientGroup: string | null;
    recipientType: ActionRecord["recipientType"];
    riskLevel: ActionRecord["riskLevel"];
    status: ActionRecord["status"];
    approverId: string | null;
    rationale: string | null;
  }>,
): Promise<ActionRecord[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("actions")
    .insert(
      actions.map((action) => ({
        request_id: action.requestId,
        action_name: action.actionName,
        target: action.target,
        recipient_email: action.recipientEmail,
        recipient_group: action.recipientGroup,
        recipient_type: action.recipientType,
        risk_level: action.riskLevel,
        status: action.status,
        approver_id: action.approverId,
        rationale: action.rationale,
      })),
    )
    .select("*");

  if (error) throw error;
  return (data ?? []).map(mapAction).filter(Boolean) as ActionRecord[];
}

export async function getActionById(actionId: string): Promise<ActionRecord | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("actions")
    .select("*")
    .eq("id", actionId)
    .maybeSingle();

  if (error) throw error;
  return mapAction(data);
}

export async function listActionsByRequestId(
  requestId: string,
): Promise<ActionRecord[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("actions")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapAction).filter(Boolean) as ActionRecord[];
}

export async function updateAction(input: {
  actionId: string;
  status?: ActionRecord["status"];
  approverId?: string | null;
  executionResult?: Record<string, unknown> | null;
}): Promise<ActionRecord> {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.status) payload.status = input.status;
  if (input.approverId !== undefined) payload.approver_id = input.approverId;
  if (input.executionResult !== undefined) {
    payload.execution_result = input.executionResult;
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("actions")
    .update(payload)
    .eq("id", input.actionId)
    .select("*")
    .single();

  if (error) throw error;
  return mapAction(data) as ActionRecord;
}

export async function listRequests(): Promise<RequestWithActions[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, users(*), actions(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => ({
    ...mapRequest(item),
    user: mapUser(item.users),
    actions: (item.actions ?? []).map(mapAction).filter(Boolean),
  }));
}

export async function getRequestById(requestId: string): Promise<RequestWithActions | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, users(*), actions(*)")
    .eq("id", requestId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...mapRequest(data),
    user: mapUser(data.users),
    actions: (data.actions ?? []).map(mapAction).filter(Boolean),
  };
}

export async function createApproval(input: {
  actionId: string;
  approverId: string;
  expiresAt?: string | null;
  escalatedTo?: string | null;
}): Promise<ApprovalRecord> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("approvals")
    .insert({
      action_id: input.actionId,
      approver_id: input.approverId,
      status: "pending",
      decision: "pending",
      expires_at: input.expiresAt ?? null,
      escalated_to: input.escalatedTo ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapApproval(data);
}

export async function getApprovalById(
  approvalId: string,
): Promise<ApprovalWithAction | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("approvals")
    .select("*, actions(*)")
    .eq("id", approvalId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...mapApproval(data),
    action: mapAction(data.actions),
  };
}

export async function updateApproval(input: {
  approvalId: string;
  status: ApprovalRecord["status"];
  decision: ApprovalRecord["decision"];
  reason?: string | null;
  decidedAt?: string | null;
}): Promise<ApprovalRecord> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("approvals")
    .update({
      status: input.status,
      decision: input.decision,
      reason: input.reason ?? null,
      decided_at: input.decidedAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.approvalId)
    .select("*")
    .single();

  if (error) throw error;
  return mapApproval(data);
}

export async function listPendingApprovalsForApprover(
  approverId: string,
): Promise<ApprovalWithAction[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("approvals")
    .select("*, actions(*)")
    .eq("approver_id", approverId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((item) => ({
    ...mapApproval(item),
    action: mapAction(item.actions),
  }));
}

export async function createAuditLog(input: {
  requestId?: string | null;
  actionId?: string | null;
  eventType: AuditLogRecord["eventType"];
  message: string;
  metadata?: Record<string, unknown> | null;
}): Promise<AuditLogRecord> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      request_id: input.requestId ?? null,
      action_id: input.actionId ?? null,
      event_type: input.eventType,
      message: input.message,
      metadata: input.metadata ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapAuditLog(data);
}

export async function listAuditLogs(): Promise<AuditLogRecord[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return (data ?? []).map(mapAuditLog);
}

export async function getContactByEmail(email: string): Promise<ContactRecord | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .ilike("email", email)
    .maybeSingle();

  if (error) throw error;
  return mapContact(data);
}

export async function getRecipientGroupByName(
  name: string,
): Promise<RecipientGroupRecord | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("recipient_groups")
    .select("*")
    .ilike("name", name)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    members: data.members ?? [],
    createdAt: data.created_at,
  };
}

function mapUser(data: Record<string, unknown> | null | undefined): User | null {
  if (!data) return null;
  return {
    id: String(data.id),
    name: String(data.name),
    email: String(data.email),
    role: data.role as User["role"],
    managerId: (data.manager_id as string | null) ?? null,
    backupApproverId: (data.backup_approver_id as string | null) ?? null,
    createdAt: String(data.created_at),
  };
}

function mapRequest(data: Record<string, unknown>): RequestRecord {
  return {
    id: String(data.id),
    userId: String(data.user_id),
    originalPrompt: String(data.original_prompt),
    status: data.status as RequestStatus,
    createdAt: String(data.created_at),
    updatedAt: String(data.updated_at),
  };
}

function mapAction(data: Record<string, unknown> | null | undefined): ActionRecord | null {
  if (!data) return null;
  return {
    id: String(data.id),
    requestId: String(data.request_id),
    actionName: String(data.action_name),
    target: (data.target as string | null) ?? null,
    recipientEmail: (data.recipient_email as string | null) ?? null,
    recipientGroup: (data.recipient_group as string | null) ?? null,
    recipientType: (data.recipient_type as ActionRecord["recipientType"]) ?? null,
    riskLevel: (data.risk_level as ActionRecord["riskLevel"]) ?? null,
    status: data.status as ActionRecord["status"],
    approverId: (data.approver_id as string | null) ?? null,
    rationale: (data.rationale as string | null) ?? null,
    executionResult:
      (data.execution_result as Record<string, unknown> | null | undefined) ?? null,
    createdAt: String(data.created_at),
    updatedAt: String(data.updated_at),
  };
}

function mapApproval(data: Record<string, unknown>): ApprovalRecord {
  return {
    id: String(data.id),
    actionId: String(data.action_id),
    approverId: String(data.approver_id),
    status: data.status as ApprovalRecord["status"],
    decision: data.decision as ApprovalRecord["decision"],
    reason: (data.reason as string | null) ?? null,
    expiresAt: (data.expires_at as string | null) ?? null,
    escalatedTo: (data.escalated_to as string | null) ?? null,
    decidedAt: (data.decided_at as string | null) ?? null,
    createdAt: String(data.created_at),
    updatedAt: String(data.updated_at),
  };
}

function mapContact(data: Record<string, unknown> | null | undefined): ContactRecord | null {
  if (!data) return null;
  return {
    id: String(data.id),
    name: String(data.name),
    email: String(data.email),
    type: data.type as ContactRecord["type"],
    source: String(data.source),
    company: (data.company as string | null) ?? null,
    createdAt: String(data.created_at),
  };
}

function mapAuditLog(data: Record<string, unknown>): AuditLogRecord {
  return {
    id: String(data.id),
    requestId: (data.request_id as string | null) ?? null,
    actionId: (data.action_id as string | null) ?? null,
    eventType: data.event_type as AuditLogRecord["eventType"],
    message: String(data.message),
    metadata: (data.metadata as Record<string, unknown> | null | undefined) ?? null,
    createdAt: String(data.created_at),
  };
}
