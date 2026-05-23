export const THOUGHT_LINEAGE_ORDER = [
  "dao_ineffable",
  "wuwei",
  "naturalness",
  "water",
  "reversal",
  "emptiness",
  "simplicity",
  "contentment",
  "infant",
  "governance",
];

export const LINEAGE_CONNECTIONS: [number, number][] = [
  [0, 1], // 道不可道 → 无为
  [0, 2], // 道不可道 → 道法自然
  [1, 3], // 无为 → 上善若水
  [1, 9], // 无为 → 治大国
  [2, 8], // 道法自然 → 复归于婴儿
  [3, 4], // 上善若水 → 反者道之动
  [4, 5], // 反者道之动 → 有无相生
  [4, 7], // 反者道之动 → 知足不辱
  [5, 6], // 有无相生 → 见素抱朴
  [6, 8], // 见素抱朴 → 复归于婴儿
  [7, 6], // 知足不辱 → 见素抱朴
];
