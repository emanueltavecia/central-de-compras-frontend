'use client'

import { useState } from 'react'

import { ActionIcon, Menu } from '@mantine/core'
import { MoreVertical, Trash2 } from 'lucide-react'

import { SupplierStateConditionDeleteModal } from './supplier-state-condition-delete-modal'
import { SupplierStateConditionModal } from './supplier-state-condition-modal'

import type { SupplierStateCondition } from '@/types'

interface SupplierStateConditionActionsMenuProps {
  condition: SupplierStateCondition
}

export function SupplierStateConditionActionsMenu({
  condition,
}: SupplierStateConditionActionsMenuProps) {
  const [modalOpened, setModalOpened] = useState(false)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)

  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray">
            <MoreVertical size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => setModalOpened(true)}>Editar</Menu.Item>

          <Menu.Divider />
          <Menu.Item
            onClick={() => setDeleteModalOpened(true)}
            color="red"
            leftSection={<Trash2 size={16} />}
          >
            Excluir
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <SupplierStateConditionModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false)
        }}
        condition={condition}
      />

      <SupplierStateConditionDeleteModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        condition={condition}
      />
    </>
  )
}
