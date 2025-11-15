'use client'

import { Button } from '@mantine/core'

import { logout } from '@/lib/auth/logout'

export function LogoutButton() {
  return (
    <Button onClick={() => logout()} variant="light" color="red" size="sm">
      Sair
    </Button>
  )
}
