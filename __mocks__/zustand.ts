// Resets every Zustand store between tests, following Zustand's testing guide.
// Stores live at module level, so without this one test's state would leak
// into the next. Enabled for all tests by `vi.mock('zustand')` in setupTests.ts.
import { act } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import type * as ZustandExportedTypes from 'zustand'

export * from 'zustand'

const { create: actualCreate, createStore: actualCreateStore } =
  await vi.importActual<typeof ZustandExportedTypes>('zustand')

const storeResetFns = new Set<() => void>()

const createUncurried = <T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  const store = actualCreate(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => store.setState(initialState, true))
  return store
}

// Supports both `create(fn)` and the curried `create<T>()(fn)` form.
export const create = (<T>(stateCreator: ZustandExportedTypes.StateCreator<T>) =>
  typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried) as typeof ZustandExportedTypes.create

const createStoreUncurried = <T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  const store = actualCreateStore(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => store.setState(initialState, true))
  return store
}

export const createStore = (<T>(stateCreator: ZustandExportedTypes.StateCreator<T>) =>
  typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried) as typeof ZustandExportedTypes.createStore

afterEach(() => {
  act(() => storeResetFns.forEach((reset) => reset()))
})
