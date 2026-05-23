import type { PhilosopherModule } from "../../types";
import { LAOZI_MODULE } from "./laozi/module";
import { getPresetAnswer as getLaoziPresetAnswer } from "./laozi/answers";

const MODULES: Record<string, PhilosopherModule> = {
  laozi: LAOZI_MODULE,
};

const PRESET_ANSWER_MAP: Record<string, (q: string) => string | null> = {
  laozi: getLaoziPresetAnswer,
};

/** Load a philosopher's full module by id. Returns null if not yet built. */
export function loadPhilosopher(id: string): PhilosopherModule | null {
  return MODULES[id] ?? null;
}

/** Get a preset answer for a question, keyed by philosopher id. */
export function getPresetAnswer(philosopherId: string, question: string): string | null {
  const fn = PRESET_ANSWER_MAP[philosopherId];
  return fn ? fn(question) : null;
}

export * as laozi from "./laozi";
