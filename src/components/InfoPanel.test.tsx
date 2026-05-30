import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InfoPanel } from './InfoPanel'

function setup(overrides?: { onClose?: () => void; onReset?: () => void }) {
  const onClose = overrides?.onClose ?? vi.fn()
  const onReset = overrides?.onReset ?? vi.fn()
  const user = userEvent.setup()
  render(<InfoPanel onClose={onClose} onReset={onReset} />)
  return { onClose, onReset, user }
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
})
