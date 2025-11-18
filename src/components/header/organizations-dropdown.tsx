'use client'

import Link from 'next/link'

import { Menu } from '@mantine/core'

export function OrganizationsDropdown() {
  return (
    <Menu trigger="click" position="bottom" zIndex={1000} withArrow>
      <Menu.Target>
        <button className="text-text-secondary hover:text-primary text-sm font-medium transition-colors">
          Organizações
        </button>
      </Menu.Target>
      <Menu.Dropdown className="min-w-40">
        <Menu.Item
          component={Link}
          href="/organizations/stores"
          className="justify-center"
        >
          Lojas
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/organizations/suppliers"
          className="justify-center"
        >
          Fornecedores
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
