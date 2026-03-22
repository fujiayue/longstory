import type { PhilosopherModule } from "../../types";
import { SOCRATES_MODULE } from "./socrates/module";
import { PLATO_MODULE } from "./plato/module";
import { ARISTOTLE_MODULE } from "./aristotle/module";
import { getPresetAnswer as getSocratesPresetAnswer } from "./socrates/answers";
import { getPresetAnswer as getPlatoPresetAnswer } from "./plato/answers";

const MODULES: Record<string, PhilosopherModule> = {
  socrates: SOCRATES_MODULE,
  plato: PLATO_MODULE,
  aristotle: ARISTOTLE_MODULE,
};

const PRESET_ANSWER_MAP: Record<string, (q: string) => string | null> = {
  socrates: getSocratesPresetAnswer,
  plato: getPlatoPresetAnswer,
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

export * as socrates from "./socrates";
export * as plato from "./plato";
export * as aristotle from "./aristotle";
