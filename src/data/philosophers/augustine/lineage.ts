export const THOUGHT_LINEAGE_ORDER: string[] = [
  "confession",
  "divided_will",
  "free_will",
  "truth",
  "evil",
  "grace",
  "rest_in_god",
  "trinity",
  "soul_love",
];

// [fromIndex, toIndex] — indices into THOUGHT_OUTLINE array
export const LINEAGE_CONNECTIONS: [number, number][] = [
  [0, 1],  // confession → divided_will
  [0, 8],  // confession → soul_love
  [1, 2],  // divided_will → free_will
  [1, 4],  // divided_will → evil
  [2, 5],  // free_will → grace
  [3, 4],  // truth → evil
  [3, 7],  // truth → trinity
  [4, 5],  // evil → grace
  [5, 6],  // grace → rest_in_god
  [6, 7],  // rest_in_god → trinity
  [7, 8],  // trinity → soul_love
  [8, 6],  // soul_love → rest_in_god
];
