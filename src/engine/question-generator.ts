import type { ThoughtNode, DialogueStage } from "../types";

function pickPoolByStage(
  node: ThoughtNode,
  stage: DialogueStage,
  touched: boolean,
): string[] {
  // If node has been touched, prefer deeper questions
  if (touched) {
    if (stage === "rapport" || stage === "clarify")
      return [...(node.microQs || []), ...(node.macroQs || [])];
    return node.microQs || [];
  }
  // Untouched nodes: early stages show macro, later stages show micro
  if (stage === "rapport") return node.macroQs || [];
  if (stage === "clarify") return [...(node.macroQs || []), ...(node.microQs || [])];
  return [...(node.microQs || []), ...(node.macroQs || [])];
}

interface SuggestOpts {
  mainNode: ThoughtNode | null;
  stage: DialogueStage;
  focusTerm: string | null;
  exploredNodes: string[];
  usedQuestions: Set<string>;
  allNodes: ThoughtNode[];
  nodeHitCounts: Record<string, number>;
}

export function getSuggestedQuestions(opts: SuggestOpts): string[] {
  const {
    mainNode,
    stage,
    focusTerm,
    exploredNodes,
    usedQuestions,
    allNodes,
    nodeHitCounts,
  } = opts;

  const isTouched = (nodeId: string) => (nodeHitCounts[nodeId] || 0) > 0;

  const questions: string[] = [];
  const dedupe = (q: string) =>
    q && !questions.includes(q) && !usedQuestions.has(q);

  // 1. From current node's pool
  if (mainNode && questions.length < 2) {
    const pool = pickPoolByStage(mainNode, stage, isTouched(mainNode.id)).filter(
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
      const nnTouched = isTouched(nn.id);
      const bp = nnTouched
        ? [...(nn.microQs || []), ...(nn.macroQs || [])]
        : [...(nn.macroQs || []), ...(nn.microQs || [])];
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
      ...(mainNode.microQs || []),
    ].filter((q) => !usedQuestions.has(q) && !questions.includes(q));
    for (const q of ap) {
      questions.push(q);
      if (questions.length >= 3) break;
    }
  }

  // 5. Fill from other nodes (prefer unexplored, then explored)
  if (questions.length < 3) {
    const unexplored = allNodes.filter((n) => !exploredNodes.includes(n.id) && n.id !== mainNode?.id);
    const explored = allNodes.filter((n) => exploredNodes.includes(n.id) && n.id !== mainNode?.id);
    for (const n of [...unexplored, ...explored]) {
      const pool = [...(n.macroQs || []), ...(n.microQs || [])];
      for (const q of pool) {
        if (q && !usedQuestions.has(q) && !questions.includes(q)) {
          questions.push(q);
          if (questions.length >= 3) break;
        }
      }
      if (questions.length >= 3) break;
    }
  }

  return questions.slice(0, 3);
}
