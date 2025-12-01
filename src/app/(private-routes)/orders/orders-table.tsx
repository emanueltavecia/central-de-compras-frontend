'use client'

import { Fragment, useState } from 'react'

import {
  Badge,
  Button,
  Modal,
  Table,
  Text,
  Timeline,
  Tooltip,
} from '@mantine/core'
import { IconClockHour4, IconEdit, IconHistory } from '@tabler/icons-react'

import { OrderStatusModal } from '@/components/orders'
import type { Order, OrderStatusHistory, PaymentCondition } from '@/types'
import { OrderStatus, PaymentMethod, OrgType } from '@/utils/enums'

interface OrderWithPaymentCondition extends Order {
  paymentCondition?: PaymentCondition
}

interface OrdersTableProps {
  orders: OrderWithPaymentCondition[]
  userOrgType: OrgType
}

function getStatusLabel(status?: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.DRAFT]: 'Rascunho',
    [OrderStatus.PLACED]: 'Pendente',
    [OrderStatus.CONFIRMED]: 'Aprovado',
    [OrderStatus.SEPARATED]: 'Separado',
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
    [OrderStatus.SEPARATED]: 'cyan',
    [OrderStatus.SHIPPED]: 'purple',
    [OrderStatus.DELIVERED]: 'green',
    [OrderStatus.CANCELLED]: 'red',
    [OrderStatus.REJECTED]: 'red',
  }
  return status ? colors[status] : 'gray'
}

function getPaymentMethodLabel(method?: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
    [PaymentMethod.BOLETO]: 'Boleto',
    [PaymentMethod.PIX]: 'PIX',
  }
  return method ? labels[method] : '-'
}

