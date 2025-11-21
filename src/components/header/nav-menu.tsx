'use client'

import Link from 'next/link'

import { Menu } from '@mantine/core'

import type { RouteItem } from './types'

interface NavMenuProps {
  item: RouteItem
}

export function NavMenu({ item }: NavMenuProps) {
  if (item.submenu) {
    return (
      <Menu trigger="hover" openDelay={100}>
        <Menu.Target>
          <span className="text-text-secondary hover:text-primary cursor-pointer text-center text-[14px] font-medium transition-colors">
            {item.name}
          </span>
        </Menu.Target>
        <Menu.Dropdown>
          {item.submenu.map((subitem) => (
            <Menu.Item
              key={subitem.route}
              component={Link}
              href={subitem.route}
            >
              {subitem.name}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    )
  }

  return (
    <Link
      href={item.route}
      className="text-text-secondary hover:text-primary text-center text-sm font-medium transition-colors"
    >
      {item.name}
    </Link>
  )
}
