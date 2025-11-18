'use client'

import { useState } from 'react'

import { Button, Group, Modal, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { deletePaymentCondition } from '@/app/(private-routes)/payment-conditions/action'
import type { PaymentCondition } from '@/types'

interface PaymentConditionDeleteModalProps {
  opened: boolean
  onClose: () => void
  paymentCondition: PaymentCondition
}

export function PaymentConditionDeleteModal({
  opened,
  onClose,
  paymentCondition,
}: PaymentConditionDeleteModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const result = await deletePaymentCondition(paymentCondition.id)

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: result.message,
          color: 'green',
        })
        onClose()
      } else {
        notifications.show({
          title: 'Erro',
          message: result.message,
          color: 'red',
        })
      }
    } catch (error) {
      console.error('Erro ao excluir condição:', error)
      notifications.show({
        title: 'Erro',
        message: 'Erro ao excluir condição de pagamento',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirmar Exclusão"
      centered
    >
      <Text size="sm" mb="md">
        Tem certeza que deseja excluir a condição de pagamento{' '}
        <strong>{paymentCondition.name || 'sem nome'}</strong>? Esta ação não
        pode ser desfeita.
      </Text>

      <Group justify="flex-end">
        <Button variant="default" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button color="red" onClick={handleDelete} loading={loading}>
          Excluir
        </Button>
      </Group>
    </Modal>
  )
}
