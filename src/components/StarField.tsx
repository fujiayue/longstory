import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  size: number
  brightness: number
  layer: number
  twinkleSpeed: number
  twinkleOffset: number
  color: string
}

interface NebulaParticle {
  x: number
  y: number
  size: number
  brightness: number
  color: string
}

interface Props {
  offsetX?: number
  offsetY?: number
}

export default function StarField({ offsetX = 0, offsetY = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const nebulaRef = useRef<NebulaParticle[]>([])
  // 平滑插值后的渲染偏移（背景缓动，比星图慢，造成纵深感）
  const renderOffset = useRef({ x: 0, y: 0 })
  const inputOffset = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  // 同步外部传入的偏移
  useEffect(() => {
    inputOffset.current = { x: offsetX, y: offsetY }
  }, [offsetX, offsetY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // ── 生成星星 ──────────────────────────────────────────────────
    function generateStars(w: number, h: number): Star[] {
      const stars: Star[] = []
      const colors = ["#ffffff", "#fff8f0", "#f0f0ff", "#ffe8d0", "#d0e8ff", "#ffd0e0"]

      const layers = [
        { count: 600, sizeRange: [0.3, 0.8],  brightnessRange: [0.15, 0.4],  twinkle: [0.3, 0.8]  },
        { count: 350, sizeRange: [0.5, 1.5],  brightnessRange: [0.3,  0.65], twinkle: [0.5, 1.5]  },
        { count: 150, sizeRange: [1.0, 2.5],  brightnessRange: [0.5,  0.85], twinkle: [0.8, 2.3]  },
        { count: 50,  sizeRange: [1.5, 3.5],  brightnessRange: [0.7,  1.0],  twinkle: [1.0, 3.0]  },
      ]

      layers.forEach((cfg, layerIdx) => {
        for (let i = 0; i < cfg.count; i++) {
          stars.push({
            x: Math.random() * w * 1.6 - w * 0.3,
            y: Math.random() * h * 1.6 - h * 0.3,
            size: cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0]),
            brightness: cfg.brightnessRange[0] + Math.random() * (cfg.brightnessRange[1] - cfg.brightnessRange[0]),
            layer: layerIdx,
            twinkleSpeed: cfg.twinkle[0] + Math.random() * (cfg.twinkle[1] - cfg.twinkle[0]),
            twinkleOffset: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
          })
        }
      })
      return stars
    }

    // ── 生成银河星云粒子 ──────────────────────────────────────────
    function generateNebula(w: number, h: number): NebulaParticle[] {
      const particles: NebulaParticle[] = []

      const coreColors  = ["255,180,120", "255,200,150", "255,160,140", "220,180,200", "255,220,180"]
      const outerColors = ["180,160,220", "150,140,200", "120,140,180", "200,200,255", "160,180,220"]

      // 银河主带（贝塞尔曲线路径，从左上到右侧）
      const sx = -w * 0.1, sy = -h * 0.1
      const mx = w  * 0.35, my = h  * 0.4
      const ex = w  * 0.9,  ey = h  * 0.5
      const angle = Math.atan2(ey - sy, ex - sx)
      const perp  = angle + Math.PI / 2

      for (let i = 0; i < 4000; i++) {
        const t = Math.random()
        const u = 1 - t
        const cx = u*u*sx + 2*u*t*mx + t*t*ex
        const cy = u*u*sy + 2*u*t*my + t*t*ey
        const spread = (60 + 120 * Math.sin(t * Math.PI)) * (0.5 + Math.random() * 0.5)
        const off = (Math.random() - 0.5) * spread * 2
        const distRatio = Math.abs(off) / spread
        const isCore = distRatio < 0.3
        const col = isCore
          ? coreColors[Math.floor(Math.random() * coreColors.length)]
          : outerColors[Math.floor(Math.random() * outerColors.length)]
        particles.push({
          x: cx + Math.cos(perp) * off,
          y: cy + Math.sin(perp) * off,
          size: 0.5 + Math.random() * 2.5,
          brightness: (isCore ? 0.15 + Math.random() * 0.25 : 0.05 + Math.random() * 0.15)
                      * (1 - Math.pow(distRatio, 1.5)),
          color: col,
        })
      }

      // 核心高密度带
      for (let i = 0; i < 1500; i++) {
        const t = 0.2 + Math.random() * 0.5
        const u = 1 - t
        const cx = u*u*sx + 2*u*t*mx + t*t*ex
        const cy = u*u*sy + 2*u*t*my + t*t*ey
        const off = (Math.random() - 0.5) * (25 + Math.random() * 40)
        particles.push({
          x: cx + Math.cos(perp) * off,
          y: cy + Math.sin(perp) * off,
          size: 0.8 + Math.random() * 2,
          brightness: 0.2 + Math.random() * 0.35,
          color: coreColors[Math.floor(Math.random() * coreColors.length)],
        })
      }

      // 散落尘埃云
      for (let i = 0; i < 800; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.7,
          size: 1 + Math.random() * 3,
          brightness: 0.02 + Math.random() * 0.05,
          color: outerColors[Math.floor(Math.random() * outerColors.length)],
        })
      }

      return particles
    }

    // ── Resize ────────────────────────────────────────────────────
    function resize() {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas!.width  = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width  = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.scale(dpr, dpr)
      starsRef.current  = generateStars(w, h)
      nebulaRef.current = generateNebula(w, h)
    }

    // ── 主绘制循环 ────────────────────────────────────────────────
    const startTime = performance.now()
    function draw() {
      const time = (performance.now() - startTime) / 1000
      const w = window.innerWidth
      const h = window.innerHeight

      // 平滑插值（背景缓动比星图慢，增加纵深感）
      renderOffset.current.x += (inputOffset.current.x - renderOffset.current.x) * 0.06
      renderOffset.current.y += (inputOffset.current.y - renderOffset.current.y) * 0.06
      const ro = renderOffset.current

      // 背景渐变
      const bg = ctx!.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.9)
      bg.addColorStop(0,   "#1a1a3a")
      bg.addColorStop(0.3, "#12122a")
      bg.addColorStop(0.6, "#0d0d20")
      bg.addColorStop(1,   "#08081a")
      ctx!.fillStyle = bg
      ctx!.fillRect(0, 0, w, h)

      // 星云辉光底层
      ctx!.save()
      ctx!.translate(ro.x * 0.2, ro.y * 0.2)
      const glow = ctx!.createRadialGradient(w * 0.25, h * 0.25, 0, w * 0.3, h * 0.35, w * 0.5)
      glow.addColorStop(0,   "rgba(255,200,150,0.12)")
      glow.addColorStop(0.3, "rgba(200,160,180,0.08)")
      glow.addColorStop(0.6, "rgba(150,140,200,0.04)")
      glow.addColorStop(1,   "rgba(100,100,150,0)")
      ctx!.fillStyle = glow
      ctx!.fillRect(-100, -100, w + 200, h + 200)
      ctx!.restore()

      // 银河粒子
      ctx!.save()
      ctx!.translate(ro.x * 0.25, ro.y * 0.25)
      nebulaRef.current.forEach((p) => {
        if (p.x < -50 || p.x > w + 50 || p.y < -50 || p.y > h + 50) return
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${p.color},${p.brightness})`
        ctx!.fill()
      })
      ctx!.restore()

      // 四层星星（视差）
      const parallax = [0.15, 0.3, 0.5, 0.7]
      starsRef.current.forEach((star) => {
        const sx = star.x + ro.x * parallax[star.layer]
        const sy = star.y + ro.y * parallax[star.layer]
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) return

        const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
        const alpha   = star.brightness * twinkle

        // 亮星加辉光
        if (star.layer >= 2 && star.brightness > 0.5) {
          const glowR = star.size * 4
          const sg = ctx!.createRadialGradient(sx, sy, 0, sx, sy, glowR)
          sg.addColorStop(0,   `rgba(255,255,255,${alpha * 0.4})`)
          sg.addColorStop(0.3, `rgba(200,220,255,${alpha * 0.15})`)
          sg.addColorStop(1,   "rgba(150,180,255,0)")
          ctx!.beginPath()
          ctx!.arc(sx, sy, glowR, 0, Math.PI * 2)
          ctx!.fillStyle = sg
          ctx!.fill()
        }

        // 星点核心
        const hex = star.color.slice(1)
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        ctx!.beginPath()
        ctx!.arc(sx, sy, star.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx!.fill()

        // 最亮星加十字光芒
        if (star.layer === 3 && star.brightness > 0.8) {
          ctx!.strokeStyle = `rgba(255,255,255,${alpha * 0.3})`
          ctx!.lineWidth = 0.5
          const spike = star.size * 6
          ctx!.beginPath(); ctx!.moveTo(sx - spike, sy); ctx!.lineTo(sx + spike, sy); ctx!.stroke()
          ctx!.beginPath(); ctx!.moveTo(sx, sy - spike); ctx!.lineTo(sx, sy + spike); ctx!.stroke()
        }
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  )
}
