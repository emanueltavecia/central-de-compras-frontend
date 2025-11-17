'use client'

import { useState } from 'react'

import { ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react'

import { PaymentConditionDeleteModal } from './payment-condition-delete-modal'
import { PaymentConditionModal } from './payment-condition-modal'
import { PaymentConditionStatusToggle } from './payment-condition-status-toggle'

import type { PaymentCondition } from '@/types'

interface PaymentConditionActionsMenuProps {
  paymentCondition: PaymentCondition
}

export function PaymentConditionActionsMenu({
  paymentCondition,
}: PaymentConditionActionsMenuProps) {
  const [editOpened, setEditOpened] = useState(false)
  const [deleteOpened, setDeleteOpened] = useState(false)

  return (
    <>
      <Menu shadow="md" width={200} position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray">
            <IconDots size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEdit size={16} />}
            onClick={() => setEditOpened(true)}
          >
            Editar
          </Menu.Item>

          <PaymentConditionStatusToggle paymentCondition={paymentCondition} />

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => setDeleteOpened(true)}
          >
            Excluir
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <PaymentConditionModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        paymentCondition={paymentCondition}
      />

      <PaymentConditionDeleteModal
        opened={deleteOpened}
        onClose={() => setDeleteOpened(false)}
        paymentCondition={paymentCondition}
      />
    </>
  )
}
