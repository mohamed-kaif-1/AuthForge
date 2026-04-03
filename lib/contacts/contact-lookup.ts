import {
  getContactByEmail,
  getRecipientGroupByName,
} from "@/lib/db/repositories";
import { ContactRecord, RecipientGroupRecord } from "@/lib/types/workflow";

export async function lookupContactByEmail(
  email: string,
): Promise<ContactRecord | null> {
  return getContactByEmail(email.toLowerCase());
}

export async function lookupRecipientGroup(
  groupName: string,
): Promise<RecipientGroupRecord | null> {
  return getRecipientGroupByName(groupName.toLowerCase());
}
