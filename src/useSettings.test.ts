import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useSettings } from './useSettings'

const STORAGE_KEY = 'tap-bpm-settings'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('useSettings', () => {
  it('returns defaults when localStorage is empty', () => {
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.showVisualizer).toBe(true)
  })

  it('persists a setting change to localStorage', () => {
    const { result } = renderHook(() => useSettings())
    act(() => result.current.setSetting('showVisualizer', false))
    expect(result.current.settings.showVisualizer).toBe(false)
    const raw = localStorage.getItem(STORAGE_KEY)
    const stored = JSON.parse(raw ?? '{}')
    expect(stored.showVisualizer).toBe(false)
  })

  it('loads persisted settings on init', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ showVisualizer: false }))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.showVisualizer).toBe(false)
  })

  it('falls back to defaults on corrupt localStorage data', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{')
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.showVisualizer).toBe(true)
  })

  it('merges stored partial settings with defaults', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}))
    const { result } = renderHook(() => useSettings())
    expect(result.current.settings.showVisualizer).toBe(true)
  })
})
