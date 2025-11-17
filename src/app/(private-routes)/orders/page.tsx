import { Card, Group, Stack, Title } from '@mantine/core'

import { getOrders } from './action'
import { NewOrderModal } from './new-order-modal'
import { OrdersFilters } from './orders-filters'
import { OrdersTable } from './orders-table'

import { getProducts } from '@/app/(private-routes)/products/action'
import { getSession } from '@/lib/auth/session'

export default async function OrdersPage() {
  const [orders, products, { user }] = await Promise.all([
    getOrders(),
    getProducts(),
    getSession(),
  ])

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2}>Pedidos</Title>
            <NewOrderModal products={products} userRole={user?.role.name} />
          </Group>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <OrdersTable orders={orders} />
          </Card>
        </Stack>
      </div>

      <div className="w-80">
        <OrdersFilters />
      </div>
    </div>
  )
}
