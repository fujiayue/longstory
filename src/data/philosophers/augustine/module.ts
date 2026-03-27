import { THOUGHT_OUTLINE } from "./outline";
import { THOUGHT_LINEAGE_ORDER, LINEAGE_CONNECTIONS } from "./lineage";
import { TRANSLATION_FRAGMENTS } from "./translations";
import { DEEP_FRAMEWORKS } from "./frameworks";
import { buildAugustinePrompt, AUGUSTINE_BASE_PROMPT } from "../../../prompts/augustine";
import type { PhilosopherModule } from "../../../types";

export const AUGUSTINE_MODULE: PhilosopherModule = {
  meta: {
    id: "augustine",
    name: "奥古斯丁",
    en: "Augustine",
    era: "354–430",
    x: 40,
    y: 56,
    unlocked: false,
    avatar: "A",
    color: "#D4A5C9",
    brief: "基督教哲学奠基者，《忏悔录》作者",
    status: "active",
  },
  outline: THOUGHT_OUTLINE,
  lineageOrder: THOUGHT_LINEAGE_ORDER,
  lineageConnections: LINEAGE_CONNECTIONS,
  translations: TRANSLATION_FRAGMENTS,
  deepFrameworks: DEEP_FRAMEWORKS,
  greeting:
    "我曾经是一个比你更迷失的人。如果你愿意，让我听听你的困惑——不是作为一个圣人，而是作为一个过来人。",
  mapTitle: "奥古斯丁的思想脉络",
  mapSubtitle: "从忏悔到安息",
  initQuestions: [
    "您年轻时沉迷世俗的快乐，后来为什么发生了转向？",
    "恶是一种真实存在的东西吗？",
  ],
  basePrompt: AUGUSTINE_BASE_PROMPT,
  buildPrompt: buildAugustinePrompt,
};
