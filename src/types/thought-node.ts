/** A knowledge card that pops up during conversation */
export interface KnowledgeCard {
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  source: string;
  whyNow: string;
  nextNode: string;
}

/** A reframing rule that maps user statements to Socratic redirects */
export interface ReframingRule {
  userSays: string;
  youHear: string;
}

/** A single thought node in a philosopher's intellectual outline */
export interface ThoughtNode {
  id: string;
  label: string;
  brief: string;
  icon: string;
  color: string;
  description: string;
  /** Socrates' introductory monologue for this domain */
  domainIntro: string;
  coreQuestions: string[];
  /** Which dialogue move this node aligns with */
  dialogueMove: "clarify" | "test" | "elevate";
  teachingGoal: string;
  nextLikelyNodes: string[];
  /** Big-picture questions (for rapport / early stage) */
  macroQs: string[];
  /** Mid-depth questions */
  midQs: string[];
  /** Micro-detail questions */
  microQs: string[];
  bridgeTemplates: string[];
  keywords: string[];
  thesis: string;
  tension: string;
  reframingRules: ReframingRule[];
  teachingHints: string[];
  biographicalRefs: string[];
  avoidWhen: string;
  commonMisuse: string[];
  /** Position in this philosopher's thought map (viewBox 0 0 100 130) */
  x: number;
  y: number;
  card: KnowledgeCard;
}

/** Modern-topic bridge fragment */
export interface TranslationFragment {
  structure: string;
  triggers: string[];
  bridgePrinciple: string;
  sampleQuestion: string;
}

/** Deep-dive framework keyed by node ID */
export type DeepFrameworks = Record<string, string>;

/** Connection between lineage indices: [fromIdx, toIdx] */
export type LineageConnection = [number, number];
