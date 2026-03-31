import type { PhilosopherMeta, UnlockProgress } from "../types";
import ConstellationLines from "./ConstellationLines";
import StarNode from "./StarNode";

interface Props {
  philosophers: PhilosopherMeta[];
  onStarClick: (p: PhilosopherMeta) => void;
  unlockProgressMap: Record<string, UnlockProgress>;
  offsetX?: number;
  offsetY?: number;
  isDragging?: boolean;
}

export default function StarMap({
  philosophers,
  onStarClick,
  unlockProgressMap,
  offsetX = 0,
  offsetY = 0,
  isDragging = false,
}: Props) {
  const clampedX = Math.max(-140, Math.min(140, offsetX * 0.35));
  const clampedY = Math.max(-140, Math.min(140, offsetY * 0.35));

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        height: "100%",
        transform: `translate(${clampedX}px, ${clampedY}px)`,
        transition: isDragging ? "none" : "transform 0.6s ease-out",
      }}
    >
      <svg
        viewBox="0 0 100 110"
        style={{ width: "100%", height: "100%" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <ConstellationLines philosophers={philosophers} />
        {philosophers.map((p) => (
          <StarNode
            key={p.id}
            p={p}
            onClick={onStarClick}
            unlockProgress={unlockProgressMap[p.id]}
          />
        ))}
      </svg>
    </div>
  );
}
