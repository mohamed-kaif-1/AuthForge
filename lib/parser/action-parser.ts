import { ParsedAction } from "@/lib/types/workflow";

interface LlmParserResponse {
  actions?: ParsedAction[];
}

const ACTION_DICTIONARY: Array<{ pattern: RegExp; action: string }> = [
  { pattern: /\bmerge\b.*\bproduction\b.*\bpr\b/i, action: "merge_production_pr" },
  { pattern: /\bsend\b.*\bemail\b/i, action: "send_external_email" },
  { pattern: /\bdraft\b.*\brelease\b.*\bemail\b/i, action: "draft_release_email" },
  { pattern: /\bpost\b.*\bupdate\b/i, action: "post_internal_update" },
  { pattern: /\bcreate\b.*\bmeeting\b/i, action: "create_meeting" },
  { pattern: /\bsummarize\b|\bsummary\b/i, action: "summarize_data" },
  { pattern: /\brevoke\b.*\baccess\b/i, action: "revoke_access" },
];

export async function parsePromptToActions(prompt: string): Promise<ParsedAction[]> {
  const normalizedPrompt = prompt.trim();
  if (!normalizedPrompt) return [];

  if (process.env.OPENAI_API_KEY) {
    const llmActions = await tryLlmActionParse(normalizedPrompt);
    if (llmActions.length > 0) return llmActions;
  }

  return fallbackParse(normalizedPrompt);
}

async function tryLlmActionParse(prompt: string): Promise<ParsedAction[]> {
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        input: [
          {
            role: "system",
            content:
              "Extract normalized backend actions from the request. Respond with JSON only: {\"actions\":[{\"action\":\"string\",\"target\":\"string|null\",\"recipientEmail\":\"string|null\",\"recipientGroup\":\"string|null\",\"rationale\":\"string\"}]}. Never decide approval or risk.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) return [];
    const payload = await response.json();
    const content = payload.output?.[0]?.content?.[0]?.text;
    if (!content) return [];

    const parsed = JSON.parse(content) as LlmParserResponse;
    return normalizeParsedActions(parsed.actions ?? []);
  } catch {
    return [];
  }
}

function fallbackParse(prompt: string): ParsedAction[] {
  const segments = prompt
    .split(/\band\b|,/i)
    .map((segment) => segment.trim())
    .filter(Boolean);

  const actions = segments.map((segment) => {
    const resolved = ACTION_DICTIONARY.find((entry) => entry.pattern.test(segment));
    const email = extractEmail(segment);
    const recipientGroup = extractRecipientGroup(segment);
    const actionName =
      resolved?.action ??
      (email || recipientGroup ? "send_external_email" : "draft_content");

    return {
      action: actionName,
      target: inferTarget(segment, actionName),
      recipientEmail: email,
      recipientGroup,
      rationale: `Fallback parser matched segment: "${segment}"`,
    };
  });

  return normalizeParsedActions(actions);
}

function normalizeParsedActions(actions: ParsedAction[]): ParsedAction[] {
  return actions.map((action) => ({
    action: action.action.trim().toLowerCase(),
    target: action.target?.trim() || null,
    recipientEmail: action.recipientEmail?.trim().toLowerCase() || null,
    recipientGroup: action.recipientGroup?.trim().toLowerCase() || null,
    rationale: action.rationale ?? null,
  }));
}

function extractEmail(input: string): string | null {
  const match = input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match?.[0] ?? null;
}

function extractRecipientGroup(input: string): string | null {
  if (/\ball customers\b/i.test(input)) return "all_customers";
  if (/\ball employees\b|\bcompany-wide\b/i.test(input)) return "all_employees";
  if (/\bvendors\b/i.test(input)) return "vendors";
  if (/\bsecurity channel\b/i.test(input)) return "security_channel";
  return null;
}

function inferTarget(segment: string, actionName: string): string | null {
  if (actionName === "merge_production_pr") return "github_repo";
  if (actionName === "revoke_access" && /\brepo/i.test(segment)) return "github_repo";
  if (/\bcustomer/i.test(segment)) return "customers";
  if (/\bemployee\b|\binternal\b/i.test(segment)) return "employees";
  if (/\bslack\b|\bchannel\b/i.test(segment)) return "slack_workspace";
  return null;
}
