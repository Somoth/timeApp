import { useId, type ReactNode } from 'react'
import styles from './LabeledValue.module.css'

type LabeledValueProps = {
  label: ReactNode
  children: ReactNode
  /** Screen readers politely announce each change to the value. */
  announceChanges?: boolean
}

export default function LabeledValue({ label, children, announceChanges = false }: LabeledValueProps) {
  const labelId = useId()

  return (
    <div
      className={styles.labeledValue}
      role={announceChanges ? 'status' : 'group'}
      aria-labelledby={labelId}
    >
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      {children}
    </div>
  )
}
