import { lookupContactByEmail } from "@/lib/contacts/contact-lookup";
import { notFound, ok, serverError } from "@/lib/http/responses";

interface RouteParams {
  params: Promise<{ email: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { email } = await params;
    const contact = await lookupContactByEmail(decodeURIComponent(email));

    if (!contact) {
      return notFound("Contact not found.");
    }

    return ok({ contact });
  } catch (error) {
    return serverError(error);
  }
}
