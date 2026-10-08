import DateTime from '../../../components/DateTime/DateTime'
import LabeledValue from '../../../components/LabeledValue/LabeledValue'
import { useCurrentTime } from '../useCurrentTime'
import styles from './LiveClock.module.css'

export default function LiveClock() {
  const now = useCurrentTime()

  return (
    <LabeledValue
      label={
        <>
          <span className={styles.dot} aria-hidden="true" />
          Live
        </>
      }
    >
      <DateTime value={now} dateTone="muted" />
    </LabeledValue>
  )
}
