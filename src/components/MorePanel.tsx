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

export function MorePanel({ onClose, onReset }: Props) {
  function handleBackdropPointer(e: React.PointerEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onPointerDown={handleBackdropPointer}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-t-2xl"
        style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          maxHeight: '85dvh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <div className="px-6 pb-8 pt-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-lg tracking-tight">More</h2>
            <button
              onClick={onClose}
              className="text-sm px-3 py-1 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)' }}
            >
              Close
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={() => { onReset(); onClose() }}
            className="w-full py-3 rounded-xl font-medium text-sm mb-6 transition-opacity active:opacity-70"
            style={{ background: 'rgba(239,68,68,0.15)', color: 'rgb(252,165,165)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            Reset measurement
          </button>

          {/* How it works */}
          <div className="mb-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tap a steady beat — the app averages all your taps for accuracy. After 8+ taps a long pause resets the meter. Skipping an occasional beat won't reset it.
          </div>

          {/* Genre reference */}
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Genre BPM reference
          </h3>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {GENRES.map(({ genre, range }, i) => (
              <div
                key={genre}
                className="flex items-center justify-between px-4 py-2.5 text-sm"
                style={{
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span>{genre}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontVariantNumeric: 'tabular-nums' }}>{range}</span>
              </div>
            ))}
          </div>

          <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Ranges are approximate common tempos.
          </p>
        </div>
      </div>
    </div>
  )
}
