import { formatDate, formatTime } from '../../utils/formatDateTime'
import styles from './DateTime.module.css'

type DateTimeProps = {
  value: Date
  emphasis?: 'normal' | 'strong'
  dateTone?: 'default' | 'muted'
}

export default function DateTime({ value, emphasis = 'normal', dateTone = 'default' }: DateTimeProps) {
  return (
    <time className={styles.dateTime} dateTime={value.toISOString()}>
      <span className={emphasis === 'strong' ? `${styles.time} ${styles.strong}` : styles.time}>
        {formatTime(value)}
      </span>
      <span className={dateTone === 'muted' ? `${styles.date} ${styles.muted}` : styles.date}>
        {formatDate(value)}
      </span>
    </time>
  )
}
