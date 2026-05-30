import { useCallback, useRef, useState } from 'react'

const MIN_INTERVAL = 100 // ms — debounce / double-fire guard (~600 BPM ceiling)
const ABSOLUTE_TIMEOUT = 3000 // ms — always restart after a 3 s silence
const CONFIDENT_TAPS = 8 // taps needed before deviation-based reset kicks in
const DEVIATION_FACTOR = 2.5 // gap must be > avg * this to trigger a confident reset

export interface BpmState {
  bpm: number | null
  tapCount: number
  registerTap: () => void
  reset: () => void
}

export function useBpm(): BpmState {
  const taps = useRef<number[]>([])
  // Small render-trigger counter; bumped whenever displayed values change
  const [, setRenderKey] = useState(0)
  const bump = useCallback(() => setRenderKey((k) => k + 1), [])

  const deriveBpm = (): number | null => {
    const t = taps.current
    if (t.length < 2) return null
    return (60000 * (t.length - 1)) / (t[t.length - 1] - t[0])
  }

  const registerTap = useCallback(() => {
    const now = performance.now()
    const t = taps.current

    if (t.length > 0) {
      const lastTap = t[t.length - 1]
      const gap = now - lastTap

      // Debounce: ignore accidental double-fires
      if (gap < MIN_INTERVAL) return

      // Absolute timeout — clear restart
      if (gap > ABSOLUTE_TIMEOUT) {
        taps.current = [now]
        bump()
        return
      }

      // Confident-deviation reset: only after enough taps for a trustworthy avg
      if (t.length >= CONFIDENT_TAPS) {
        const avgInterval = (lastTap - t[0]) / (t.length - 1)
        if (gap > avgInterval * DEVIATION_FACTOR) {
          taps.current = [now]
          bump()
          return
        }
      }
    }

    // Accumulate
    taps.current = [...t, now]
    bump()
  }, [bump])

  const reset = useCallback(() => {
    taps.current = []
    bump()
  }, [bump])

  return {
    bpm: deriveBpm(),
    tapCount: taps.current.length,
    registerTap,
    reset,
  }
}
