'use client'

import { useState } from 'react'

import { Button } from '@mantine/core'

import { SupplierStateConditionModal } from './supplier-state-condition-modal'

import type { SupplierStateCondition } from '@/types'

interface SupplierStateConditionFormButtonProps {
  condition?: SupplierStateCondition
  variant?: 'new' | 'edit'
}

export function SupplierStateConditionFormButton({
  condition,
  variant = 'new',
}: SupplierStateConditionFormButtonProps) {
  const [modalOpened, setModalOpened] = useState(false)

  if (variant === 'edit') {
    return (
      <>
        <button
          onClick={() => setModalOpened(true)}
          className="w-full text-left"
        >
          Editar
        </button>
        <SupplierStateConditionModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          condition={condition}
        />
      </>
    )
  }

  return (
    <>
      <Button onClick={() => setModalOpened(true)}>Nova Condição</Button>
      <SupplierStateConditionModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  )
}
