interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

/**
 * Send a chat request via our backend proxy.
 * The backend injects the DeepSeek API key — no key touches the frontend.
 */
export async function callAI(
  systemPrompt: string,
  chatMessages: ChatMsg[],
  maxTokens = 1024,
): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemPrompt,
      messages: chatMessages,
      maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as any).error || `API error: HTTP ${res.status}`,
    );
  }

  const data = await res.json();
  return (data as any).content || "";
}
