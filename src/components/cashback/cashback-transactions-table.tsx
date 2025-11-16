'use client'

import { Badge, Table, Text } from '@mantine/core'

import type { CashbackTransaction } from '@/types'
import { CashbackTransactionType, CashbackReferenceType } from '@/utils/enums'

interface CashbackTransactionsTableProps {
  transactions: CashbackTransaction[]
}

function getTransactionTypeLabel(type?: CashbackTransactionType): string {
  if (!type) return '-'

  const labels = {
    [CashbackTransactionType.EARNED]: 'Ganho',
    [CashbackTransactionType.USED]: 'Usado',
  }
  return labels[type] || type
}

function getReferenceTypeLabel(type?: CashbackReferenceType): string {
  if (!type) return '-'

  const labels = {
    [CashbackReferenceType.CAMPAIGN]: 'Campanha',
    [CashbackReferenceType.SUPPLIER_STATE_CONDITION]: 'Condição de Fornecedor',
  }
  return labels[type] || type
}

function formatCurrency(value?: number): string {
  if (!value) return '-'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDateTime(date?: string): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function CashbackTransactionsTable({
  transactions,
}: CashbackTransactionsTableProps) {
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
            <Table.Tr className="border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
              <Table.Th className="font-semibold text-gray-700">Tipo</Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Valor
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Referência
              </Table.Th>
              <Table.Th className="font-semibold text-gray-700">
                Descrição
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Data
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {transactions.map((transaction) => (
              <Table.Tr
                key={transaction.id}
                className="border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50/50"
              >
                <Table.Td>
                  <Badge
                    variant="light"
                    size="md"
                    radius="md"
                    color={
                      transaction.type === CashbackTransactionType.EARNED
                        ? 'green'
                        : 'red'
                    }
                    className="font-medium"
                  >
                    {getTransactionTypeLabel(transaction.type)}
                  </Badge>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text
                    size="sm"
                    fw={600}
                    c={
                      transaction.type === CashbackTransactionType.EARNED
                        ? 'green'
                        : 'red'
                    }
                    ta="center"
                  >
                    {transaction.type === CashbackTransactionType.EARNED
                      ? '+'
                      : '-'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {getReferenceTypeLabel(transaction.referenceType)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" className="text-gray-900">
                    {transaction.description || '-'}
                  </Text>
                </Table.Td>
                <Table.Td className="text-center">
                  <Text size="sm" c="dimmed" ta="center">
                    {formatDateTime(transaction.createdAt)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}
