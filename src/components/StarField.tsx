import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  parallax: number;
  isCross: boolean;
  warm: boolean;
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

      // 生成星星：银河带内密度是外部的 2.5 倍
      const list: Star[] = [];
      const total = 550;
      for (let i = 0; i < total; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;

        // 到银河中心线（从左下到右上）的距离
        const distToGalaxy = Math.abs(x + y - h) / Math.SQRT2;
        const inGalaxy = distToGalaxy < w * 0.22;

        // 不在银河带内的星星有 55% 概率跳过（增加带内密度）
        if (!inGalaxy && Math.random() > 0.45) continue;

        const rnd = Math.random();
        const isFar = rnd < 0.6;
        const isMid = rnd < 0.9;

        list.push({
          x,
          y,
          r: isFar
            ? Math.random() * 0.55 + 0.15
            : isMid
            ? Math.random() * 0.85 + 0.45
            : Math.random() * 1.5 + 0.9,
          speed: isFar
            ? Math.random() * 0.002 + 0.0005
            : isMid
            ? Math.random() * 0.003 + 0.001
            : Math.random() * 0.005 + 0.002,
          phase: Math.random() * Math.PI * 2,
          parallax: isFar ? 0.03 : isMid ? 0.12 : 0.25,
          isCross: !isFar && Math.random() < (isMid ? 0.1 : 0.45),
          warm: !isFar && Math.random() < 0.3,
        });
      }
      stars.current = list;
    }

    function draw() {
      const t = frame.current++;
      const { x: ox, y: oy } = offsetRef.current;

      // ── 层1：深蓝黑背景 ──
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, "#060818");
      bgGrad.addColorStop(1, "#090c20");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // ── 层2：银河星云底层辉光（椭圆）──
      ctx.globalCompositeOperation = "source-over";
      const nebulaGrad = ctx.createRadialGradient(
        w * 0.52, h * 0.48, 0,
        w * 0.52, h * 0.48, w * 0.65
      );
      nebulaGrad.addColorStop(0, "rgba(100, 85, 210, 0.13)");
      nebulaGrad.addColorStop(0.5, "rgba(70, 60, 170, 0.07)");
      nebulaGrad.addColorStop(1, "rgba(50, 40, 130, 0)");
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, w, h);

      // ── 层3：银河主带（多层叠加，screen 混合）──
      ctx.globalCompositeOperation = "screen";

      // 外层宽辉光
      const mw1 = ctx.createLinearGradient(0, h, w, 0);
      mw1.addColorStop(0.1, "rgba(80, 100, 220, 0)");
      mw1.addColorStop(0.4, "rgba(120, 140, 255, 0.18)");
      mw1.addColorStop(0.5, "rgba(180, 190, 255, 0.28)");
      mw1.addColorStop(0.6, "rgba(120, 140, 255, 0.18)");
      mw1.addColorStop(0.9, "rgba(80, 100, 220, 0)");
      ctx.fillStyle = mw1;
      ctx.fillRect(0, 0, w, h);

      // 内层核心亮带
      const mw2 = ctx.createLinearGradient(0, h, w, 0);
      mw2.addColorStop(0.3, "rgba(160, 170, 255, 0)");
      mw2.addColorStop(0.46, "rgba(200, 210, 255, 0.22)");
      mw2.addColorStop(0.5, "rgba(235, 240, 255, 0.52)");
      mw2.addColorStop(0.54, "rgba(200, 210, 255, 0.22)");
      mw2.addColorStop(0.7, "rgba(160, 170, 255, 0)");
      ctx.fillStyle = mw2;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "source-over";

      // ── 层4：星星 ──
      for (const s of stars.current) {
        const a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        const px = ((s.x + ox * s.parallax) % w + w) % w;
        const py = ((s.y + oy * s.parallax) % h + h) % h;

        ctx.fillStyle = s.warm
          ? `rgba(255,242,200,${a})`
          : s.parallax > 0.15
          ? `rgba(255,248,235,${a})`
          : `rgba(190,205,255,${a})`;
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

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
