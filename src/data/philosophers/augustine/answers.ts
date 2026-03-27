/**
 * 奥古斯丁引导问题的预设答案库
 * 当用户点击引导问题卡片时，直接返回对应答案，不调用 API
 */

import { PRESET_ANSWERS_PART1 } from "./answers-part1";
import { PRESET_ANSWERS_PART2 } from "./answers-part2";

const PRESET_ANSWERS: Record<string, string> = {
  ...PRESET_ANSWERS_PART1,
  ...PRESET_ANSWERS_PART2,
};

/** Look up a preset answer by exact question text */
export function getPresetAnswer(question: string): string | null {
  return PRESET_ANSWERS[question] ?? null;
}

export { PRESET_ANSWERS };
