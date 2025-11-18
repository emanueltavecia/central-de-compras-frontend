'use client'

import { useState } from 'react'

import { notifications } from '@mantine/notifications'

import { updateUser } from '@/lib/users'

interface EditDataModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  currentData: {
    fullName: string
    email: string
    phone: string
  }
}

export function EditDataModal({
  isOpen,
  onClose,
  userId,
  currentData,
}: EditDataModalProps) {
  const [formData, setFormData] = useState(currentData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateUser(userId, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      })

      notifications.show({
        title: 'Sucesso!',
        message: 'Dados atualizados com sucesso',
        color: 'green',
      })

      onClose()

      // Recarrega a página para atualizar os dados
      window.location.reload()
    } catch (error) {
      notifications.show({
        title: 'Erro!',
        message:
          error instanceof Error ? error.message : 'Erro ao atualizar dados',
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
          Alterar Dados
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-text-secondary mb-1 block text-sm font-medium">
              Nome
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
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
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
