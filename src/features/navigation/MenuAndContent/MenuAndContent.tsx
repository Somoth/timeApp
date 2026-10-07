import { useState } from 'react'
import Menu from '../Menu/Menu'
import { MENU_ITEMS, type MenuItem } from '../menuItems'
import styles from './MenuAndContent.module.css'

export default function MenuAndContent() {
  const [activeItem, setActiveItem] = useState<MenuItem>(MENU_ITEMS[0])
  const { Content } = activeItem

  return (
    <>
      <div className={styles.menuArea}>
        <Menu items={MENU_ITEMS} activeId={activeItem.id} onSelect={setActiveItem} />
      </div>
      <main className={styles.content}>
        <Content />
      </main>
    </>
  )
}
