import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'

import { getCampaigns } from './action'

import { CampaignScope, CampaignType } from '@/utils/enums'

function getCampaignTypeLabel(type: CampaignType): string {
  const labels = {
    [CampaignType.CASHBACK]: 'Cashback',
    [CampaignType.GIFT]: 'Brinde',
  }
  return labels[type] || type
}

function getCampaignScopeLabel(scope?: CampaignScope): string {
  if (!scope) return '-'

  const labels = {
    [CampaignScope.ALL]: 'Todos',
    [CampaignScope.CATEGORY]: 'Categoria',
    [CampaignScope.PRODUCT]: 'Produto',
  }
  return labels[scope] || scope
}

function formatCurrency(value?: number): string {
  if (!value) return '-'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(date?: string): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <Stack gap="lg" p="xl">
      <Group justify="space-between" align="center">
        <Title order={2}>Campanhas</Title>
        <Button>Nova Campanha</Button>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {campaigns.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Nenhuma campanha encontrada
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Escopo</th>
                <th>Cashback</th>
                <th>Valor Mínimo</th>
                <th>Quantidade Mínima</th>
                <th>Início</th>
                <th>Término</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>
                    <Text fw={500}>{campaign.name}</Text>
                  </td>
                  <td>
                    <Badge
                      variant="light"
                      color={
                        campaign.type === CampaignType.CASHBACK
                          ? 'green'
                          : 'blue'
                      }
                    >
                      {getCampaignTypeLabel(campaign.type)}
                    </Badge>
                  </td>
                  <td>{getCampaignScopeLabel(campaign.scope)}</td>
                  <td>
                    {campaign.cashbackPercent
                      ? `${campaign.cashbackPercent}%`
                      : '-'}
                  </td>
                  <td>{formatCurrency(campaign.minTotal)}</td>
                  <td>{campaign.minQuantity ? campaign.minQuantity : '-'}</td>
                  <td>{formatDate(campaign.startAt)}</td>
                  <td>{formatDate(campaign.endAt)}</td>
                  <td>
                    <Badge
                      variant="light"
                      color={campaign.active ? 'green' : 'gray'}
                    >
                      {campaign.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Stack>
  )
}
