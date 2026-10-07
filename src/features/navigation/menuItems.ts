import type { ComponentType } from 'react'
import Content1 from '../../views/Content1/Content1'
import Content2 from '../../views/Content2/Content2'

type MenuItemConfig = {
  id: string
  label: string
  Content: ComponentType
}

// Single source of truth for the menu: add an entry here to add a view.
export const MENU_ITEMS = [
  { id: 'content1', label: 'MenuItem1', Content: Content1 },
  { id: 'content2', label: 'MenuItem2', Content: Content2 },
] as const satisfies readonly MenuItemConfig[]

export type MenuItem = (typeof MENU_ITEMS)[number]
