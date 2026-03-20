import type { ChatMessage, FragmentSelection, ThoughtNode, TranslationFragment, DeepFrameworks } from "../types";
import { getDialogueStage } from "./stage";

interface SelectOptions {
  outline: ThoughtNode[];
  translations: TranslationFragment[];
  deepFrameworks: DeepFrameworks;
}

export function selectFragments(
  userMessage: string,
  messages: ChatMessage[],
  exploredNodes: string[],
  turnCount: number,
  recentMatchedNodes: string[],
  opts: SelectOptions,
): FragmentSelection {
  const { outline, translations, deepFrameworks } = opts;
  const allText = (
    userMessage +
    " " +
    messages
      .slice(-4)
      .map((m) => m.content)
      .join(" ")
  ).toLowerCase();
  const userLower = userMessage.toLowerCase();
  const stage = getDialogueStage(turnCount);

  const scored = outline.map((node) => {
    let kwScore = 0;
    const hitKeywords: string[] = [];
    for (const kw of node.keywords) {
      if (allText.includes(kw)) {
        kwScore += 2;
        if (userLower.includes(kw)) hitKeywords.push(kw);
      }
    }
    let stageScore = 0;
    if (stage === "clarify" && node.dialogueMove === "clarify") stageScore += 3;
    else if (stage === "test" && node.dialogueMove === "test") stageScore += 3;
    else if (
      stage === "deepen" &&
      (node.dialogueMove === "elevate" || node.dialogueMove === "test")
    )
      stageScore += 2;
    const noveltyScore = exploredNodes.includes(node.id) ? -1 : 2;
    return { node, total: kwScore + stageScore + noveltyScore, kwScore, hitKeywords };
  });

  scored.sort((a, b) => b.total - a.total);

  const best = scored[0];
  const mainNode =
    best && best.total >= 3 && best.kwScore >= 2 ? best.node : null;
  const focusTerm =
    best?.hitKeywords?.sort((a, b) => b.length - a.length)[0] ||
    mainNode?.label ||
    null;

  let transFragment: string | null = null;
  for (const tf of translations) {
    for (const t of tf.triggers) {
      if (allText.includes(t)) {
        transFragment =
          "【现代问题转译】" +
          tf.bridgePrinciple +
          "\n参考问法：" +
          tf.sampleQuestion;
        break;
      }
    }
    if (transFragment) break;
  }

  const stageHints: Record<string, string> = {
    rapport: "优先建立关系，不急于追打。",
    clarify: "适合索要定义。",
    test: "适合用一个反例检验。",
    deepen: "可以往更深层推进或做收束。",
  };

  const parts: string[] = [];
  if (stageHints[stage]) parts.push("【对话阶段】" + stageHints[stage]);

  if (mainNode) {
    const np: string[] = ["【相关思想节点：" + mainNode.label + "】"];
    if (mainNode.thesis) np.push("核心主张：" + mainNode.thesis);
    if (mainNode.tension) np.push("张力：" + mainNode.tension);
    if (mainNode.teachingHints?.length)
      np.push("可用素材：" + mainNode.teachingHints.join("；"));
    if (mainNode.biographicalRefs?.length)
      np.push("可调用经历：" + mainNode.biographicalRefs.join("；"));
    if (mainNode.reframingRules) {
      for (const rule of mainNode.reframingRules) {
        if (userLower.includes(rule.userSays.substring(0, 4).toLowerCase())) {
          np.push("重新命名：" + rule.youHear);
          break;
        }
      }
    }
    if (mainNode.avoidWhen) np.push("注意回避：" + mainNode.avoidWhen);
    np.push("以上素材自然使用，不要逐条复述。");
    parts.push(np.join("\n"));
  }

  if (transFragment) parts.push(transFragment);

  if (
    mainNode &&
    recentMatchedNodes?.length >= 2 &&
    recentMatchedNodes.slice(-2).every((id) => id === mainNode.id) &&
    deepFrameworks[mainNode.id]
  ) {
    parts.push(deepFrameworks[mainNode.id]);
  }

  return {
    text: parts.join("\n\n"),
    matchedNodeId: mainNode?.id || null,
    mainNode,
    stage,
    focusTerm,
    hitKeywords: best?.hitKeywords || [],
  };
}
