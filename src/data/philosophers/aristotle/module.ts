import { THOUGHT_OUTLINE } from "./outline";
import { THOUGHT_LINEAGE_ORDER, LINEAGE_CONNECTIONS } from "./lineage";
import { TRANSLATION_FRAGMENTS } from "./translations";
import { DEEP_FRAMEWORKS } from "./frameworks";
import { buildAristotlePrompt, ARISTOTLE_BASE_PROMPT } from "../../../prompts/aristotle";
import type { PhilosopherModule } from "../../../types";

export const ARISTOTLE_MODULE: PhilosopherModule = {
  meta: {
    id: "aristotle",
    name: "亚里士多德",
    en: "Aristotle",
    era: "384–322 BC",
    x: 20,
    y: 40,
    unlocked: false,
    avatar: "Α",
    color: "#A8D5A2",
    brief: "逻辑学之父，柏拉图的学生，亚历山大大帝的老师",
    status: "active",
  },
  outline: THOUGHT_OUTLINE,
  lineageOrder: THOUGHT_LINEAGE_ORDER,
  lineageConnections: LINEAGE_CONNECTIONS,
  translations: TRANSLATION_FRAGMENTS,
  deepFrameworks: DEEP_FRAMEWORKS,
  greeting:
    "你好。我们先做个区分：你是来听我讲，还是带着一个具体的问题来的？两种情况我都欢迎，但我们的对话会走向不同的地方。",
  mapTitle: "亚里士多德的思想脉络",
  mapSubtitle: "从四因到幸福",
  initQuestions: ["为什么一件事会发生？", "什么是真正的幸福？"],
  basePrompt: ARISTOTLE_BASE_PROMPT,
  buildPrompt: buildAristotlePrompt,
};
