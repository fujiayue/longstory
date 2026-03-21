import rateLimit from "express-rate-limit";

/**
 * 60 requests per minute per IP.
 * Protects the DeepSeek API key from abuse.
 */
export const chatRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "请求过于频繁，请稍后再试" },
});
