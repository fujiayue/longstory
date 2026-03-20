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
}

/** A pair of philosopher IDs that form a constellation line */
export type ConstellationEdge = [string, string];

/** Provider presets for AI configuration */
export interface ProviderPreset {
  label: string;
  endpoint: string;
  model: string;
  temperature: number;
  helpUrl: string;
}

export interface ApiConfig {
  provider: "anthropic" | "openai-compat";
  apiKey: string;
  endpoint: string;
  model: string;
  temperature: number;
}

/** A complete philosopher module bundling all knowledge and prompt logic */
export interface PhilosopherModule {
  meta: PhilosopherMeta;
  outline: ThoughtNode[];
  lineageOrder: string[];
  lineageConnections: [number, number][];
  translations: TranslationFragment[];
  deepFrameworks: Record<string, string>;
  basePrompt: string;
  buildPrompt: (
    userMsg: string,
    messages: ChatMessage[],
    exploredNodes: string[],
    turnCount: number,
    recentMatched: string[]
  ) => string;
}