export function OrdersTable({ orders, userOrgType }: OrdersTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [selectedOrderHistory, setSelectedOrderHistory] = useState<
    OrderStatusHistory[]
  >([])
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

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

  function handleOpenHistoryModal(order: Order) {
    setSelectedOrderHistory(order.statusHistory)
    setSelectedOrderId(order.id)
    setHistoryModalOpen(true)
  }

  function formatDateTime(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  function handleOpenStatusModal(order: Order) {
    setSelectedOrder(order)
    setStatusModalOpen(true)
  }

  function canChangeStatus(order: Order): boolean {
    if (userOrgType === OrgType.STORE) {
      const allowedStatuses = [
        OrderStatus.PLACED,
        OrderStatus.CONFIRMED,
        OrderStatus.SEPARATED,
      ]
      return allowedStatuses.includes(order.status || OrderStatus.PLACED)
    }

    if (userOrgType === OrgType.SUPPLIER) {
      return order.status !== OrderStatus.DELIVERED
    }

    return false
  }

  return (
    <>
      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          opened={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false)
            setSelectedOrder(null)
          }}
          userOrgType={userOrgType}
        />
      )}

      <Modal
        opened={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <IconHistory size={24} />
            <Text fw={600} size="lg">
              Histórico de Status do Pedido
            </Text>
          </div>
        }
        size="lg"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 px-2 py-3">
            <Text size="xs" c="dimmed" mb={4}>
              Número do Pedido
            </Text>
            <Text size="sm" fw={500} className="font-mono">
              {selectedOrderId.slice(0, 5)}
            </Text>
          </div>

          {selectedOrderHistory.length > 0 ? (
            <Timeline
              active={selectedOrderHistory.length}
              bulletSize={28}
              lineWidth={2}
              className="ml-2"
            >
              {selectedOrderHistory.map((history) => (
                <Timeline.Item
                  key={history.id}
                  bullet={<IconClockHour4 size={14} />}
                  title={
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="light"
                        color={getStatusColor(history.newStatus)}
                        size="lg"
                      >
                        {getStatusLabel(history.newStatus)}
                      </Badge>
                    </div>
                  }
                  color={getStatusColor(history.newStatus)}
                >
                  <div className="mt-2 space-y-1 pb-4">
                    <div className="flex items-center gap-2">
                      <Text size="sm" c="dimmed">
                        {formatDateTime(history.createdAt)}
                      </Text>
                    </div>

                    {history.changedBy && (
                      <div className="rounded bg-white py-2">
                        <Text size="xs" c="dimmed" mb={2}>
                          Alterado por
                        </Text>
                        <Text size="sm" fw={500}>
                          {history.changedBy.fullName}
                        </Text>
                      </div>
                    )}

                    {history.note && (
                      <div className="rounded bg-white py-2">
                        <Text size="xs" c="dimmed" mb={2}>
                          Observação
                        </Text>
                        <Text size="sm">{history.note}</Text>
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <Text c="dimmed" size="sm">
                Nenhum histórico disponível para este pedido
              </Text>
            </div>
          )}
        </div>
      </Modal>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="pl-8">Número Pedido</Table.Th>
            <Table.Th className="pl-8">Nome da Loja</Table.Th>
            <Table.Th className="pl-8">Data Pedido</Table.Th>
            <Table.Th className="pl-8">Valor Total</Table.Th>
            <Table.Th className="pl-8">Condição de Pagamento</Table.Th>
            <Table.Th className="pl-8">Status</Table.Th>
            <Table.Th className="pl-8">Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.map((order) => (
            <Fragment key={order.id}>
              <Table.Tr key={order.id}>
                <Table.Td className="pl-8">
                  <Text fw={500}>{order.id.slice(0, 5)}</Text>
                </Table.Td>
                <Table.Td className="pl-8">{getStoreName(order)}</Table.Td>
                <Table.Td className="pl-8">
                  {formatDate(order.placedAt)}
                </Table.Td>
                <Table.Td className="pl-8">
                  {formatCurrency(order.totalAmount)}
                </Table.Td>
                <Table.Td className="pl-8">
                  {order.paymentCondition ? (
                    <Tooltip
                      label={
                        <div className="space-y-1">
                          <div>
                            <Text size="xs" fw={600}>
                              {order.paymentCondition.name || 'Sem nome'}
                            </Text>
                          </div>
                          <div>
                            <Text size="xs" c="dimmed">
                              Método:{' '}
                              {getPaymentMethodLabel(
                                order.paymentCondition.paymentMethod,
                              )}
                            </Text>
                          </div>
                          {order.paymentCondition.paymentTermDays && (
                            <div>
                              <Text size="xs" c="dimmed">
                                Prazo: {order.paymentCondition.paymentTermDays}{' '}
                                dias
                              </Text>
                            </div>
                          )}
                          {order.paymentCondition.notes && (
                            <div>
                              <Text size="xs" c="dimmed">
                                Obs: {order.paymentCondition.notes}
                              </Text>
                            </div>
                          )}
                        </div>
                      }
                      withArrow
                      position="top"
                      multiline
                      w={200}
                    >
                      <Text
                        size="sm"
                        className="w-fit underline! decoration-dotted!"
                      >
                        {order.paymentCondition.name || 'Ver detalhes'}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text size="sm" c="dimmed">
                      Não informada
                    </Text>
                  )}
                </Table.Td>
                <Table.Td className="pl-8">
                  <Badge variant="light" color={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </Table.Td>
                <Table.Td className="pl-8">
                  <div className="flex items-center gap-2">
                    {canChangeStatus(order) && (
                      <Tooltip label="Alterar status" position="top" withArrow>
                        <Button
                          variant="subtle"
                          size="xs"
                          color="green"
                          onClick={() => handleOpenStatusModal(order)}
                        >
                          <IconEdit size={16} />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip
                      label="Ver histórico de status"
                      position="top"
                      withArrow
                    >
                      <Button
                        variant="subtle"
                        size="xs"
                        color="blue"
                        onClick={() => handleOpenHistoryModal(order)}
                      >
                        <IconHistory size={16} />
                      </Button>
                    </Tooltip>
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
                  </div>
                </Table.Td>
              </Table.Tr>
              {expandedOrder === order.id && (
                <Table.Tr>
                  <Table.Td colSpan={7} className="bg-gray-50 p-4">
                    <div className="flex flex-col gap-2">
                      <Text size="sm" fw={600}>
                        Detalhes do Pedido
                      </Text>
                      <div className="flex gap-22">
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
                        <div>
                          <Text size="xs" c="dimmed">
                            Cashback Recebido:
                          </Text>
                          <Text size="sm">
                            {formatCurrency(order.totalCashback)}
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
                                  <Table.Td>
                                    {item.productNameSnapshot}
                                  </Table.Td>
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
            </Fragment>
          ))}
        </Table.Tbody>
      </Table>
    </>
  )
}
