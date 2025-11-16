import { Card, Stack, Text, Title, Group, Badge } from '@mantine/core'

import { getCashbackWallet } from '../action'

function formatCurrency(value?: number): string {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default async function CashbackWalletPage() {
  const wallet = await getCashbackWallet()

  return (
    <Stack gap="xl" p="xl">
      <div className="flex items-center justify-between">
        <Title order={2}>Carteira de Cashback</Title>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed" fw={500}>
              Saldo Disponível
            </Text>
            <Text size="xl" fw={700} c="green">
              {formatCurrency(wallet.data.availableBalance)}
            </Text>
          </Stack>
        </Card>

        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed" fw={500}>
              Total Ganho
            </Text>
            <Text size="xl" fw={700} c="blue">
              {formatCurrency(wallet.data.totalEarned)}
            </Text>
          </Stack>
        </Card>

        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed" fw={500}>
              Total Usado
            </Text>
            <Text size="xl" fw={700} c="gray">
              {formatCurrency(wallet.data.totalUsed)}
            </Text>
          </Stack>
        </Card>
      </div>

      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Informações da Carteira</Title>

          <Group>
            <Text size="sm" c="dimmed">
              Status:
            </Text>
            <Badge color="green" variant="light" size="lg">
              Ativa
            </Badge>
          </Group>

          {wallet.data.createdAt && (
            <Group>
              <Text size="sm" c="dimmed">
                Criada em:
              </Text>
              <Text size="sm" fw={500}>
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(wallet.data.createdAt))}
              </Text>
            </Group>
          )}

          {wallet.data.updatedAt && (
            <Group>
              <Text size="sm" c="dimmed">
                Última atualização:
              </Text>
              <Text size="sm" fw={500}>
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(wallet.data.updatedAt))}
              </Text>
            </Group>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}
