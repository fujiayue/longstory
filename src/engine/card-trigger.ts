import type { ThoughtNode } from "../types";

interface CardTriggerOpts {
  matchedNodeId: string | null;
  exploredNodes: string[];
  turnCount: number;
  lastCardTurn: number;
  outline: ThoughtNode[];
}

interface CardTriggerResult {
  /** Should we show the card modal? */
  showCard: boolean;
  /** Should we mark the node as explored (even without showing card)? */
  markExplored: boolean;
  /** The node to show, if any */
  node: ThoughtNode | null;
}

/**
 * Decides whether to pop a knowledge card based on conversation state.
 * Card only shows if: node is new, turn >= 3, and at least 3 turns since last card.
 */
export function evaluateCardTrigger(opts: CardTriggerOpts): CardTriggerResult {
  const { matchedNodeId, exploredNodes, turnCount, lastCardTurn, outline } = opts;

  if (!matchedNodeId || exploredNodes.includes(matchedNodeId)) {
    return { showCard: false, markExplored: false, node: null };
  }

  const node = outline.find((n) => n.id === matchedNodeId) ?? null;
  if (!node) {
    return { showCard: false, markExplored: false, node: null };
  }

  // Always mark as explored after turn 3
  if (turnCount < 3) {
    return { showCard: false, markExplored: false, node: null };
  }

  // Show card only if enough gap since last card
  const showCard = turnCount - lastCardTurn >= 3;

  return { showCard, markExplored: true, node };
}
