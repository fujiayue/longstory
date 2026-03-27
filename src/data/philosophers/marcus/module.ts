import { THOUGHT_OUTLINE } from "./outline";
import { THOUGHT_LINEAGE_ORDER, LINEAGE_CONNECTIONS } from "./lineage";
import { TRANSLATION_FRAGMENTS } from "./translations";
import { DEEP_FRAMEWORKS } from "./frameworks";
import { buildMarcusPrompt, MARCUS_BASE_PROMPT } from "../../../prompts/marcus";
import type { PhilosopherModule } from "../../../types";

export const MARCUS_MODULE: PhilosopherModule = {
  meta: {
    id: "marcus",
    name: "马可·奥勒留",
    en: "Marcus Aurelius",
    era: "121–180",
    x: 76,
    y: 42,
    unlocked: false,
    avatar: "M",
    color: "#8B7D6B",
    brief: "哲学家皇帝，斯多葛学派的实践者",
    status: "active",
  },
  outline: THOUGHT_OUTLINE,
  lineageOrder: THOUGHT_LINEAGE_ORDER,
  lineageConnections: LINEAGE_CONNECTIONS,
  translations: TRANSLATION_FRAGMENTS,
  deepFrameworks: DEEP_FRAMEWORKS,
  greeting:
    "你来了。说说你的困境——不需要修饰，不需要铺垫。我在军营里听过太多真话，不怕再多一句。",
  mapTitle: "马可·奥勒留的思想脉络",
  mapSubtitle: "从内心堡垒到德行实践",
  initQuestions: [
    "客观事物本身能否触及或伤害我们的灵魂？",
    "作为拥有无上权力的罗马皇帝，您如何时时警惕自己？",
  ],
  basePrompt: MARCUS_BASE_PROMPT,
  buildPrompt: buildMarcusPrompt,
};
