'use client'

import { Badge, Table, Text } from '@mantine/core'

import { PaymentConditionActionsMenu } from './payment-condition-actions-menu'

import type { PaymentCondition } from '@/types'
import { PaymentMethod } from '@/utils/enums'

interface PaymentConditionsTableProps {
  paymentConditions: PaymentCondition[]
}

function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels = {
    [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
    [PaymentMethod.BOLETO]: 'Boleto',
    [PaymentMethod.PIX]: 'PIX',
  }
  return labels[method] || method
}

function getPaymentMethodColor(method: PaymentMethod): string {
  const colors = {
    [PaymentMethod.CREDIT_CARD]: 'blue',
    [PaymentMethod.BOLETO]: 'orange',
    [PaymentMethod.PIX]: 'green',
  }
  return colors[method] || 'gray'
}

function formatDate(date?: string): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function PaymentConditionsTable({
  paymentConditions,
}: PaymentConditionsTableProps) {
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
                Método de Pagamento
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Prazo (dias)
              </Table.Th>
              <Table.Th className="font-semibold text-gray-700">
                Observações
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Data de Criação
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
            {paymentConditions.map((condition) => (
              <Table.Tr
                key={condition.id}
                className="border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50/50"
              >
                <Table.Td>
                  <Text fw={600} size="sm" className="text-gray-900">
                    {condition.name || '-'}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Badge
                    color={getPaymentMethodColor(condition.paymentMethod)}
                    variant="light"
                  >
                    {getPaymentMethodLabel(condition.paymentMethod)}
                  </Badge>
                </Table.Td>
                <Table.Td ta="center">
                  <Text size="sm" className="text-gray-700">
                    {condition.paymentTermDays ?? '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text
                    size="sm"
                    className="text-gray-600"
                    lineClamp={2}
                    title={condition.notes}
                  >
                    {condition.notes || '-'}
                  </Text>
                </Table.Td>
                <Table.Td ta="center">
                  <Text size="sm" className="text-gray-700">
                    {formatDate(condition.createdAt)}
                  </Text>
                </Table.Td>
                <Table.Td
                  ta="center"
                  className="sticky right-0 bg-white drop-shadow-[-8px_0_16px_rgba(0,0,0,0.1)] lg:static lg:drop-shadow-none"
                >
                  <div className="flex justify-center">
                    <PaymentConditionActionsMenu paymentCondition={condition} />
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}
