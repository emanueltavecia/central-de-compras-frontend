'use client'

import { useState } from 'react'

import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { AlertTriangle } from 'lucide-react'

import { deleteSupplierStateCondition } from '@/app/(private-routes)/supplier-state-conditions/action'
import type { SupplierStateCondition } from '@/types'
import { BRAZILIAN_STATES } from '@/utils/schemas/supplier-state-condition'

interface SupplierStateConditionDeleteModalProps {
  opened: boolean
  onClose: () => void
  condition: SupplierStateCondition
}

function getStateLabel(stateValue: string): string {
  const state = BRAZILIAN_STATES.find((s) => s.value === stateValue)
  return state ? state.label : stateValue
}

export function SupplierStateConditionDeleteModal({
  opened,
  onClose,
  condition,
}: SupplierStateConditionDeleteModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteSupplierStateCondition(condition.id)

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
      notifications.show({
        title: 'Erro',
        message: 'Erro ao excluir condição',
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
            Você está prestes a excluir a condição para o estado:
          </Text>
          <Text fw={600} size="md" c="red">
            {getStateLabel(condition.state)}
          </Text>
        </div>

        <Text size="sm" c="dimmed">
          Esta ação não pode ser desfeita. Todos os dados relacionados a esta
          condição serão permanentemente removidos.
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
            Confirmar Exclusão
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
