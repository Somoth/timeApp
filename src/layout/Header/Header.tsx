import { LiveClock } from '../../features/clock'
import { Stamp } from '../../features/stamp'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.start}>
        <span className={styles.brand}>TimeApp</span>
        <Stamp />
      </div>
      <div className={styles.end}>
        <LiveClock />
      </div>
    </header>
  )
}
