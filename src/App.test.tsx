import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

// Find the stamp and the clock the way assistive tech does: by role and label.
const stampRegion = () => screen.getByRole('status', { name: 'Last stamp' })
const clockRegion = () => screen.getByRole('group', { name: 'Live' })
const timeIn = (region: HTMLElement) => {
  const time = region.querySelector('time')
  if (!time) throw new Error('No <time> element in region')
  return time
}

const stampButton = () => screen.getByRole('button', { name: 'Stamp current time' })

// userEvent simulates a real user (pointer, focus, click). With fake timers it
// must be told how to advance them.
function renderApp() {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  render(<App />)
  return user
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows Content 1 by default and switches content via the menu', async () => {
    const user = renderApp()
    expect(screen.getByRole('heading', { level: 1, name: 'Content 1' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'MenuItem2' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Content 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'MenuItem2' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: 'MenuItem1' })).not.toHaveAttribute('aria-current')
    expect(screen.queryByRole('heading', { name: 'Content 1' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'MenuItem1' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Content 1' })).toBeInTheDocument()
  })

  it('VAR2 (live clock) updates every second', () => {
    renderApp()
    expect(timeIn(clockRegion())).toHaveAttribute('dateTime', '2026-01-01T10:00:00.000Z')

    act(() => vi.advanceTimersByTime(1000))
    expect(timeIn(clockRegion())).toHaveAttribute('dateTime', '2026-01-01T10:00:01.000Z')
  })

  it('VAR1 (stamp) shows no time until the first click', () => {
    renderApp()
    expect(stampRegion()).toHaveTextContent('Not stamped yet')
    expect(stampRegion().querySelector('time')).toBeNull()

    act(() => vi.advanceTimersByTime(5000))
    expect(stampRegion().querySelector('time')).toBeNull()
  })

  it('VAR1 (stamp) updates only when the content button is clicked', async () => {
    const user = renderApp()

    act(() => vi.advanceTimersByTime(5000))
    await user.click(stampButton())
    expect(timeIn(stampRegion())).toHaveAttribute('dateTime', '2026-01-01T10:00:05.000Z')
    expect(stampRegion()).not.toHaveTextContent('Not stamped yet')

    act(() => vi.advanceTimersByTime(5000))
    expect(timeIn(stampRegion())).toHaveAttribute('dateTime', '2026-01-01T10:00:05.000Z')

    await user.click(stampButton())
    expect(timeIn(stampRegion())).toHaveAttribute('dateTime', '2026-01-01T10:00:10.000Z')
  })

  it('the button in Content 2 also updates VAR1', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: 'MenuItem2' }))

    act(() => vi.advanceTimersByTime(3000))
    await user.click(stampButton())
    expect(timeIn(stampRegion())).toHaveAttribute('dateTime', '2026-01-01T10:00:03.000Z')
  })

  describe('screen readers', () => {
    it('announces the first stamp through a polite live region that stays mounted', async () => {
      const user = renderApp()
      const region = stampRegion()
      // Runs after tests that stamp: proves the store is reset between tests.
      expect(region).toHaveTextContent('Not stamped yet')

      act(() => vi.advanceTimersByTime(2000))
      await user.click(stampButton())

      // Same region element, new content inside it: what triggers an announcement.
      expect(stampRegion()).toBe(region)
      expect(timeIn(region)).toHaveAttribute('dateTime', '2026-01-01T10:00:02.000Z')
    })

    it('does not put the live clock in a live region', () => {
      renderApp()
      expect(screen.getAllByRole('status')).toHaveLength(1)
      const liveRegion = '[role="status"], [role="alert"], [role="log"], [aria-live]'
      expect(timeIn(clockRegion()).closest(liveRegion)).toBeNull()
    })
  })
})
