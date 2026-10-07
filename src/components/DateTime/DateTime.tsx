import { formatDate, formatTime } from '../../utils/formatDateTime'
import styles from './DateTime.module.css'

type DateTimeProps = {
  value: Date
  className?: string
}

export default function DateTime({ value, className }: DateTimeProps) {
  return (
    <time
      className={className ? `${styles.dateTime} ${className}` : styles.dateTime}
      dateTime={value.toISOString()}
    >
      <span className={styles.time}>{formatTime(value)}</span>
      <span className={styles.date}>{formatDate(value)}</span>
    </time>
  )
}
