import { Card, Group, Stack, Title } from '@mantine/core'

import { getOrders } from './action'
import { NewOrderModal } from './new-order-modal'
import { OrdersFilters } from './orders-filters'
import { OrdersTable } from './orders-table'

import { getPaymentConditions } from '@/app/(private-routes)/payment-conditions/action'
import { getSession } from '@/lib/auth/session'
import { getAllOrganizations } from '@/lib/organizations'
import { OrgType } from '@/utils/enums/org-type'

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string
    placedAtFrom?: string
    placedAtTo?: string
    minAmount?: string
    maxAmount?: string
    orderId?: string
  }>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams

  const [orders, organizations, { user }, paymentConditions] =
    await Promise.all([
      getOrders(params),
      getAllOrganizations({ type: OrgType.SUPPLIER, active: true }),
      getSession(),
      getPaymentConditions(),
    ])

  const ordersWithPaymentCondition = orders.map((order) => ({
    ...order,
    paymentCondition: paymentConditions.find(
      (pc) => pc.id === order.paymentConditionId,
    ),
  }))

  const userOrgType = user?.organization?.type || OrgType.STORE

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
            <OrdersTable
              orders={ordersWithPaymentCondition}
              userOrgType={userOrgType}
            />
          </Card>
        </Stack>
      </div>

      <div className="w-80">
        <OrdersFilters />
      </div>
    </div>
  )
}
