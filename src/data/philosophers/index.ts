import type { PhilosopherModule } from "../../types";
import { SOCRATES_MODULE } from "./socrates/module";

const MODULES: Record<string, PhilosopherModule> = {
  socrates: SOCRATES_MODULE,
};

/** Load a philosopher's full module by id. Returns null if not yet built. */
export function loadPhilosopher(id: string): PhilosopherModule | null {
  return MODULES[id] ?? null;
}

export * as socrates from "./socrates";
