import { badRequest, ok, serverError } from "@/lib/http/responses";
import { submitGovernedRequest } from "@/lib/requests/request-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";

    if (!prompt || !userId) {
      return badRequest("Both userId and prompt are required.");
    }

    const result = await submitGovernedRequest({ userId, prompt });
    return ok(result, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
