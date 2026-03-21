import type { ThoughtNode, TranslationFragment } from "./thought-node";
import type { ChatMessage } from "./chat";

/** Metadata for a philosopher shown on the star map */
export interface PhilosopherMeta {
  id: string;
  name: string;
  en: string;
  era: string;
  /** Position in the star-map SVG (0-100 range) */
  x: number;
  y: number;
  unlocked: boolean;
  avatar: string;
  color: string;
  brief: string;
  /** Number of collected cards required to unlock */
  requireCards?: number;
  /** Number of chat turns required to unlock */
  requireChats?: number;
  /** 'active' = has content; 'coming-soon' = future batch, ghost display */
  status?: 'active' | 'coming-soon';
}

/** A pair of philosopher IDs that form a constellation line */
export type ConstellationEdge = [string, string];

/** A complete philosopher module bundling all knowledge and prompt logic */
export interface PhilosopherModule {
  meta: PhilosopherMeta;
  outline: ThoughtNode[];
  lineageOrder: string[];
  lineageConnections: [number, number][];
  translations: TranslationFragment[];
  deepFrameworks: Record<string, string>;
  /** Opening message shown when chat starts fresh */
  greeting: string;
  /** Thought map modal header title */
  mapTitle: string;
  /** Thought map modal header subtitle */
  mapSubtitle: string;
  /** Initial suggested questions shown at start of conversation */
  initQuestions: string[];
  basePrompt: string;
  buildPrompt: (
    userMsg: string,
    messages: ChatMessage[],
    exploredNodes: string[],
    turnCount: number,
    recentMatched: string[]
  ) => string;
}
