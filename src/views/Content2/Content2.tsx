import { StampButton } from '../../features/stamp'
import styles from '../views.module.css'

export default function Content2() {
  return (
    <section className={styles.view}>
      <h1 className={styles.title}>Content 2</h1>
      <p className={styles.text}>You can also update the time stamp with this button.</p>
      <StampButton />
    </section>
  )
}
