import type { ThoughtNode } from "../types";

interface CardTriggerOpts {
  matchedNodeId: string | null;
  nodeHitCounts: Record<string, number>;
  exploredNodes: string[];
  outline: ThoughtNode[];
}

interface CardTriggerResult {
  showCard: boolean;
  showTouchNotice: boolean;
  markExplored: boolean;
  node: ThoughtNode | null;
  hitCount: number;
}

/**
 * Three-state card trigger:
 * - hitCount 1   → "已触及" → show touch notice, node lights up in map
 * - hitCount 2   → building up, no action
 * - hitCount 3+  → "已深入" → show full card, mark explored, collect card
 * - already explored → no action
 */
export function evaluateCardTrigger(opts: CardTriggerOpts): CardTriggerResult {
  const { matchedNodeId, nodeHitCounts, exploredNodes, outline } = opts;
  const empty: CardTriggerResult = { showCard: false, showTouchNotice: false, markExplored: false, node: null, hitCount: 0 };

  if (!matchedNodeId) return empty;

  const node = outline.find((n) => n.id === matchedNodeId) ?? null;
  if (!node) return empty;

  // +1 because we haven't incremented yet when this is called
  const hitCount = (nodeHitCounts[matchedNodeId] || 0) + 1;

  // Already fully explored → no action
  if (exploredNodes.includes(matchedNodeId)) {
    return { ...empty, node, hitCount };
  }

  // First touch → show card directly and mark explored
  return { showCard: true, showTouchNotice: false, markExplored: true, node, hitCount };
}
