export const THOUGHT_LINEAGE_ORDER: string[] = [
  "inner_citadel",
  "judgment",
  "self_examination",
  "emperor_discipline",
  "obstacle_is_way",
  "impermanence",
  "death",
  "nature_logos",
  "virtue_action",
];

// [fromIndex, toIndex] — indices into THOUGHT_OUTLINE array
export const LINEAGE_CONNECTIONS: [number, number][] = [
  [0, 1],  // inner_citadel → judgment
  [0, 2],  // inner_citadel → self_examination
  [1, 4],  // judgment → obstacle_is_way
  [2, 3],  // self_examination → emperor_discipline
  [3, 8],  // emperor_discipline → virtue_action
  [4, 5],  // obstacle_is_way → impermanence
  [5, 6],  // impermanence → death
  [5, 7],  // impermanence → nature_logos
  [7, 8],  // nature_logos → virtue_action
  [6, 8],  // death → virtue_action
  [1, 7],  // judgment → nature_logos
];
