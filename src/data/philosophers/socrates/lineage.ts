import type { LineageConnection } from "../../../types";

/** Recommended exploration order (guides the UI, not a hard lock) */
export const THOUGHT_LINEAGE_ORDER: string[] = [
  "ignorance",           // 1. 自知无知 — 起点
  "elenchus",            // 2. 反诘法 — 方法
  "philosopher_sophist", // 3. 哲人与智者 — 身份定位
  "virtue",              // 4. 德性即知识 — 核心命题
  "soul",                // 5. 灵魂的关怀 — 价值排序
  "examined",            // 6. 审视人生 — 实践选择
  "truth_rhetoric",      // 7. 真理与修辞 — 表达观
  "gadfly",              // 8. 牛虻使命 — 社会角色
  "eros",                // 9. 爱与美 — 超越之路
  "daimonion",           // 10. 守护精灵 — 理性之外
  "death",               // 11. 死亡不是恶 — 终章
];

/** [fromIndex, toIndex] — pairs index into THOUGHT_LINEAGE_ORDER.
 *  First 10 are the sequential main line; rest are cross-links. */
export const LINEAGE_CONNECTIONS: LineageConnection[] = [
  // Main line
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  // Cross-links
  [0, 3],  // 自知无知 → 德性即知识（无知是恶的根源）
  [4, 8],  // 灵魂的关怀 → 爱与美（灵魂的上升）
  [5, 10], // 审视人生 → 死亡不是恶（用命做的选择）
];
