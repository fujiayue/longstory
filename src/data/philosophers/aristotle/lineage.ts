export const THOUGHT_LINEAGE_ORDER: string[] = [
  "four_causes",
  "syllogism",
  "hylomorphism",
  "potentiality",
  "psyche",
  "eudaimonia",
  "virtue",
  "polis",
  "prime_mover",
];

// [fromIndex, toIndex] — indices into THOUGHT_OUTLINE array
// THOUGHT_OUTLINE order: 0:four_causes, 1:hylomorphism, 2:potentiality,
//   3:eudaimonia, 4:virtue, 5:psyche, 6:polis, 7:prime_mover, 8:syllogism
export const LINEAGE_CONNECTIONS: [number, number][] = [
  [0, 1],  // four_causes → hylomorphism
  [0, 2],  // four_causes → potentiality
  [0, 8],  // four_causes → syllogism（方法论入口）
  [1, 2],  // hylomorphism → potentiality（形质是潜能/现实的基础）
  [1, 5],  // hylomorphism → psyche（灵魂是身体的形式）
  [2, 3],  // potentiality → eudaimonia（充分实现即幸福）
  [2, 7],  // potentiality → prime_mover（实现链溯源至第一原动者）
  [3, 4],  // eudaimonia → virtue（幸福需要德性）
  [3, 5],  // eudaimonia → psyche（灵魂功能是幸福的基础）
  [4, 6],  // virtue → polis（德性在城邦中实践）
  [6, 3],  // polis → eudaimonia（城邦是个人幸福的条件）
  [8, 0],  // syllogism → four_causes（逻辑方法服务于因果分析）
];
