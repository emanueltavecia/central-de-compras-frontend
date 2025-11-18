'use client'

import { useState } from 'react'

import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import { PaymentConditionModal } from './payment-condition-modal'

export function PaymentConditionFormButton() {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Button
        leftSection={<IconPlus size={18} />}
        onClick={() => setOpened(true)}
      >
        Nova Condição
      </Button>
      <PaymentConditionModal opened={opened} onClose={() => setOpened(false)} />
    </>
  )
}
