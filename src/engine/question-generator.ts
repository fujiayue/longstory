import type { ThoughtNode, DialogueStage } from "../types";

function pickPoolByStage(
  node: ThoughtNode,
  stage: DialogueStage,
): string[] {
  if (stage === "rapport") return node.macroQs || [];
  if (stage === "clarify") return [...(node.midQs || []), ...(node.macroQs || [])];
  if (stage === "test") return [...(node.midQs || []), ...(node.microQs || [])];
  return [...(node.microQs || []), ...(node.midQs || [])];
}

interface SuggestOpts {
  mainNode: ThoughtNode | null;
  stage: DialogueStage;
  focusTerm: string | null;
  exploredNodes: string[];
  usedQuestions: Set<string>;
  hitKeywords: string[];
  allNodes: ThoughtNode[];
}

export function getSuggestedQuestions(opts: SuggestOpts): string[] {
  const {
    mainNode,
    stage,
    focusTerm,
    exploredNodes,
    usedQuestions,
    hitKeywords,
    allNodes,
  } = opts;

  const questions: string[] = [];
  const dedupe = (q: string) =>
    q && !questions.includes(q) && !usedQuestions.has(q);

  // 1. Bridge template from keywords
  if (mainNode?.bridgeTemplates && hitKeywords?.length > 0) {
    const kw = hitKeywords.sort((a, b) => b.length - a.length)[0];
    for (const tpl of mainNode.bridgeTemplates) {
      const bq = tpl.replace("{keyword}", kw);
      if (dedupe(bq)) {
        questions.push(bq);
        break;
      }
    }
  }

  // 2. From current node's pool
  if (mainNode && questions.length < 2) {
    const pool = pickPoolByStage(mainNode, stage).filter(
      (q) => !usedQuestions.has(q) && !questions.includes(q),
    );
    const picked =
      (focusTerm
        ? pool.find((q) => q.includes(focusTerm) && dedupe(q))
        : null) || pool.find((q) => dedupe(q));
    if (picked) questions.push(picked);
  }

  // 3. From next-likely nodes
  if (mainNode?.nextLikelyNodes?.length && questions.length < 3) {
    for (const nid of mainNode.nextLikelyNodes) {
      const nn = allNodes.find((n) => n.id === nid);
      if (!nn) continue;
      const bp =
        stage === "deepen"
          ? [...(nn.midQs || []), ...(nn.macroQs || [])]
          : [...(nn.macroQs || []), ...(nn.midQs || [])];
      const bq = bp.find(
        (q) => !usedQuestions.has(q) && !questions.includes(q),
      );
      if (bq) {
        questions.push(bq);
        break;
      }
    }
  }

  // 4. Fallback from all pools of current node
  if (questions.length < 3 && mainNode) {
    const ap = [
      ...(mainNode.macroQs || []),
      ...(mainNode.midQs || []),
      ...(mainNode.microQs || []),
    ].filter((q) => !usedQuestions.has(q) && !questions.includes(q));
    for (const q of ap) {
      questions.push(q);
      if (questions.length >= 3) break;
    }
  }

  // 5. Last-resort: unexplored nodes
  if (questions.length === 0) {
    const ux = allNodes.filter((n) => !exploredNodes.includes(n.id));
    for (const n of ux.slice(0, 3)) {
      const q = (n.macroQs || [])[0];
      if (q && !usedQuestions.has(q)) questions.push(q);
    }
  }

  return questions.slice(0, 3);
}
