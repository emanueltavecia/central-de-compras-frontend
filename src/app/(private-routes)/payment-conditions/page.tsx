import { Card, Stack, Text, Title } from '@mantine/core'

import { getPaymentConditionsBySupplier } from './action'

import { PaymentConditionFormButton } from '@/components/payment-conditions'
import { PaymentConditionsTable } from '@/components/payment-conditions/payment-conditions-table'
import { getSession } from '@/lib/auth'

export default async function PaymentConditionsPage() {
  const { user } = await getSession()
  const paymentConditions = await getPaymentConditionsBySupplier(
    user?.organizationId as string,
  )

  const activeConditions = paymentConditions.filter(
    (condition) => condition.active,
  )
  const inactiveConditions = paymentConditions.filter(
    (condition) => !condition.active,
  )

  return (
    <Stack gap="xl" p="xl">
      <div className="flex items-center justify-between">
        <Title order={2}>Condições de Pagamento</Title>
        <PaymentConditionFormButton />
      </div>

      <div className="space-y-8">
        <div>
          <Title order={3} mb="md">
            Condições Ativas
          </Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {activeConditions.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Nenhuma condição de pagamento ativa encontrada
              </Text>
            ) : (
              <PaymentConditionsTable paymentConditions={activeConditions} />
            )}
          </Card>
        </div>

        <div>
          <Title order={3} mb="md" className="text-gray-600">
            Condições Inativas
          </Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {inactiveConditions.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Nenhuma condição de pagamento inativa encontrada
              </Text>
            ) : (
              <PaymentConditionsTable paymentConditions={inactiveConditions} />
            )}
          </Card>
        </div>
      </div>
    </Stack>
  )
}
