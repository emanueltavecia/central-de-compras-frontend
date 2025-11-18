import { Card, Group, Stack, Title } from '@mantine/core'

import { getOrders } from './action'
import { NewOrderModal } from './new-order-modal'
import { OrdersFilters } from './orders-filters'
import { OrdersTable } from './orders-table'

import { getSession } from '@/lib/auth/session'
import { getAllOrganizations } from '@/lib/organizations'
import { OrgType } from '@/utils/enums/org-type'

export default async function OrdersPage() {
  const [orders, organizations, { user }] = await Promise.all([
    getOrders(),
    getAllOrganizations({ type: OrgType.SUPPLIER, active: true }),
    getSession(),
  ])

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2}>Pedidos</Title>
            <NewOrderModal
              suppliers={organizations}
              userRole={user?.role.name}
            />
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
