'use client'

import { useState } from 'react'

import { Badge, Button, Table, Text } from '@mantine/core'

import type { Order } from '@/types'
import { OrderStatus } from '@/utils/enums'

interface OrdersTableProps {
  orders: Order[]
}

function getStatusLabel(status?: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.DRAFT]: 'Rascunho',
    [OrderStatus.PLACED]: 'Pendente',
    [OrderStatus.CONFIRMED]: 'Aprovado',
    [OrderStatus.SEPARATED]: 'Recusado',
    [OrderStatus.SHIPPED]: 'Em transporte',
    [OrderStatus.DELIVERED]: 'Entregue',
    [OrderStatus.CANCELLED]: 'Cancelado',
    [OrderStatus.REJECTED]: 'Recusado',
  }
  return status ? labels[status] : '-'
}

function getStatusColor(status?: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.DRAFT]: 'gray',
    [OrderStatus.PLACED]: 'orange',
    [OrderStatus.CONFIRMED]: 'blue',
    [OrderStatus.SEPARATED]: 'red',
    [OrderStatus.SHIPPED]: 'purple',
    [OrderStatus.DELIVERED]: 'green',
    [OrderStatus.CANCELLED]: 'red',
    [OrderStatus.REJECTED]: 'red',
  }
  return status ? colors[status] : 'gray'
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  function formatCurrency(value?: number): string {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  function getStoreName(order: Order): string {
    return `Loja ${order.storeOrgId.slice(-1)}`
  }

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className="pl-8">Número Pedido</Table.Th>
          <Table.Th className="pl-8">Nome da Loja</Table.Th>
          <Table.Th className="pl-8">Data Pedido</Table.Th>
          <Table.Th className="pl-8">Valor Total</Table.Th>
          <Table.Th className="pl-8">Status</Table.Th>
          <Table.Th className="pl-8">Ações</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {orders.map((order) => (
          <>
            <Table.Tr key={order.id}>
              <Table.Td className="pl-8">
                <Text fw={500}>{order.id.slice(0, 5)}</Text>
              </Table.Td>
              <Table.Td className="pl-8">{getStoreName(order)}</Table.Td>
              <Table.Td className="pl-8">{formatDate(order.placedAt)}</Table.Td>
              <Table.Td className="pl-8">
                {formatCurrency(order.totalAmount)}
              </Table.Td>
              <Table.Td className="pl-8">
                <Badge variant="light" color={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </Table.Td>
              <Table.Td className="pl-8">
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id,
                    )
                  }
                >
                  {expandedOrder === order.id ? '▲' : '▼'}
                </Button>
              </Table.Td>
            </Table.Tr>
            {expandedOrder === order.id && (
              <Table.Tr>
                <Table.Td colSpan={6} className="bg-gray-50 p-4">
                  <div className="space-y-2">
                    <Text size="sm" fw={600}>
                      Detalhes do Pedido
                    </Text>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Text size="xs" c="dimmed">
                          Subtotal:
                        </Text>
                        <Text size="sm">
                          {formatCurrency(order.subtotalAmount)}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Frete:
                        </Text>
                        <Text size="sm">
                          {formatCurrency(order.shippingCost)}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Ajustes:
                        </Text>
                        <Text size="sm">
                          {formatCurrency(order.adjustments)}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" c="dimmed">
                          Cashback Usado:
                        </Text>
                        <Text size="sm">
                          {formatCurrency(order.cashbackUsed)}
                        </Text>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4">
                        <Text size="sm" fw={600} mb="xs">
                          Itens:
                        </Text>
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Produto</Table.Th>
                              <Table.Th>Qtd</Table.Th>
                              <Table.Th>Preço Unit.</Table.Th>
                              <Table.Th>Total</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {order.items.map((item) => (
                              <Table.Tr key={item.id}>
                                <Table.Td>{item.productNameSnapshot}</Table.Td>
                                <Table.Td>{item.quantity}</Table.Td>
                                <Table.Td>
                                  {formatCurrency(item.unitPrice)}
                                </Table.Td>
                                <Table.Td>
                                  {formatCurrency(item.totalPrice)}
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                </Table.Td>
              </Table.Tr>
            )}
          </>
        ))}
      </Table.Tbody>
    </Table>
  )
}
