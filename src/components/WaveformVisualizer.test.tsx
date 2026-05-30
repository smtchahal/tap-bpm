import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { spikeValues, WaveformVisualizer } from './WaveformVisualizer'

describe('spikeValues', () => {
  it('raises bars from zero', () => {
    const bars = new Float32Array(44)
    spikeValues(bars)
    const raised = Array.from(bars).filter((v) => v > 0)
    expect(raised.length).toBeGreaterThan(0)
  })

  it('keeps all values in [0, 1]', () => {
    const bars = new Float32Array(44).fill(0.5)
    spikeValues(bars)
    for (const v of bars) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    }
  })

  it('never lowers existing bar values (max behaviour)', () => {
    const bars = new Float32Array(44).fill(1)
    spikeValues(bars)
    for (const v of bars) {
      expect(v).toBe(1)
    }
  })
})

describe('WaveformVisualizer', () => {
  it('renders a canvas element', () => {
    const { container } = render(<WaveformVisualizer tapCount={0} />)
    expect(container.querySelector('canvas')).toBeTruthy()
  })

  it('renders without crashing on tap count change', () => {
    const { rerender, container } = render(<WaveformVisualizer tapCount={0} />)
    rerender(<WaveformVisualizer tapCount={1} />)
    rerender(<WaveformVisualizer tapCount={2} />)
    expect(container.querySelector('canvas')).toBeTruthy()
  })
})
