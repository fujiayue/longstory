import { THOUGHT_OUTLINE } from "./outline";
import { THOUGHT_LINEAGE_ORDER, LINEAGE_CONNECTIONS } from "./lineage";
import { TRANSLATION_FRAGMENTS } from "./translations";
import { DEEP_FRAMEWORKS } from "./frameworks";
import { buildEpicurusPrompt, EPICURUS_BASE_PROMPT } from "../../../prompts/epicurus";
import type { PhilosopherModule } from "../../../types";

export const EPICURUS_MODULE: PhilosopherModule = {
  meta: {
    id: "epicurus",
    name: "伊壁鸠鲁",
    en: "Epicurus",
    era: "341–270 BC",
    x: 66,
    y: 20,
    unlocked: false,
    avatar: "Ε",
    color: "#E8A87C",
    brief: "快乐主义哲学家，花园学派的创立者",
    status: "active",
  },
  outline: THOUGHT_OUTLINE,
  lineageOrder: THOUGHT_LINEAGE_ORDER,
  lineageConnections: LINEAGE_CONNECTIONS,
  translations: TRANSLATION_FRAGMENTS,
  deepFrameworks: DEEP_FRAMEWORKS,
  greeting:
    "朋友，欢迎。你是带着痛苦来的，还是带着好奇来的？不管是哪一种，花园的门对你敞开。让我们从最简单的事情开始谈起。",
  mapTitle: "伊壁鸠鲁的思想脉络",
  mapSubtitle: "从花园到心灵宁静",
  initQuestions: [
    "你为什么认为哲学若不能解除人的痛苦，就没有意义？",
    '为什么后人总把你误解为"只会吃喝享乐的人"？',
  ],
  basePrompt: EPICURUS_BASE_PROMPT,
  buildPrompt: buildEpicurusPrompt,
};
