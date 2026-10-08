import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import Content1 from './views/Content1/Content1'
import Content2 from './views/Content2/Content2'
import Header from './layout/Header/Header'
import LiveClock from './features/clock/LiveClock/LiveClock'
import Menu from './features/navigation/Menu/Menu'
import Stamp from './features/stamp/Stamp/Stamp'

// Replace each component's default export with a spy that still calls the
// real component, so every render (function call) is counted.
const { spyOnDefaultExport } = vi.hoisted(() => ({
  spyOnDefaultExport: async (importOriginal: () => Promise<{ default: (props: never) => unknown }>) => {
    const mod = await importOriginal()
    return { ...mod, default: vi.fn(mod.default) }
  },
}))

vi.mock('./layout/Header/Header', spyOnDefaultExport)
vi.mock('./features/navigation/Menu/Menu', spyOnDefaultExport)
vi.mock('./views/Content1/Content1', spyOnDefaultExport)
vi.mock('./views/Content2/Content2', spyOnDefaultExport)
vi.mock('./features/stamp/Stamp/Stamp', spyOnDefaultExport)
vi.mock('./features/clock/LiveClock/LiveClock', spyOnDefaultExport)

describe('render isolation', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('stamping re-renders only the Stamp, not the header, menu, content or clock', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    vi.clearAllMocks()

    await user.click(screen.getByRole('button', { name: 'Stamp current time' }))

    expect(Stamp).toHaveBeenCalledTimes(1)
    expect(Header).not.toHaveBeenCalled()
    expect(Menu).not.toHaveBeenCalled()
    expect(Content1).not.toHaveBeenCalled()
    expect(LiveClock).not.toHaveBeenCalled()
  })

  it('switching views re-renders only the menu and content, not the header, stamp or clock', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    vi.clearAllMocks()

    await user.click(screen.getByRole('button', { name: 'MenuItem2' }))

    expect(Menu).toHaveBeenCalledTimes(1)
    expect(Content2).toHaveBeenCalledTimes(1)
    expect(Header).not.toHaveBeenCalled()
    expect(Stamp).not.toHaveBeenCalled()
    expect(LiveClock).not.toHaveBeenCalled()
  })

  it('each clock tick re-renders only the LiveClock, not the header, stamp, menu or content', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))
    render(<App />)
    vi.clearAllMocks()

    // One act() per second: React batches updates within a single act(),
    // while in the browser each tick is its own timer callback and render.
    for (let second = 0; second < 3; second++) {
      act(() => vi.advanceTimersByTime(1000))
    }

    expect(LiveClock).toHaveBeenCalledTimes(3)
    expect(Header).not.toHaveBeenCalled()
    expect(Stamp).not.toHaveBeenCalled()
    expect(Menu).not.toHaveBeenCalled()
    expect(Content1).not.toHaveBeenCalled()
  })
})
