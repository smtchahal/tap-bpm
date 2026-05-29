import { useCallback, useEffect, useRef, useState } from 'react'
import { GearIcon } from './components/GearIcon'
import { MorePanel } from './components/MorePanel'
import { useBpm } from './useBpm'

const hasKeyboard = window.matchMedia('(pointer: fine)').matches

export default function App() {
  const { bpm, tapCount, registerTap, reset } = useBpm()
  const [panelOpen, setPanelOpen] = useState(false)
  const [pulsing, setPulsing] = useState(false)
  const pulseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerPulse = useCallback(() => {
    setPulsing(false)
    // Force reflow so re-adding class restarts animation
    requestAnimationFrame(() => {
      setPulsing(true)
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current)
      pulseTimeout.current = setTimeout(() => setPulsing(false), 200)
    })
  }, [])

  const handleTap = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      if (panelOpen) return
      registerTap()
      triggerPulse()
    },
    [panelOpen, registerTap, triggerPulse],
  )

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (panelOpen) return
      if (e.target instanceof HTMLElement && e.target.closest('[data-panel]')) return
      // Ignore modifier combos and non-character keys except space
      if (e.key === 'Escape') return
      if (e.repeat) return
      registerTap()
      triggerPulse()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelOpen, registerTap, triggerPulse])

  // Esc to close panel
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPanelOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const displayBpm = bpm !== null ? Math.round(bpm) : null

  return (
    <div className="relative flex flex-col items-center justify-center h-[100dvh] bg-[#0a0a0a] touch-manipulation">
      {/* Full-viewport tap surface */}
      <div
        className="absolute inset-0 touch-manipulation cursor-default"
        onPointerDown={handleTap}
      />

      {/* BPM readout — sits above tap surface via pointer-events:none */}
      <div className="relative flex flex-col items-center gap-2 pointer-events-none select-none">
        {/* Pulse ring */}
        <div className="relative flex items-center justify-center">
          {pulsing && (
            <div className="ring-pulse absolute rounded-full w-[clamp(160px,40vw,320px)] h-[clamp(160px,40vw,320px)] border-2 border-violet-500/50" />
          )}

          {/* BPM number */}
          <div
            className={`${pulsing ? 'beat-pulse' : ''} text-[clamp(80px,22vw,180px)] font-extrabold tracking-[-0.04em] leading-none text-white tabular-nums min-w-[clamp(160px,40vw,320px)] text-center`}
          >
            {displayBpm !== null ? displayBpm : 0}
          </div>
        </div>

        {/* BPM label */}
        <div className="text-[clamp(11px,3vw,15px)] font-semibold tracking-[0.2em] uppercase text-white/25">
          BPM
        </div>

        {/* Tap count / hint */}
        <div className="text-[clamp(13px,3.5vw,16px)] text-white/35 mt-1">
          {tapCount < 2
            ? hasKeyboard
              ? 'Press any key or tap anywhere to start'
              : 'Tap anywhere to start'
            : `${tapCount} taps`}
        </div>
      </div>

      {/* Settings button — fixed corner, pointer-events re-enabled */}
      <button
        type="button"
        aria-label="Settings"
        onClick={() => setPanelOpen(true)}
        className="absolute bottom-6 right-6 pointer-events-auto transition-opacity active:opacity-60 text-[13px] font-medium text-white/35 bg-white/[0.06] border border-white/10 rounded-[10px] px-3 py-2 sm:px-3.5 tracking-[0.02em] flex items-center gap-1.5"
      >
        <GearIcon size={14} />
        <span className="hidden sm:inline">Settings</span>
      </button>

      {/* More panel overlay */}
      {panelOpen && (
        <div data-panel className="pointer-events-auto">
          <MorePanel onClose={() => setPanelOpen(false)} onReset={reset} />
        </div>
      )}
    </div>
  )
}
