import { Router, type Request, type Response } from "express";

const router = Router();

interface ChatRequestBody {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
}

/**
 * POST /api/chat
 * Proxies chat requests to DeepSeek. The API key is injected server-side.
 */
router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfigured: missing API key" });
    return;
  }

  const { systemPrompt, messages, maxTokens = 1024 } =
    req.body as ChatRequestBody;

  if (!systemPrompt || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing systemPrompt or messages" });
    return;
  }

  try {
    const upstream = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          max_tokens: maxTokens,
          temperature: 0.7,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
        }),
      },
    );

    if (!upstream.ok) {
      const err = await upstream.json().catch(() => ({}));
      res.status(upstream.status).json({
        error:
          (err as any).error?.message ||
          `DeepSeek API error: HTTP ${upstream.status}`,
      });
      return;
    }

    const data = await upstream.json();
    const content =
      (data as any).choices?.[0]?.message?.content || "";

    res.json({ content });
  } catch (err: any) {
    console.error("[chat] proxy error:", err.message);
    res.status(502).json({ error: "Failed to reach AI service" });
  }
});

export { router as chatRouter };
