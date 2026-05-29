import { useState, useCallback, useEffect, useRef } from 'react'
import { useBpm } from './useBpm'
import { MorePanel } from './components/MorePanel'

export default function App() {
  const { bpm, tapCount, registerTap, reset } = useBpm()
  const [panelOpen, setPanelOpen] = useState(false)
  const [pulsing, setPulsing] = useState(false)
  const pulseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerPulse = () => {
    setPulsing(false)
    // Force reflow so re-adding class restarts animation
    requestAnimationFrame(() => {
      setPulsing(true)
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current)
      pulseTimeout.current = setTimeout(() => setPulsing(false), 200)
    })
  }

  const handleTap = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      if (panelOpen) return
      registerTap()
      triggerPulse()
    },
    [panelOpen, registerTap],
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
  }, [panelOpen, registerTap])

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
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ height: '100dvh', background: '#0a0a0a', touchAction: 'manipulation' }}
    >
      {/* Full-viewport tap surface */}
      <div
        className="absolute inset-0"
        onPointerDown={handleTap}
        style={{ touchAction: 'manipulation', cursor: 'default' }}
      />

      {/* BPM readout — sits above tap surface via pointer-events:none */}
      <div className="relative flex flex-col items-center gap-2 pointer-events-none select-none">
        {/* Pulse ring */}
        <div className="relative flex items-center justify-center">
          {pulsing && (
            <div
              className="ring-pulse absolute rounded-full"
              style={{
                width: 'clamp(160px, 40vw, 320px)',
                height: 'clamp(160px, 40vw, 320px)',
                border: '2px solid rgba(139,92,246,0.5)',
              }}
            />
          )}

          {/* BPM number */}
          <div
            className={pulsing ? 'beat-pulse' : ''}
            style={{
              fontSize: 'clamp(80px, 22vw, 180px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: displayBpm !== null ? '#ffffff' : 'rgba(255,255,255,0.12)',
              fontVariantNumeric: 'tabular-nums',
              minWidth: 'clamp(160px, 40vw, 320px)',
              textAlign: 'center',
            }}
          >
            {displayBpm !== null ? displayBpm : '—'}
          </div>
        </div>

        {/* BPM label */}
        <div
          style={{
            fontSize: 'clamp(11px, 3vw, 15px)',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          BPM
        </div>

        {/* Tap count / hint */}
        <div
          style={{
            fontSize: 'clamp(13px, 3.5vw, 16px)',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '4px',
          }}
        >
          {tapCount < 2
            ? 'Tap anywhere to start'
            : `${tapCount} taps`}
        </div>
      </div>

      {/* More button — fixed corner, pointer-events re-enabled */}
      <button
        onClick={() => setPanelOpen(true)}
        className="absolute bottom-6 right-6 pointer-events-auto transition-opacity active:opacity-60"
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.35)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '8px 14px',
          letterSpacing: '0.02em',
        }}
      >
        More
      </button>

      {/* Accent dot — purely decorative */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(139,92,246,0.6)',
          bottom: '6px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* More panel overlay */}
      {panelOpen && (
        <div data-panel className="pointer-events-auto">
          <MorePanel
            onClose={() => setPanelOpen(false)}
            onReset={reset}
          />
        </div>
      )}
    </div>
  )
}
