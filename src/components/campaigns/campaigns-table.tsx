'use client'

import { Badge, Table, Text } from '@mantine/core'

import { CampaignActionsMenu } from './campaign-actions-menu'

import type { Campaign } from '@/types'
import { CampaignScope, CampaignType } from '@/utils/enums'

interface CampaignsTableProps {
  campaigns: Campaign[]
}

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

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table
          highlightOnHover
          verticalSpacing="sm"
          horizontalSpacing="md"
          className="min-w-5xl"
        >
          <Table.Thead>
            <Table.Tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <Table.Th className="font-semibold text-gray-700">Nome</Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Tipo
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Escopo
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Cashback
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Valor Mínimo
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Qtd. Mínima
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Início
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Término
              </Table.Th>
              <Table.Th
                ta="center"
                className="sticky right-0 w-20 bg-gray-100 from-gray-50 to-gray-100 font-semibold text-gray-700 drop-shadow-[-8px_0_16px_rgba(0,0,0,0.1)] lg:static lg:bg-transparent lg:drop-shadow-none"
              >
                Ações
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {campaigns.map((campaign) => (
              <Table.Tr
                key={campaign.id}
                className="border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50/50"
              >
                <Table.Td>
                  <Text fw={600} size="sm" className="text-gray-900">
                    {campaign.name}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Badge
                    variant="light"
                    size="md"
                    radius="md"
                    color={
                      campaign.type === CampaignType.CASHBACK ? 'green' : 'blue'
                    }
                    className="font-medium"
                  >
                    {getCampaignTypeLabel(campaign.type)}
                  </Badge>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {getCampaignScopeLabel(campaign.scope)}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text
                    size="sm"
                    fw={600}
                    c={campaign.cashbackPercent ? 'green' : 'dimmed'}
                    ta="center"
                  >
                    {campaign.cashbackPercent
                      ? `${campaign.cashbackPercent}%`
                      : '-'}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text
                    size="sm"
                    fw={500}
                    className="text-gray-900"
                    ta="center"
                  >
                    {formatCurrency(campaign.minTotal)}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {campaign.minQuantity ? campaign.minQuantity : '-'}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {formatDate(campaign.startAt)}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {formatDate(campaign.endAt)}
                  </Text>
                </Table.Td>
                <Table.Td className="lg:static-none sticky right-0 bg-white text-center drop-shadow-[-8px_0_16px_rgba(0,0,0,0.1)] lg:static lg:drop-shadow-none lg:bg-transparent">
                  <CampaignActionsMenu campaign={campaign} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}
