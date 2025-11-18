'use client'

import { useState } from 'react'

import { ChangeRequestModal } from './change-request-modal'

interface ChangeRequestCardProps {
  currentData?: {
    name?: string
    email?: string
    phone?: string
  }
}

export function ChangeRequestCard({ currentData }: ChangeRequestCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-text-primary mb-4 text-lg font-bold">
          Trocar Dados?
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          Solicitar Alterações
        </button>
      </div>

      <ChangeRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentData={currentData}
      />
    </>
  )
}
