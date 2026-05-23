import { useMemo } from "react";
import type { PhilosopherMeta, ConstellationEdge } from "../types";
import { CONSTELLATION_EDGES as CONSTELLATIONS } from "../data/philosophers-meta";

interface Props {
  philosophers: PhilosopherMeta[];
}

export default function ConstellationLines({ philosophers }: Props) {
  const map = useMemo(
    () => Object.fromEntries(philosophers.map((p) => [p.id, p])),
    [philosophers],
  );

  return (
    <g>
      {CONSTELLATIONS.map(([a, b]: ConstellationEdge, i: number) => {
        const pa = map[a];
        const pb = map[b];
        if (!pa || !pb) return null;
        const lit = pa.unlocked || pb.unlocked;
        return (
          <line
            key={i}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={lit ? "rgba(200,210,255,0.13)" : "rgba(200,210,255,0.04)"}
            strokeWidth="0.15"
            strokeDasharray={lit ? "none" : "0.5,0.5"}
          />
        );
      })}
    </g>
  );
}
