import { DEFAULT_POLICIES } from "@/lib/config/policy";
import { ParsedAction, RecipientType, RiskLevel } from "@/lib/types/workflow";

export function classifyActionRisk(
  action: ParsedAction,
  recipientType: RecipientType | null,
): RiskLevel {
  if (DEFAULT_POLICIES.highRiskActions.has(action.action)) return "high";
  if (DEFAULT_POLICIES.mediumRiskActions.has(action.action)) return "medium";
  if (DEFAULT_POLICIES.lowRiskActions.has(action.action)) return "low";

  if (action.action.includes("send")) {
    return classifySendActionRisk(recipientType, action);
  }

  return "medium";
}

function classifySendActionRisk(
  recipientType: RecipientType | null,
  action: ParsedAction,
): RiskLevel {
  if (action.recipientGroup === "all_customers") return "high";
  if (recipientType === "internal") return "medium";
  if (recipientType === "customer") return "high";
  if (recipientType === "vendor") return "medium";
  if (recipientType === "unknown_external") {
    return DEFAULT_POLICIES.unknownExternalEmailRisk;
  }
  return "medium";
}
