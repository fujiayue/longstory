/** A single message in the conversation */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** If true, this is a "thought coordinate" annotation */
  isCoordinate?: boolean;
  /** If true, show thinking animation */
  thinking?: boolean;
}

/** Dialogue stage based on turn count */
export type DialogueStage = "rapport" | "clarify" | "test" | "deepen";

/** Result from fragment selection engine */
export interface FragmentSelection {
  text: string;
  matchedNodeId: string | null;
  mainNode: import("./thought-node").ThoughtNode | null;
  stage: DialogueStage;
  focusTerm: string | null;
  hitKeywords: string[];
}

/** The three app views */
export type AppView = "sky" | "intro" | "chat";
