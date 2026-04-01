import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  parallax: number;
  isCross: boolean;
}

interface Props {
  offsetX?: number;
  offsetY?: number;
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const len = r * 3.5;
  const w = r * 0.25;
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(i === 0 ? 0 : Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -len);
    ctx.lineTo(w, -r);
    ctx.lineTo(0, 0);
    ctx.lineTo(-w, -r);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export default function StarField({ offsetX = 0, offsetY = 0 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const frame = useRef(0);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    offsetRef.current = { x: offsetX, y: offsetY };
  }, [offsetX, offsetY]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let w: number, h: number, animId: number;

    function resize() {
      w = c!.width = window.innerWidth;
      h = c!.height = window.innerHeight;
      stars.current = Array.from({ length: 420 }, () => {
        const rnd = Math.random();
        const isFar = rnd < 0.6;
        const isMid = rnd < 0.9;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: isFar
            ? Math.random() * 0.5 + 0.2
            : isMid
            ? Math.random() * 0.8 + 0.4
            : Math.random() * 1.4 + 0.8,
          speed: isFar
            ? Math.random() * 0.002 + 0.0005
            : isMid
            ? Math.random() * 0.003 + 0.001
            : Math.random() * 0.005 + 0.002,
          phase: Math.random() * Math.PI * 2,
          parallax: isFar ? 0.03 : isMid ? 0.12 : 0.25,
          isCross: !isFar && Math.random() < (isMid ? 0.12 : 0.5),
        };
      });
    }

    function draw() {
      // 1. Draw deep blue/purple gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#080818");
      bgGrad.addColorStop(1, "#0d0a1a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Milky Way light band (Sagittarius direction: bottom-left to top-right)
      const mwGrad = ctx.createLinearGradient(0, h, w, 0);
      mwGrad.addColorStop(0, "rgba(8, 8, 24, 0)");
      mwGrad.addColorStop(0.3, "rgba(100, 120, 255, 0.04)");
      mwGrad.addColorStop(0.5, "rgba(180, 160, 255, 0.1)");
      mwGrad.addColorStop(0.7, "rgba(100, 120, 255, 0.04)");
      mwGrad.addColorStop(1, "rgba(8, 8, 24, 0)");
      ctx.fillStyle = mwGrad;
      ctx.fillRect(0, 0, w, h);

      const t = frame.current++;
      const { x: ox, y: oy } = offsetRef.current;

      for (const s of stars.current) {
        const a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        const px = ((s.x + ox * s.parallax) % w + w) % w;
        const py = ((s.y + oy * s.parallax) % h + h) % h;
        
        // Near stars warm white, far stars bluish white
        ctx.fillStyle =
          s.parallax > 0.15 ? `rgba(255,245,220,${a})` : `rgba(210,215,245,${a})`;
        ctx.globalAlpha = a;
        if (s.isCross) {
          drawSparkle(ctx, px, py, s.r);
        } else {
          ctx.beginPath();
          ctx.arc(px, py, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0 }} />;
}
