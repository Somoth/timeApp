import { create } from 'zustand'

type StampState = {
  /** The last stamped time, or `null` before the first stamp. */
  stamp: Date | null
  stampNow: () => void
}

// Internal to the stamp feature: components use the hooks below, so they
// don't depend on how or where the state is stored.
const useStampStore = create<StampState>()((set) => ({
  stamp: null,
  stampNow: () => set({ stamp: new Date() }),
}))

// Each hook selects one field, so a component re-renders only when that field
// changes. `stampNow` never changes, so the buttons never re-render.
export const useStamp = () => useStampStore((state) => state.stamp)
export const useStampNow = () => useStampStore((state) => state.stampNow)
