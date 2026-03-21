import { THOUGHT_OUTLINE } from "./outline";
import { THOUGHT_LINEAGE_ORDER, LINEAGE_CONNECTIONS } from "./lineage";
import { TRANSLATION_FRAGMENTS } from "./translations";
import { DEEP_FRAMEWORKS } from "./frameworks";
import { buildSocratesPrompt, SOCRATES_BASE_PROMPT } from "../../../prompts/socrates";
import type { PhilosopherModule } from "../../../types";

export const SOCRATES_MODULE: PhilosopherModule = {
  meta: {
    id: "socrates",
    name: "苏格拉底",
    en: "Socrates",
    era: "469–399 BC",
    x: 50,
    y: 38,
    unlocked: true,
    avatar: "Σ",
    color: "#F5C542",
    brief: "古希腊哲学之父，以反诘法闻名于世",
    status: "active",
  },
  outline: THOUGHT_OUTLINE,
  lineageOrder: THOUGHT_LINEAGE_ORDER,
  lineageConnections: LINEAGE_CONNECTIONS,
  translations: TRANSLATION_FRAGMENTS,
  deepFrameworks: DEEP_FRAMEWORKS,
  greeting:
    "你好，朋友。你来找我，是有什么困惑，还是只是路过雅典的市集？不过我得提醒你——跟我聊天的人，最后往往比开始时更困惑。",
  mapTitle: "苏格拉底的思想脉络",
  mapSubtitle: "从无知到死亡",
  initQuestions: ["苏格拉底最看重什么？", "什么是真正的智慧？"],
  basePrompt: SOCRATES_BASE_PROMPT,
  buildPrompt: buildSocratesPrompt,
};
