import DateTime from '../../../components/DateTime/DateTime'
import LabeledValue from '../../../components/LabeledValue/LabeledValue'
import { useStamp } from '../stampStore'
import styles from './Stamp.module.css'

export default function Stamp() {
  const stamp = useStamp()

  return (
    <LabeledValue label="Last stamp" announceChanges>
      {stamp ? (
        <DateTime key={stamp.getTime()} value={stamp} className={styles.stamp} />
      ) : (
        <span className={styles.empty}>Not stamped yet</span>
      )}
    </LabeledValue>
  )
}
