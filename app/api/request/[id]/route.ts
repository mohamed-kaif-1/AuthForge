import { getRequestById } from "@/lib/db/repositories";
import { notFound, ok, serverError } from "@/lib/http/responses";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const request = await getRequestById(id);

    if (!request) {
      return notFound("Request not found.");
    }

    return ok({ request });
  } catch (error) {
    return serverError(error);
  }
}
