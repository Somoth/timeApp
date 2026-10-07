import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrentTime } from './useCurrentTime'

describe('useCurrentTime', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns the current time immediately', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.400Z'))
    const { result } = renderHook(() => useCurrentTime())

    expect(result.current.toISOString()).toBe('2026-01-01T10:00:00.400Z')
  })

  it('ticks on the real second boundary, not 1s after mounting', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.900Z'))
    const { result } = renderHook(() => useCurrentTime())

    act(() => vi.advanceTimersByTime(99))
    expect(result.current.toISOString()).toBe('2026-01-01T10:00:00.900Z')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.toISOString()).toBe('2026-01-01T10:00:01.000Z')
  })

  it('does not drift over many ticks', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))
    const { result } = renderHook(() => useCurrentTime())

    act(() => vi.advanceTimersByTime(3_600_000))
    expect(result.current.toISOString()).toBe('2026-01-01T11:00:00.000Z')
  })

  it('stops the timer when unmounted', () => {
    const { unmount } = renderHook(() => useCurrentTime())
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
