import { useEffect, useRef } from 'react'

const BAR_COUNT = 44
const GAP_PX = 2
const DECAY = 0.94
const MIN_DRAW = 0.008

export function spikeValues(bars: Float32Array): void {
  const n = bars.length

  // Rough amplitude envelope: bass is loudest, rolls off toward treble,
  // with a mid bump and a randomised treble region — like a real beat.
  // Each bar then gets independent per-bar noise so no two adjacent bars
  // look the same (classic WinAmp / stereo analyser behaviour).
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)

    // Envelope: peaks around bass (~0.15) and mid (~0.45), lower treble
    const bt = t / 0.18
    const bassEnv = 0.55 + 0.45 * Math.exp(-(bt * bt))
    const mt = (t - 0.42) / 0.18
    const midEnv = 0.35 * Math.exp(-(mt * mt))
    const envelope = Math.min(1, bassEnv + midEnv)

    // Per-bar random factor — wide range so neighbours differ a lot
    const barRand = 0.25 + Math.random() * 0.75

    // Occasional random spike on any bar (mimics transient peaks)
    const spike = Math.random() < 0.12 ? 0.3 + Math.random() * 0.5 : 0

    const target = Math.min(1, envelope * barRand + spike * (1 - t * 0.5))
    bars[i] = Math.max(bars[i], target)
  }
}

export function WaveformVisualizer({ tapCount }: { tapCount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barsRef = useRef(new Float32Array(BAR_COUNT))
  const tapRef = useRef(tapCount)

  useEffect(() => {
    // Spike on any tap event: count going up (normal) OR dropping to 1
    // (inactivity/deviation reset — useBpm sets taps to [now] so tapCount=1).
    // Only skip when tapCount is 0 (manual Reset button, no tap made).
    if (tapCount > 0 && tapCount !== tapRef.current) {
      spikeValues(barsRef.current)
    }
    tapRef.current = tapCount
  }, [tapCount])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio ?? 1
    // Physical gap stays visually consistent across DPR
    const physGap = GAP_PX * dpr

    function resize() {
      canvas!.width = canvas!.offsetWidth * dpr
      canvas!.height = canvas!.offsetHeight * dpr
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let animId = 0

    function draw() {
      const bars = barsRef.current
      const w = canvas!.width
      const h = canvas!.height

      ctx!.clearRect(0, 0, w, h)

      for (let i = 0; i < BAR_COUNT; i++) {
        bars[i] *= DECAY
      }

      const barW = Math.max(1, (w - physGap * (BAR_COUNT - 1)) / BAR_COUNT)

      for (let i = 0; i < BAR_COUNT; i++) {
        const v = bars[i]
        if (v < MIN_DRAW) continue

        const x = i * (barW + physGap)
        const barH = v * h
        const y = h - barH

        const grad = ctx!.createLinearGradient(0, y, 0, h)
        grad.addColorStop(0, `rgba(167,139,250,${Math.min(1, v)})`)
        grad.addColorStop(0.55, `rgba(139,92,246,${v * 0.72})`)
        grad.addColorStop(1, `rgba(109,40,217,${v * 0.25})`)

        ctx!.fillStyle = grad
        ctx!.fillRect(x, y, barW, barH)
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: canvas has no tabIndex and is not focusable; aria-hidden is correct for decorative content
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-full h-20 pointer-events-none"
    />
  )
}
