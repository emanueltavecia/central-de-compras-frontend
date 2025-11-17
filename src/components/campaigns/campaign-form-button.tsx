'use client'

import { useState } from 'react'

import { Button } from '@mantine/core'

import { CampaignModal } from './campaign-modal'

import type { Campaign } from '@/types'

interface CampaignFormButtonProps {
  campaign?: Campaign
  variant?: 'new' | 'edit'
}

export function CampaignFormButton({
  campaign,
  variant = 'new',
}: CampaignFormButtonProps) {
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
        <CampaignModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          campaign={campaign}
        />
      </>
    )
  }

  return (
    <>
      <Button onClick={() => setModalOpened(true)}>Nova Campanha</Button>
      <CampaignModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  )
}
