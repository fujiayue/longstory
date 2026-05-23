import { THOUGHT_OUTLINE } from "./outline";
import { THOUGHT_LINEAGE_ORDER, LINEAGE_CONNECTIONS } from "./lineage";
import { TRANSLATION_FRAGMENTS } from "./translations";
import { DEEP_FRAMEWORKS } from "./frameworks";
import { buildLaoziPrompt, LAOZI_BASE_PROMPT } from "../../../prompts/laozi";
import type { PhilosopherModule } from "../../../types";

export const LAOZI_MODULE: PhilosopherModule = {
  meta: {
    id: "laozi",
    name: "老子",
    en: "Laozi",
    era: "约前571–前471",
    x: 40,
    y: 45,
    unlocked: true,
    avatar: "道",
    color: "#6b9080",
    brief: "道家创始人，《道德经》作者，以无为与柔弱之道闻名于世",
    status: "active",
  },
  outline: THOUGHT_OUTLINE,
  lineageOrder: THOUGHT_LINEAGE_ORDER,
  lineageConnections: LINEAGE_CONNECTIONS,
  translations: TRANSLATION_FRAGMENTS,
  deepFrameworks: DEEP_FRAMEWORKS,
  greeting:
    "天地不仁，以万物为刍狗。你来了。有什么想问的，问。没有的话，坐一会儿也行。",
  mapTitle: "老子的思想脉络",
  mapSubtitle: "从道不可道到道法自然",
  initQuestions: ["道到底是什么？", "无为是什么都不做吗？"],
  basePrompt: LAOZI_BASE_PROMPT,
  buildPrompt: buildLaoziPrompt,
};
