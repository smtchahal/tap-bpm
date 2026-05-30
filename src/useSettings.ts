import { useCallback, useState } from 'react'

export type Settings = {
  showVisualizer: boolean
}

const DEFAULTS: Settings = {
  showVisualizer: true,
}

const STORAGE_KEY = 'tap-bpm-settings'

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

function persist(s: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load)

  const setSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      persist(next)
      return next
    })
  }, [])

  return { settings, setSetting }
}
