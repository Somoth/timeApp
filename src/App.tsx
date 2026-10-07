import { MenuAndContent } from './features/navigation'
import Header from './layout/Header/Header'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.layout}>
      <Header />
      <MenuAndContent />
    </div>
  )
}
