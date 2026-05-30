import { useEffect, useRef, useState } from 'react'

const isTouch =
  typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches

interface Props {
  onClose: () => void
  onReset: () => void
}

const GENRES = [
  { genre: 'Ballad', range: '60–80' },
  { genre: 'Reggae', range: '60–90' },
  { genre: 'Hip-Hop', range: '85–115' },
  { genre: 'Reggaeton', range: '90–100' },
  { genre: 'Pop', range: '100–130' },
  { genre: 'Disco / House', range: '115–130' },
  { genre: 'Rock', range: '110–140' },
  { genre: 'Techno', range: '120–140' },
  { genre: 'Trance', range: '125–150' },
  { genre: 'Dubstep', range: '~140 (felt ~70)' },
  { genre: 'Drum & Bass', range: '160–180' },
]

type Phase = 'initial' | 'enter' | 'open' | 'drag' | 'exit'

function sheetStyle(phase: Phase, dragY: number): { transform: string; transition: string } {
  const spring = 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)'
  if (phase === 'initial') return { transform: 'translateY(100%)', transition: 'none' }
  if (phase === 'drag') return { transform: `translateY(${dragY}px)`, transition: 'none' }
  if (phase === 'exit')
    return { transform: 'translateY(100%)', transition: 'transform 280ms ease-in' }
  return { transform: 'translateY(0)', transition: spring }
}

export function InfoPanel({ onClose, onReset }: Props) {
  const [phase, setPhase] = useState<Phase>(isTouch ? 'initial' : 'open')
  const [dragY, setDragY] = useState(0)
  const dragStartY = useRef(0)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()

  // Slide-in on mount for mobile bottom sheet
  useEffect(() => {
    if (!isTouch) return
    const id = requestAnimationFrame(() => setPhase('enter'))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    [],
  )

  function triggerClose() {
    if (isTouch) {
      setPhase('exit')
      setDragY(0)
      closeTimer.current = setTimeout(onClose, 290)
    } else {
      onClose()
    }
  }

  function handleBackdropPointer(e: React.PointerEvent) {
    if (e.target === e.currentTarget) triggerClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') triggerClose()
  }

  // Drag-to-dismiss — handle bar only, mobile only
  function onDragDown(e: React.PointerEvent) {
    if (phase === 'exit') return
    e.stopPropagation()
    dragStartY.current = e.clientY
    setPhase('drag')
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onDragMove(e: React.PointerEvent) {
    if (phase !== 'drag') return
    setDragY(Math.max(0, e.clientY - dragStartY.current))
  }

  function onDragUp() {
    if (phase !== 'drag') return
    if (dragY > 100) {
      triggerClose()
    } else {
      setDragY(0)
      setPhase('open')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Info"
      className={`fixed inset-0 z-50 flex justify-center bg-black/70 backdrop-blur-sm ${isTouch ? 'items-end' : 'items-center'}`}
      onPointerDown={handleBackdropPointer}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* biome-ignore-start lint/nursery/noInlineStyles: bottom-sheet slide animation and drag offset need runtime transform values */}
      <div
        className={`w-full max-w-md bg-[#141414] border border-white/[0.08] max-h-[85dvh] overflow-y-auto overscroll-contain ${isTouch ? 'rounded-t-2xl border-b-0' : 'rounded-2xl mx-4'}`}
        onPointerDown={(e) => e.stopPropagation()}
        style={isTouch ? sheetStyle(phase, dragY) : undefined}
      >
        {/* Drag handle — mobile only */}
        {isTouch && (
          <div
            className="flex justify-center pt-3 pb-1 touch-none cursor-grab active:cursor-grabbing"
            onPointerDown={onDragDown}
            onPointerMove={onDragMove}
            onPointerUp={onDragUp}
            onPointerCancel={onDragUp}
          >
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>
        )}

        <div className={`px-6 pb-8 ${isTouch ? 'pt-2' : 'pt-6'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-lg tracking-tight">Info</h2>
            <button
              type="button"
              onClick={triggerClose}
              className="text-sm px-3 py-1 rounded-lg transition-colors text-white/50 bg-white/[0.06]"
            >
              Close
            </button>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={() => {
              onReset()
              triggerClose()
            }}
            className="w-full py-3 rounded-xl font-semibold text-sm mb-6 transition-opacity active:opacity-70 bg-red-700 text-white"
          >
            Reset BPM
          </button>

          {/* How it works */}
          <div className="mb-6 text-sm leading-relaxed text-white/45">
            Tap a steady beat — the app averages all your taps for accuracy. After 8+ taps a long
            pause resets the meter. Skipping an occasional beat won't reset it.
          </div>

          {/* Genre reference */}
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 text-white/30">
            Genre BPM reference
          </h3>
          <div className="rounded-xl overflow-hidden border border-white/[0.07] divide-y divide-white/[0.05]">
            {GENRES.map(({ genre, range }) => (
              <div
                key={genre}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-white/70"
              >
                <span>{genre}</span>
                <span className="text-white/35 tabular-nums">{range}</span>
              </div>
            ))}
          </div>

          <p className="text-xs mt-3 text-white/20">Ranges are approximate common tempos.</p>
        </div>
      </div>
      {/* biome-ignore-end lint/nursery/noInlineStyles: bottom-sheet slide animation and drag offset need runtime transform values */}
    </div>
  )
}
