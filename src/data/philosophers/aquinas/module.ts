import { THOUGHT_OUTLINE } from "./outline";
import { THOUGHT_LINEAGE_ORDER, LINEAGE_CONNECTIONS } from "./lineage";
import { TRANSLATION_FRAGMENTS } from "./translations";
import { DEEP_FRAMEWORKS } from "./frameworks";
import { buildAquinasPrompt, AQUINAS_BASE_PROMPT } from "../../../prompts/aquinas";
import type { PhilosopherModule } from "../../../types";

export const AQUINAS_MODULE: PhilosopherModule = {
  meta: {
    id: "aquinas",
    name: "阿奎那",
    en: "Thomas Aquinas",
    era: "1225–1274",
    x: 55,
    y: 68,
    unlocked: false,
    avatar: "T",
    color: "#C4A882",
    brief: "经院哲学集大成者，《神学大全》作者",
    status: "active",
  },
  outline: THOUGHT_OUTLINE,
  lineageOrder: THOUGHT_LINEAGE_ORDER,
  lineageConnections: LINEAGE_CONNECTIONS,
  translations: TRANSLATION_FRAGMENTS,
  deepFrameworks: DEEP_FRAMEWORKS,
  greeting:
    "朋友，欢迎你来探讨真理。在这里我们不预设立场——只用理性之光照亮我们面前的问题。你有什么想要追问的？",
  mapTitle: "阿奎那的思想脉络",
  mapSubtitle: "从存在到至福",
  initQuestions: [
    "天主的存在可以被理性证明吗？",
    "人的终极幸福究竟在于什么？",
  ],
  basePrompt: AQUINAS_BASE_PROMPT,
  buildPrompt: buildAquinasPrompt,
};
