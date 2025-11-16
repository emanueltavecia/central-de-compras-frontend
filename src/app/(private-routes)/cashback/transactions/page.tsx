import { Card, Stack, Text, Title } from '@mantine/core'

import { getCashbackTransactions } from '../action'

import { CashbackTransactionsTable } from '@/components/cashback'

export default async function CashbackTransactionsPage() {
  const transactions = await getCashbackTransactions()

  return (
    <Stack gap="xl" p="xl">
      <div className="flex items-center justify-between">
        <Title order={2}>Transações de Cashback</Title>
      </div>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {transactions.data.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Nenhuma transação encontrada
          </Text>
        ) : (
          <CashbackTransactionsTable transactions={transactions.data} />
        )}
      </Card>
    </Stack>
  )
}
