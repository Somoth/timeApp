import { StampButton } from '../../features/stamp'
import styles from '../views.module.css'

export default function Content1() {
  return (
    <section className={styles.view}>
      <h1 className={styles.title}>Content 1</h1>
      <p className={styles.text}>The stamp in the header only changes when you press the button.</p>
      <StampButton />
    </section>
  )
}
