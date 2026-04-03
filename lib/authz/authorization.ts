import { getManagerForUser } from "@/lib/db/repositories";
import {
  AuthorizationDecision,
  RiskLevel,
  User,
  UserRole,
} from "@/lib/types/workflow";

export async function evaluateAuthorization(
  requester: User,
  riskLevel: RiskLevel,
): Promise<AuthorizationDecision> {
  if (riskLevel === "low") {
    return {
      allowedDirect: true,
      requiresApproval: false,
      approverId: null,
      reason: "Low-risk actions can execute directly with audit logging.",
    };
  }

  if (riskLevel === "medium") {
    if (requester.role === "manager" || requester.role === "admin") {
      return {
        allowedDirect: true,
        requiresApproval: false,
        approverId: null,
        reason: "Managers and admins can directly execute medium-risk actions.",
      };
    }

    const manager = await getManagerForUser(requester.id);
    return {
      allowedDirect: false,
      requiresApproval: true,
      approverId: manager?.id ?? requester.backupApproverId,
      reason: "Employees need manager approval for medium-risk actions.",
    };
  }

  return highRiskDecision(requester);
}

function highRiskDecision(requester: User): AuthorizationDecision {
  const privilegedRoles: UserRole[] = ["admin", "service"];

  if (privilegedRoles.includes(requester.role)) {
    return {
      allowedDirect: false,
      requiresApproval: true,
      approverId: requester.backupApproverId,
      reason: "High-risk actions always require explicit approval, even for privileged users.",
    };
  }

  return {
    allowedDirect: false,
    requiresApproval: true,
    approverId: requester.managerId ?? requester.backupApproverId,
    reason: "High-risk actions always require explicit approval.",
  };
}
