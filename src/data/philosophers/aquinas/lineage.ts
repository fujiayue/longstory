/**
 * 阿奎那思想脉络的遍历顺序和节点间连线
 *
 * 节点索引（对应 outline.ts 中 THOUGHT_OUTLINE 的数组下标）：
 *   0 = five_ways       天主存在的五路论证
 *   1 = essence_existence 本质与存在
 *   2 = analogy          类比论
 *   3 = faith_reason     信仰与理性
 *   4 = creation         创造论
 *   5 = soul             灵魂论
 *   6 = natural_law      自然法
 *   7 = virtue           德性论
 *   8 = beatitude        至福
 */

/** 思想脉络的推荐遍历顺序 */
export const THOUGHT_LINEAGE_ORDER: string[] = [
  "five_ways",
  "essence_existence",
  "analogy",
  "faith_reason",
  "creation",
  "soul",
  "natural_law",
  "virtue",
  "beatitude",
];

/** 节点连线：[fromIndex, toIndex]（索引对应 THOUGHT_OUTLINE 数组） */
export const LINEAGE_CONNECTIONS: [number, number][] = [
  [0, 1],  // five_ways → essence_existence
  [0, 3],  // five_ways → faith_reason
  [1, 2],  // essence_existence → analogy
  [1, 4],  // essence_existence → creation
  [2, 3],  // analogy → faith_reason
  [3, 8],  // faith_reason → beatitude
  [4, 5],  // creation → soul
  [5, 7],  // soul → virtue
  [5, 8],  // soul → beatitude
  [6, 7],  // natural_law → virtue
  [3, 6],  // faith_reason → natural_law
  [7, 8],  // virtue → beatitude
];
