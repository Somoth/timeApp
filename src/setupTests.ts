import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => cleanup())

// Reset all Zustand stores between tests (see __mocks__/zustand.ts).
vi.mock('zustand')

// Testing Library only recognises *Jest* fake timers. After each userEvent
// action it waits on a setTimeout(0), which never fires under Vitest's fake
// timers unless it can advance them through a global `jest`. This shim maps
// that call onto Vitest so userEvent works with vi.useFakeTimers().
Object.assign(globalThis, {
  jest: { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) },
})
