import { PRESET_ANSWERS_PART1 } from "./answers-part1";
import { PRESET_ANSWERS_PART2 } from "./answers-part2";

export const PRESET_ANSWERS: Record<string, string> = {
  ...PRESET_ANSWERS_PART1,
  ...PRESET_ANSWERS_PART2,
};

export function getPresetAnswer(question: string): string | null {
  return PRESET_ANSWERS[question] ?? null;
}
