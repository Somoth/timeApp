import { useEffect, useState } from 'react'

const msUntilNextSecond = () => 1000 - (Date.now() % 1000)

export function useCurrentTime(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const scheduleNextTick = () => {
      timeoutId = setTimeout(() => {
        setNow(new Date())
        scheduleNextTick()
      }, msUntilNextSecond())
    }

    scheduleNextTick()
    return () => clearTimeout(timeoutId)
  }, [])

  return now
}
