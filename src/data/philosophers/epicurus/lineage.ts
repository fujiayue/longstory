export const THOUGHT_LINEAGE_ORDER: string[] = [
  "garden",
  "tetrapharmakos",
  "hedone",
  "canon",
  "atomism",
  "cosmos",
  "theology",
  "death",
  "ataraxia",
];

// [fromIndex, toIndex] — indices into THOUGHT_OUTLINE array
export const LINEAGE_CONNECTIONS: [number, number][] = [
  [0, 1],  // canon → atomism
  [0, 4],  // canon → hedone
  [1, 2],  // atomism → cosmos
  [1, 6],  // atomism → death
  [2, 3],  // cosmos → theology
  [3, 7],  // theology → tetrapharmakos
  [4, 5],  // hedone → ataraxia
  [4, 8],  // hedone → garden
  [6, 7],  // death → tetrapharmakos
  [5, 8],  // ataraxia → garden
  [7, 8],  // tetrapharmakos → garden
];
