import { RecipientType, RiskLevel } from "@/lib/types/workflow";

export const COMPANY_DOMAIN = process.env.COMPANY_DOMAIN ?? "company.com";

export const APPROVAL_TIMEOUT_HOURS = Number(
  process.env.APPROVAL_TIMEOUT_HOURS ?? "24",
);

export const UNKNOWN_EXTERNAL_EMAIL_RISK: RiskLevel =
  (process.env.UNKNOWN_EXTERNAL_EMAIL_RISK as RiskLevel) ?? "high";

export const DEFAULT_POLICIES = {
  companyDomain: COMPANY_DOMAIN,
  approvalTimeoutHours: APPROVAL_TIMEOUT_HOURS,
  unknownExternalEmailRisk: UNKNOWN_EXTERNAL_EMAIL_RISK,
  highRiskActions: new Set([
    "send_customer_email",
    "send_external_email",
    "merge_production_pr",
    "revoke_access",
    "delete_resource",
  ]),
  mediumRiskActions: new Set([
    "send_internal_email",
    "create_meeting",
    "post_internal_update",
  ]),
  lowRiskActions: new Set([
    "read_data",
    "summarize_data",
    "draft_release_email",
    "draft_content",
  ]),
  externalRecipientTypes: new Set<RecipientType>([
    "customer",
    "vendor",
    "unknown_external",
  ]),
};
