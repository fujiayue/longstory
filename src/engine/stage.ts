import type { DialogueStage } from "../types";

export function getDialogueStage(turnCount: number): DialogueStage {
  if (turnCount <= 2) return "rapport";
  if (turnCount <= 4) return "clarify";
  if (turnCount <= 7) return "test";
  return "deepen";
}
