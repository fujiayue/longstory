import type { PhilosopherMeta, UnlockProgress } from "../types";
import ConstellationLines from "./ConstellationLines";
import StarNode from "./StarNode";

interface Props {
  philosophers: PhilosopherMeta[];
  onStarClick: (p: PhilosopherMeta) => void;
  unlockProgressMap: Record<string, UnlockProgress>;
}

export default function StarMap({ philosophers, onStarClick, unlockProgressMap }: Props) {
  return (
    <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
      <svg viewBox="0 0 100 110" style={{ width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
        <ConstellationLines philosophers={philosophers} />
        {philosophers.map((p) => (
          <StarNode key={p.id} p={p} onClick={onStarClick} unlockProgress={unlockProgressMap[p.id]} />
        ))}
      </svg>
    </div>
  );
}
