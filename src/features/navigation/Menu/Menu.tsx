import styles from './Menu.module.css'

type MenuProps<Item extends { id: string; label: string }> = {
  items: readonly Item[]
  activeId: Item['id']
  onSelect: (item: Item) => void
}

export default function Menu<Item extends { id: string; label: string }>({
  items,
  activeId,
  onSelect,
}: MenuProps<Item>) {
  return (
    <nav className={styles.menu}>
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            className={isActive ? `${styles.item} ${styles.active}` : styles.item}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelect(item)}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
