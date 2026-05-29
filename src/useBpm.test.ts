import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBpm } from './useBpm'

// useBpm reads performance.now() — mock it so tests are deterministic
let mockNow = 0
beforeEach(() => {
  mockNow = 0
  vi.spyOn(performance, 'now').mockImplementation(() => mockNow)
})
afterEach(() => vi.restoreAllMocks())

function advance(ms: number) {
  mockNow += ms
}

describe('useBpm', () => {
  it('returns null BPM before 2 taps', () => {
    const { result } = renderHook(() => useBpm())
    expect(result.current.bpm).toBeNull()
    expect(result.current.tapCount).toBe(0)

    act(() => {
      advance(500)
      result.current.registerTap()
    })
    expect(result.current.bpm).toBeNull()
    expect(result.current.tapCount).toBe(1)
  })

  it('computes correct BPM from steady taps', () => {
    const { result } = renderHook(() => useBpm())
    // 120 BPM = 500 ms between taps
    act(() => {
      result.current.registerTap()
      advance(500)
      result.current.registerTap()
      advance(500)
      result.current.registerTap()
      advance(500)
      result.current.registerTap()
    })
    expect(result.current.tapCount).toBe(4)
    // Expected: 60000 * 3 / 1500 = 120
    expect(result.current.bpm).toBeCloseTo(120, 1)
  })

  it('ignores taps within MIN_INTERVAL (debounce)', () => {
    const { result } = renderHook(() => useBpm())
    act(() => {
      result.current.registerTap()
      advance(50) // < 100 ms MIN_INTERVAL
      result.current.registerTap()
    })
    expect(result.current.tapCount).toBe(1)
  })

  it('restarts after ABSOLUTE_TIMEOUT (>3 s silence)', () => {
    const { result } = renderHook(() => useBpm())
    act(() => {
      result.current.registerTap()
      advance(500)
      result.current.registerTap()
    })
    expect(result.current.tapCount).toBe(2)

    act(() => {
      advance(3001)
      result.current.registerTap()
    })
    // Restarted — count is back to 1
    expect(result.current.tapCount).toBe(1)
    expect(result.current.bpm).toBeNull()
  })

  it('does NOT restart on a single skipped beat when taps < CONFIDENT_TAPS', () => {
    const { result } = renderHook(() => useBpm())
    // Build up 5 taps at 500 ms apart (< 8 threshold)
    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.registerTap()
        advance(500)
      }
    })
    const countBefore = result.current.tapCount
    // Gap of 1500 ms (3× avg of 500) — would exceed DEVIATION_FACTOR but CONFIDENT_TAPS not yet met
    act(() => {
      advance(1500)
      result.current.registerTap()
    })
    expect(result.current.tapCount).toBe(countBefore + 1)
  })

  it('resets via deviation after ≥8 taps with long gap', () => {
    const { result } = renderHook(() => useBpm())
    // 8 taps at 500 ms → avgInterval = 500
    act(() => {
      for (let i = 0; i < 8; i++) {
        result.current.registerTap()
        advance(500)
      }
    })
    expect(result.current.tapCount).toBe(8)

    // Gap of 1300 ms (2.6× avg of 500) > DEVIATION_FACTOR 2.5 → reset
    act(() => {
      advance(1300)
      result.current.registerTap()
    })
    expect(result.current.tapCount).toBe(1)
    expect(result.current.bpm).toBeNull()
  })

  it('reset() clears all state', () => {
    const { result } = renderHook(() => useBpm())
    act(() => {
      result.current.registerTap()
      advance(500)
      result.current.registerTap()
    })
    expect(result.current.bpm).not.toBeNull()

    act(() => result.current.reset())
    expect(result.current.bpm).toBeNull()
    expect(result.current.tapCount).toBe(0)
  })
})
