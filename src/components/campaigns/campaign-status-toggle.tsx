'use client'

import { useState } from 'react'

import { Switch } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { toggleCampaignStatus } from '@/app/(private-routes)/campaigns/action'

interface CampaignStatusToggleProps {
  campaignId: string
  initialActive: boolean
}

export function CampaignStatusToggle({
  campaignId,
  initialActive,
}: CampaignStatusToggleProps) {
  const [active, setActive] = useState(initialActive)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    setLoading(true)
    try {
      const result = await toggleCampaignStatus(campaignId, checked)

      if (result.success) {
        setActive(checked)
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
      notifications.show({
        title: 'Erro',
        message: 'Erro ao atualizar status',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Switch
      checked={active}
      onChange={(event) => handleToggle(event.currentTarget.checked)}
      disabled={loading}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
