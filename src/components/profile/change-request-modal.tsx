'use client'

import { useState } from 'react'

import { notifications } from '@mantine/notifications'

import { createChangeRequest } from '@/lib/change-requests'

interface ChangeRequestModalProps {
  isOpen: boolean
  onClose: () => void
  currentData?: {
    name?: string
    email?: string
    phone?: string
  }
}

export function ChangeRequestModal({
  isOpen,
  onClose,
  currentData,
}: ChangeRequestModalProps) {
  const [formData, setFormData] = useState({
    name: currentData?.name || '',
    email: currentData?.email || '',
    phone: currentData?.phone || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const requestedChanges: Record<string, string> = {}
      if (formData.name !== currentData?.name) {
        requestedChanges.fullName = formData.name
      }
      if (formData.email !== currentData?.email) {
        requestedChanges.email = formData.email
      }
      if (formData.phone !== currentData?.phone) {
        requestedChanges.phone = formData.phone
      }

      if (Object.keys(requestedChanges).length === 0) {
        notifications.show({
          title: 'Aviso',
          message: 'Nenhuma alteração foi feita',
          color: 'yellow',
        })
        setIsSubmitting(false)
        return
      }

      await createChangeRequest({ requestedChanges })

      notifications.show({
        title: 'Sucesso!',
        message: 'Solicitação enviada com sucesso',
        color: 'green',
      })

      onClose()
    } catch (error) {
      notifications.show({
        title: 'Erro!',
        message:
          error instanceof Error ? error.message : 'Erro ao enviar solicitação',
        color: 'red',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-text-primary mb-6 text-xl font-bold">
          Solicitar Alterações de Dados
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="text-text-secondary mb-1 block text-sm font-medium">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="text-text-primary focus:border-primary focus:ring-primary focus:ring-opacity-50 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="text-text-primary focus:border-primary focus:ring-primary focus:ring-opacity-50 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-sm font-medium">
              Telefone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="text-text-primary focus:border-primary focus:ring-primary focus:ring-opacity-50 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-text-primary rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
