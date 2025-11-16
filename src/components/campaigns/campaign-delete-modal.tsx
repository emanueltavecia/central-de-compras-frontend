'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { AlertTriangle } from 'lucide-react'

import { deleteCampaign } from '@/app/(private-routes)/campaigns/action'
import type { Campaign } from '@/types'

interface CampaignDeleteModalProps {
  opened: boolean
  onClose: () => void
  campaign: Campaign
}

export function CampaignDeleteModal({
  opened,
  onClose,
  campaign,
}: CampaignDeleteModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteCampaign(campaign.id)

      if (result.success) {
        notifications.show({
          title: 'Sucesso',
          message: result.message,
          color: 'green',
        })
        onClose()
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
        message: 'Erro ao excluir campanha',
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
      title={
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle size={24} />
          <Text fw={600} size="lg">
            Confirmar Exclusão
          </Text>
        </div>
      }
      centered
      size="md"
      radius="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="lg">
        <div className="rounded-lg bg-red-50 p-4">
          <Text size="sm" c="dimmed" mb="xs">
            Você está prestes a excluir a campanha:
          </Text>
          <Text fw={600} size="md" c="red">
            {campaign.name}
          </Text>
        </div>

        <Text size="sm" c="dimmed">
          Esta ação não pode ser desfeita. Todos os dados relacionados a esta
          campanha serão permanentemente removidos.
        </Text>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button
            variant="default"
            onClick={onClose}
            disabled={loading}
            radius="md"
          >
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={loading}
            radius="md"
            leftSection={<AlertTriangle size={18} />}
          >
            Excluir Campanha
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
