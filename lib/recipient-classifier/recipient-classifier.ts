import {
  lookupContactByEmail,
  lookupRecipientGroup,
} from "@/lib/contacts/contact-lookup";
import { DEFAULT_POLICIES } from "@/lib/config/policy";
import { ParsedAction, RecipientType } from "@/lib/types/workflow";

export async function classifyRecipientForAction(
  action: ParsedAction,
  requestPrompt: string,
): Promise<RecipientType | null> {
  if (action.recipientEmail) {
    return classifyEmailRecipient(action.recipientEmail, requestPrompt);
  }

  if (action.recipientGroup) {
    const group = await lookupRecipientGroup(action.recipientGroup);
    if (group) return group.type;
    if (/customer/i.test(action.recipientGroup)) return "customer";
    if (/employee|internal|security_channel/i.test(action.recipientGroup)) {
      return "internal";
    }
  }

  if (action.target && /customer/i.test(action.target)) return "customer";
  if (/internal|employee|team|slack/i.test(requestPrompt)) return "internal";
  return null;
}

async function classifyEmailRecipient(
  email: string,
  requestPrompt: string,
): Promise<RecipientType> {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";

  if (domain === DEFAULT_POLICIES.companyDomain.toLowerCase()) {
    return "internal";
  }

  const contact = await lookupContactByEmail(email);
  if (contact) return contact.type;
  if (/vendor|supplier/i.test(requestPrompt)) return "vendor";
  return "unknown_external";
}
