import type { PhilosopherMeta, ConstellationEdge } from "../types";

export const PHILOSOPHERS: PhilosopherMeta[] = [
  { id: "laozi", name: "老子", en: "Laozi", era: "约前571–前471", x: 40, y: 45, unlocked: true, avatar: "道", color: "#6b9080", brief: "道家创始人，《道德经》作者，以无为与柔弱之道闻名于世", status: "active" },
  { id: "confucius", name: "孔子", en: "Confucius", era: "前551–前479", x: 62, y: 45, unlocked: false, avatar: "仁", color: "#c5a55a", brief: "儒家创始人，因材施教，以仁义礼治天下", status: "coming-soon" },
];

export const CONSTELLATION_EDGES: ConstellationEdge[] = [
  ["laozi", "confucius"],
];
