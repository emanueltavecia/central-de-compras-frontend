'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Modal, Select, Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'

import { updateOrderStatusAction } from './actions'

import type { Order } from '@/types'
import { OrderStatus, OrgType } from '@/utils/enums'
import {
  updateOrderStatusSchema,
  type UpdateOrderStatusInput,
} from '@/utils/schemas/order-status'

interface OrderStatusModalProps {
  order: Order
  opened: boolean
  onClose: () => void
  userOrgType: OrgType
}

function getStatusLabel(status: OrderStatus): string {
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
  return labels[status]
}

function getAvailableStatuses(
  currentStatus: OrderStatus,
  orgType: OrgType,
): OrderStatus[] {
  if (orgType === OrgType.STORE) {
    const allowedCurrentStatuses = [
      OrderStatus.PLACED,
      OrderStatus.CONFIRMED,
      OrderStatus.SEPARATED,
    ]
    if (allowedCurrentStatuses.includes(currentStatus)) {
      return [OrderStatus.CANCELLED]
    }
    return []
  }

  if (orgType === OrgType.SUPPLIER) {
    if (currentStatus === OrderStatus.DELIVERED) {
      return []
    }

    return [
      OrderStatus.PLACED,
      OrderStatus.CONFIRMED,
      OrderStatus.SEPARATED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.REJECTED,
    ].filter((status) => status !== currentStatus)
  }

  return []
}

export function OrderStatusModal({
  order,
  opened,
  onClose,
  userOrgType,
}: OrderStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateOrderStatusInput>({
    resolver: zodResolver(updateOrderStatusSchema),
  })

  const availableStatuses = getAvailableStatuses(
    order.status || OrderStatus.PLACED,
    userOrgType,
  )
  const selectedStatus = watch('newStatus')

  const statusOptions = availableStatuses.map((status) => ({
    value: status,
    label: getStatusLabel(status),
  }))

  async function onSubmit(data: UpdateOrderStatusInput) {
    try {
      setIsSubmitting(true)

      await updateOrderStatusAction({
        orderId: order.id,
        newStatus: data.newStatus,
        note: data.note,
      })

      notifications.show({
        title: 'Sucesso',
        message: 'Status do pedido alterado com sucesso',
        color: 'green',
        icon: <IconCheck size={18} />,
      })

      reset()
      onClose()
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message:
          error instanceof Error
            ? error.message
            : 'Erro ao alterar status do pedido',
        color: 'red',
        icon: <IconX size={18} />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    reset()
    onClose()
  }

  if (availableStatuses.length === 0) {
    return null
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Alterar Status do Pedido"
      size="md"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <div className="mb-4 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-600">Pedido</p>
            <p className="font-mono text-sm font-semibold">
              {order.id.slice(0, 5)}
            </p>
            <p className="mt-2 text-xs text-gray-600">Status Atual</p>
            <p className="text-sm font-medium">
              {getStatusLabel(order.status || OrderStatus.PLACED)}
            </p>
          </div>

          <Select
            label="Novo Status"
            placeholder="Selecione o novo status"
            data={statusOptions}
            value={selectedStatus}
            onChange={(value) => setValue('newStatus', value as OrderStatus)}
            error={errors.newStatus?.message}
            required
          />
        </div>

        <Textarea
          label="Observação"
          placeholder="Adicione uma observação sobre a alteração (opcional)"
          {...register('note')}
          error={errors.note?.message}
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="subtle"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Confirmar Alteração
          </Button>
        </div>
      </form>
    </Modal>
  )
}
