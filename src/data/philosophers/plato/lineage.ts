export const THOUGHT_LINEAGE_ORDER: string[] = [
  "cave",
  "eidos",
  "the_good",
  "anamnesis",
  "tripartite_soul",
  "justice",
  "philosopher_king",
  "eros_ascent",
  "immortality",
];

// [fromIndex, toIndex] — indices into THOUGHT_OUTLINE array
export const LINEAGE_CONNECTIONS: [number, number][] = [
  [0, 1],  // cave → eidos
  [0, 2],  // cave → the_good
  [1, 2],  // eidos → the_good
  [3, 0],  // anamnesis → cave
  [3, 1],  // anamnesis → eidos
  [4, 5],  // tripartite_soul → justice
  [5, 6],  // justice → philosopher_king
  [2, 6],  // the_good → philosopher_king
  [4, 7],  // tripartite_soul → eros_ascent
  [7, 2],  // eros_ascent → the_good
  [3, 8],  // anamnesis → immortality
  [8, 2],  // immortality → the_good
];
