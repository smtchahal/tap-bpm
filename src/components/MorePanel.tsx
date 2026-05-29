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
      role="dialog"
      aria-modal="true"
      aria-label="More options"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onPointerDown={handleBackdropPointer}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-[#141414] border border-white/[0.08] border-b-0 max-h-[85dvh] overflow-y-auto overscroll-contain"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-6 pb-8 pt-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-lg tracking-tight">More</h2>
            <button
              type="button"
              onClick={onClose}
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
              onClose()
            }}
            className="w-full py-3 rounded-xl font-medium text-sm mb-6 transition-opacity active:opacity-70 bg-red-500/15 text-red-300 border border-red-500/25"
          >
            Reset measurement
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
    </div>
  )
}
