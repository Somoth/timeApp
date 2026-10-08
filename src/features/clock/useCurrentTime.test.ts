import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrentTime } from './useCurrentTime'

describe('useCurrentTime', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('ticks on the real second boundary, not 1s after mounting', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.900Z'))
    const { result } = renderHook(() => useCurrentTime())

    act(() => vi.advanceTimersByTime(99))
    expect(result.current.toISOString()).toBe('2026-01-01T10:00:00.900Z')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.toISOString()).toBe('2026-01-01T10:00:01.000Z')
  })

  it('re-aligns to the next whole second after a tick fires late', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))
    const { result } = renderHook(() => useCurrentTime())

    // Browsers don't guarantee timer precision: make the first tick fire 30ms
    // late by moving the clock without running timers.
    vi.setSystemTime(new Date('2026-01-01T10:00:00.030Z'))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.toISOString()).toBe('2026-01-01T10:00:01.030Z')

    // The next tick lands exactly on the second, not 1000ms after the late one
    // (a plain setInterval would show :01.030 here and keep drifting).
    act(() => vi.advanceTimersByTime(970))
    expect(result.current.toISOString()).toBe('2026-01-01T10:00:02.000Z')
  })

  it('stops the timer when unmounted', () => {
    const { unmount } = renderHook(() => useCurrentTime())
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
