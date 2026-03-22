import { THOUGHT_OUTLINE } from "./outline";
import { THOUGHT_LINEAGE_ORDER, LINEAGE_CONNECTIONS } from "./lineage";
import { TRANSLATION_FRAGMENTS } from "./translations";
import { DEEP_FRAMEWORKS } from "./frameworks";
import { buildPlatoPrompt, PLATO_BASE_PROMPT } from "../../../prompts/plato";
import type { PhilosopherModule } from "../../../types";

export const PLATO_MODULE: PhilosopherModule = {
  meta: {
    id: "plato",
    name: "柏拉图",
    en: "Plato",
    era: "428–348 BC",
    x: 35,
    y: 24,
    unlocked: false,
    avatar: "Π",
    color: "#7EB8DA",
    brief: "理念论的创立者，苏格拉底最重要的学生",
    status: "active",
  },
  outline: THOUGHT_OUTLINE,
  lineageOrder: THOUGHT_LINEAGE_ORDER,
  lineageConnections: LINEAGE_CONNECTIONS,
  translations: TRANSLATION_FRAGMENTS,
  deepFrameworks: DEEP_FRAMEWORKS,
  greeting:
    "你好。你是第一次来找我，还是带着某个已经困惑了你很久的问题？不管是哪种情况——我建议我们从一个故事开始。",
  mapTitle: "柏拉图的思想脉络",
  mapSubtitle: "从洞穴到善的理念",
  initQuestions: ["柏拉图最著名的故事是什么？", "什么是真实的？"],
  basePrompt: PLATO_BASE_PROMPT,
  buildPrompt: buildPlatoPrompt,
};
