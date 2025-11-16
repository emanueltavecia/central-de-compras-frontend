'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { ActionIcon, Menu } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { MoreVertical, Trash2 } from 'lucide-react'

import { CampaignDeleteModal } from './campaign-delete-modal'
import { CampaignModal } from './campaign-modal'

import { toggleCampaignStatus } from '@/app/(private-routes)/campaigns/action'
import type { Campaign } from '@/types'

interface CampaignActionsMenuProps {
  campaign: Campaign
}

export function CampaignActionsMenu({ campaign }: CampaignActionsMenuProps) {
  const router = useRouter()
  const [modalOpened, setModalOpened] = useState(false)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggleStatus = async () => {
    setLoading(true)
    try {
      const result = await toggleCampaignStatus(campaign.id, !campaign.active)

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: result.message,
          color: 'green',
        })
        router.refresh()
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
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray" disabled={loading}>
            <MoreVertical size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => setModalOpened(true)}>Editar</Menu.Item>

          {campaign.active ? (
            <Menu.Item
              onClick={handleToggleStatus}
              color="orange"
              disabled={loading}
            >
              Desativar
            </Menu.Item>
          ) : (
            <>
              <Menu.Item
                onClick={handleToggleStatus}
                color="green"
                disabled={loading}
              >
                Ativar
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={() => setDeleteModalOpened(true)}
                color="red"
                leftSection={<Trash2 size={16} />}
              >
                Excluir
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>

      <CampaignModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false)
          router.refresh()
        }}
        campaign={campaign}
      />

      <CampaignDeleteModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        campaign={campaign}
      />
    </>
  )
}
