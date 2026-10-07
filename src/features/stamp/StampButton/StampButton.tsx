import { useStampNow } from '../stampStore'
import styles from './StampButton.module.css'

export default function StampButton() {
  const stampNow = useStampNow()

  return (
    <button type="button" className={styles.button} onClick={stampNow}>
      Stamp current time
    </button>
  )
}
