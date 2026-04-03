export type UserRole = "employee" | "manager" | "admin" | "service";

export type RequestStatus =
  | "submitted"
  | "parsed"
  | "pending_approval"
  | "partially_approved"
  | "approved"
  | "rejected"
  | "executed"
  | "failed";

export type ActionStatus =
  | "extracted"
  | "classified"
  | "approved_direct"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "executing"
  | "executed"
  | "failed";

export type RiskLevel = "low" | "medium" | "high";

export type RecipientType =
  | "internal"
  | "customer"
  | "vendor"
  | "unknown_external";

export type ApprovalDecision = "approved" | "rejected" | "pending";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";

export type AuditEventType =
  | "request_submitted"
  | "actions_extracted"
  | "recipient_classified"
  | "risk_assigned"
  | "approval_created"
  | "approval_approved"
  | "approval_rejected"
  | "execution_started"
  | "execution_completed"
  | "execution_failed";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId: string | null;
  backupApproverId: string | null;
  createdAt: string;
}

export interface RequestRecord {
  id: string;
  userId: string;
  originalPrompt: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ActionRecord {
  id: string;
  requestId: string;
  actionName: string;
  target: string | null;
  recipientEmail: string | null;
  recipientGroup: string | null;
  recipientType: RecipientType | null;
  riskLevel: RiskLevel | null;
  status: ActionStatus;
  approverId: string | null;
  rationale: string | null;
  executionResult: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRecord {
  id: string;
  actionId: string;
  approverId: string;
  status: ApprovalStatus;
  decision: ApprovalDecision;
  reason: string | null;
  expiresAt: string | null;
  escalatedTo: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  requestId: string | null;
  actionId: string | null;
  eventType: AuditEventType;
  message: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  type: RecipientType;
  source: string;
  company: string | null;
  createdAt: string;
}

export interface RecipientGroupRecord {
  id: string;
  name: string;
  type: RecipientType;
  members: string[];
  createdAt: string;
}

export interface ParsedAction {
  action: string;
  target: string | null;
  recipientEmail?: string | null;
  recipientGroup?: string | null;
  rationale?: string | null;
}

export interface ClassifiedAction extends ParsedAction {
  recipientType: RecipientType | null;
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  assignedApproverId: string | null;
  actionStatus: ActionStatus;
}

export interface AuthorizationDecision {
  allowedDirect: boolean;
  requiresApproval: boolean;
  approverId: string | null;
  reason: string;
}

export interface RequestWithActions extends RequestRecord {
  user?: User | null;
  actions: ActionRecord[];
}

export interface ApprovalWithAction extends ApprovalRecord {
  action?: ActionRecord | null;
}

export interface SubmitRequestInput {
  userId: string;
  prompt: string;
}

export interface ApproveActionInput {
  approvalId: string;
  approverId: string;
  reason?: string;
}

export interface RejectActionInput {
  approvalId: string;
  approverId: string;
  reason?: string;
}
