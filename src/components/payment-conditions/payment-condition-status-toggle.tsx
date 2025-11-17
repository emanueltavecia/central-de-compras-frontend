'use client'

import { useState } from 'react'

import { Menu } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'

import { updatePaymentConditionStatus } from '@/app/(private-routes)/payment-conditions/action'
import type { PaymentCondition } from '@/types'

interface PaymentConditionStatusToggleProps {
  paymentCondition: PaymentCondition
}

export function PaymentConditionStatusToggle({
  paymentCondition,
}: PaymentConditionStatusToggleProps) {
  const [loading, setLoading] = useState(false)

  const handleToggleStatus = async () => {
    setLoading(true)

    try {
      const result = await updatePaymentConditionStatus(
        paymentCondition.id,
        !paymentCondition.active,
      )

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: result.message,
          color: 'green',
        })
      } else {
        notifications.show({
          title: 'Erro',
          message: result.message,
          color: 'red',
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      notifications.show({
        title: 'Erro',
        message: 'Erro ao atualizar status da condição',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Menu.Item
      leftSection={
        paymentCondition.active ? (
          <IconPlayerPause size={16} />
        ) : (
          <IconPlayerPlay size={16} />
        )
      }
      onClick={handleToggleStatus}
      disabled={loading}
    >
      {paymentCondition.active ? 'Desativar' : 'Ativar'}
    </Menu.Item>
  )
}
