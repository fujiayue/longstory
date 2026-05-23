import { useEffect, useRef } from "react"

interface Props {
  offsetX?: number
  offsetY?: number
}

export default function StarField({ offsetX = 0, offsetY = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderOffset = useRef({ x: 0, y: 0 })
  const inputOffset = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  useEffect(() => {
    inputOffset.current = { x: offsetX, y: offsetY }
  }, [offsetX, offsetY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.scale(dpr, dpr)
    }

    function drawMountainLayer(
      w: number, h: number,
      baseY: number, amplitude: number, segments: number,
      color: string, parallax: number, ox: number, oy: number
    ) {
      const px = ox * parallax
      const py = oy * parallax
      ctx!.beginPath()
      ctx!.moveTo(-10 + px, h)
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * (w + 20) - 10 + px
        const progress = i / segments
        const y = baseY + py
          + Math.sin(progress * Math.PI * 1.3 + 0.5) * amplitude * 0.7
          + Math.sin(progress * Math.PI * 2.7 + 1.2) * amplitude * 0.3
          + Math.sin(progress * Math.PI * 5.1 + 2.8) * amplitude * 0.1
        ctx!.lineTo(x, y)
      }
      ctx!.lineTo(w + 10 + px, h)
      ctx!.closePath()
      ctx!.fillStyle = color
      ctx!.fill()
    }

    const startTime = performance.now()

    function draw() {
      const time = (performance.now() - startTime) / 1000
      const w = window.innerWidth
      const h = window.innerHeight

      renderOffset.current.x += (inputOffset.current.x - renderOffset.current.x) * 0.06
      renderOffset.current.y += (inputOffset.current.y - renderOffset.current.y) * 0.06
      const ro = renderOffset.current

      // Sky gradient — deep ink wash
      const sky = ctx!.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, "#0a0e14")
      sky.addColorStop(0.3, "#111820")
      sky.addColorStop(0.6, "#151e28")
      sky.addColorStop(1, "#1a2530")
      ctx!.fillStyle = sky
      ctx!.fillRect(0, 0, w, h)

      // Moon glow
      const moonX = w * 0.75
      const moonY = h * 0.15
      const moonGlow = ctx!.createRadialGradient(moonX, moonY, 0, moonX, moonY, w * 0.3)
      moonGlow.addColorStop(0, "rgba(220,210,185,0.2)")
      moonGlow.addColorStop(0.2, "rgba(190,195,200,0.1)")
      moonGlow.addColorStop(0.5, "rgba(170,180,190,0.04)")
      moonGlow.addColorStop(1, "rgba(150,160,170,0)")
      ctx!.fillStyle = moonGlow
      ctx!.fillRect(0, 0, w, h)

      // Moon disc
      ctx!.beginPath()
      ctx!.arc(moonX, moonY, 20, 0, Math.PI * 2)
      ctx!.fillStyle = "rgba(230,225,210,0.25)"
      ctx!.fill()

      // Far mountains (lightest, most blue — 青山远黛)
      drawMountainLayer(w, h, h * 0.42, h * 0.15, 80, "rgba(50,75,100,0.35)", 0.08, ro.x, ro.y)

      // Mid-far mountains
      drawMountainLayer(w, h, h * 0.50, h * 0.18, 60, "rgba(40,60,85,0.45)", 0.15, ro.x, ro.y)

      // Mid mountains
      drawMountainLayer(w, h, h * 0.58, h * 0.14, 50, "rgba(30,48,68,0.55)", 0.22, ro.x, ro.y)

      // Mist between mid and near mountains
      const mistY = h * 0.55
      const mistAlpha = 0.08 + 0.04 * Math.sin(time * 0.3)
      const mist = ctx!.createLinearGradient(0, mistY - h * 0.08, 0, mistY + h * 0.12)
      mist.addColorStop(0, "rgba(160,180,200,0)")
      mist.addColorStop(0.3, `rgba(160,180,200,${mistAlpha})`)
      mist.addColorStop(0.7, `rgba(140,165,190,${mistAlpha * 0.7})`)
      mist.addColorStop(1, "rgba(140,165,190,0)")
      ctx!.fillStyle = mist
      ctx!.fillRect(0, mistY - h * 0.1, w, h * 0.25)

      // Near-mid mountains
      drawMountainLayer(w, h, h * 0.66, h * 0.12, 40, "rgba(22,35,50,0.7)", 0.3, ro.x, ro.y)

      // Near mountains (darkest, solid silhouette)
      drawMountainLayer(w, h, h * 0.78, h * 0.10, 30, "rgba(12,20,30,0.9)", 0.4, ro.x, ro.y)

      // Foreground mist
      const fgMistAlpha = 0.06 + 0.03 * Math.sin(time * 0.2 + 1)
      const fgMist = ctx!.createLinearGradient(0, h * 0.75, 0, h)
      fgMist.addColorStop(0, "rgba(140,165,190,0)")
      fgMist.addColorStop(0.5, `rgba(120,145,170,${fgMistAlpha})`)
      fgMist.addColorStop(1, `rgba(100,125,150,${fgMistAlpha * 1.5})`)
      ctx!.fillStyle = fgMist
      ctx!.fillRect(0, h * 0.72, w, h * 0.3)

      // Sparse stars in the sky area
      const starSeed = 42
      for (let i = 0; i < 60; i++) {
        const hash = Math.sin(i * 127.1 + starSeed) * 43758.5453
        const sx = ((hash - Math.floor(hash)) * w * 1.2 - w * 0.1) + ro.x * 0.05
        const hash2 = Math.sin(i * 269.5 + starSeed) * 43758.5453
        const sy = (hash2 - Math.floor(hash2)) * h * 0.4
        const hash3 = Math.sin(i * 419.2 + starSeed) * 43758.5453
        const size = 0.3 + (hash3 - Math.floor(hash3)) * 1.2
        const twinkle = 0.3 + 0.7 * Math.sin(time * (0.5 + i * 0.1) + i)
        ctx!.beginPath()
        ctx!.arc(sx, sy, size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(200,210,220,${0.3 * twinkle})`
        ctx!.fill()
      }

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
