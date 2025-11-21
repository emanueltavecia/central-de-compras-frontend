import { Card, Stack, Text, Title } from '@mantine/core'

import { getSupplierStateConditions } from './action'

import {
  SupplierStateConditionFormButton,
  SupplierStateConditionsTable,
} from '@/components/supplier-state-conditions'

export default async function SupplierStateConditionsPage() {
  const conditions = await getSupplierStateConditions()

  return (
    <Stack gap="xl" p="xl">
      <div className="flex items-center justify-between">
        <Title order={2}>Condições por Estado</Title>
        <SupplierStateConditionFormButton />
      </div>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {conditions.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Nenhuma condição por estado encontrada
          </Text>
        ) : (
          <SupplierStateConditionsTable conditions={conditions} />
        )}
      </Card>
    </Stack>
  )
}
