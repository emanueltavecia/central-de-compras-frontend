'use client'

import { Button } from '@mantine/core'

import { dashboardAction } from './action'

export function DashboardButton() {
  return (
    <Button onClick={dashboardAction}>clique para dar refetch na data</Button>
  )
}
