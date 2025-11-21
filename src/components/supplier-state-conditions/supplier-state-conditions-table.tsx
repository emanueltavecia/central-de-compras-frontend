'use client'

import { Table, Text } from '@mantine/core'

import { SupplierStateConditionActionsMenu } from './supplier-state-condition-actions-menu'

import type { SupplierStateCondition } from '@/types'
import { BRAZILIAN_STATES } from '@/utils/schemas/supplier-state-condition'

interface SupplierStateConditionsTableProps {
  conditions: SupplierStateCondition[]
}

function getStateLabel(stateValue: string): string {
  const state = BRAZILIAN_STATES.find((s) => s.value === stateValue)
  return state ? state.label : stateValue
}

function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return '-'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatPercent(value?: number): string {
  if (value === undefined || value === null) return '-'
  return `${value}%`
}

function formatDate(date?: string): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function SupplierStateConditionsTable({
  conditions,
}: SupplierStateConditionsTableProps) {
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
              <Table.Th className="font-semibold text-gray-700">
                Estado
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Cashback
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Prazo de Pagamento
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Ajuste de Preço
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Data de Início
              </Table.Th>
              <Table.Th ta="center" className="font-semibold text-gray-700">
                Data de Término
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
            {conditions.map((condition) => (
              <Table.Tr
                key={condition.id}
                className="border-b border-gray-100 transition-colors duration-150 hover:bg-blue-50/50"
              >
                <Table.Td>
                  <Text fw={600} size="sm" className="text-gray-900">
                    {getStateLabel(condition.state)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ta="center" className="text-gray-700">
                    {formatPercent(condition.cashbackPercent)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ta="center" className="text-gray-700">
                    {condition.paymentTermDays
                      ? `${condition.paymentTermDays} dias`
                      : '-'}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ta="center" className="text-gray-700">
                    {formatCurrency(condition.unitPriceAdjustment)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ta="center" className="text-gray-700">
                    {formatDate(condition.effectiveFrom)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ta="center" className="text-gray-700">
                    {formatDate(condition.effectiveTo)}
                  </Text>
                </Table.Td>
                <Table.Td className="sticky right-0 bg-white drop-shadow-[-8px_0_16px_rgba(0,0,0,0.1)] lg:static lg:drop-shadow-none">
                  <div className="flex justify-center">
                    <SupplierStateConditionActionsMenu condition={condition} />
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
