import type { ApiConfig } from "../types";

let apiConfig: ApiConfig = {
  provider: "anthropic",
  apiKey: "",
  endpoint: "",
  model: "",
  temperature: 0.7,
};

export function setApiConfig(cfg: ApiConfig) {
  apiConfig = cfg;
}

export function getApiConfig(): ApiConfig {
  return apiConfig;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

/**
 * Send a request to the configured AI provider.
 * Handles both Anthropic and OpenAI-compatible APIs transparently.
 */
export async function callAI(
  systemPrompt: string,
  chatMessages: ChatMsg[],
  maxTokens = 1024,
): Promise<string> {
  const cfg = apiConfig;

  if (cfg.provider === "anthropic") {
    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": cfg.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: maxTokens,
        temperature: cfg.temperature,
        system: systemPrompt,
        messages: chatMessages,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as any).error?.message || `Anthropic API error: HTTP ${res.status}`,
      );
    }

    const data = await res.json();
    return (
      (data as any).content
        ?.map((b: any) => (b.type === "text" ? b.text : ""))
        .filter(Boolean)
        .join("\n") || ""
    );
  }

  // OpenAI-compatible
  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: maxTokens,
      temperature: cfg.temperature,
      messages: [{ role: "system", content: systemPrompt }, ...chatMessages],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as any).error?.message || `API error: HTTP ${res.status}`,
    );
  }

  const data = await res.json();
  return (data as any).choices?.[0]?.message?.content || "";
}
