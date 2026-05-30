import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Settings } from '../useSettings'
import { InfoPanel } from './InfoPanel'

function setup(overrides?: {
  onClose?: () => void
  onReset?: () => void
  settings?: Partial<Settings>
}) {
  const onClose = overrides?.onClose ?? vi.fn()
  const onReset = overrides?.onReset ?? vi.fn()
  const setSetting = vi.fn()
  const settings: Settings = { showVisualizer: true, ...overrides?.settings }
  const user = userEvent.setup()
  render(
    <InfoPanel onClose={onClose} onReset={onReset} settings={settings} setSetting={setSetting} />,
  )
  return { onClose, onReset, setSetting, user }
}

describe('InfoPanel', () => {
  it('renders Info heading', () => {
    setup()
    expect(screen.getByRole('heading', { name: /info/i })).toBeInTheDocument()
  })

  it('renders genre reference table', () => {
    setup()
    expect(screen.getByText('Hip-Hop')).toBeInTheDocument()
    expect(screen.getByText('Drum & Bass')).toBeInTheDocument()
  })

  it('calls onClose when Close button is clicked', async () => {
    const { onClose, user } = setup()
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onReset and onClose when Reset button is clicked', async () => {
    const { onClose, onReset, user } = setup()
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(onReset).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', async () => {
    const { onClose, user } = setup()
    screen.getByRole('dialog').focus()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  describe('visualizer toggle', () => {
    it('renders the visualizer switch', () => {
      setup()
      expect(screen.getByRole('switch', { name: /toggle visualizer/i })).toBeInTheDocument()
    })

    it('reflects showVisualizer=true as checked', () => {
      setup({ settings: { showVisualizer: true } })
      expect(screen.getByRole('switch', { name: /toggle visualizer/i })).toHaveAttribute(
        'aria-checked',
        'true',
      )
    })

    it('reflects showVisualizer=false as unchecked', () => {
      setup({ settings: { showVisualizer: false } })
      expect(screen.getByRole('switch', { name: /toggle visualizer/i })).toHaveAttribute(
        'aria-checked',
        'false',
      )
    })

    it('calls setSetting with toggled value when clicked', async () => {
      const { setSetting, user } = setup({ settings: { showVisualizer: true } })
      await user.click(screen.getByRole('switch', { name: /toggle visualizer/i }))
      expect(setSetting).toHaveBeenCalledWith('showVisualizer', false)
    })
  })
})
