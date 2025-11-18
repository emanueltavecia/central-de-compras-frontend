'use client'

import { useState } from 'react'

import { notifications } from '@mantine/notifications'

import { reviewChangeRequest } from '@/lib/change-requests'
import {
  ChangeRequestStatus,
  type ChangeRequest,
} from '@/sdk/change-requests/types'

interface ReviewRequestModalProps {
  isOpen: boolean
  onClose: () => void
  request: ChangeRequest | null
  onReviewed: () => void
}

export function ReviewRequestModal({
  isOpen,
  onClose,
  request,
  onReviewed,
}: ReviewRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !request) return null

  const handleMarkAsRead = async () => {
    setIsSubmitting(true)

    try {
      await reviewChangeRequest(request.id, {
        status: ChangeRequestStatus.APPROVED,
      })

      notifications.show({
        title: 'Sucesso!',
        message: 'Solicitação marcada como lida',
        color: 'green',
      })

      onReviewed()
      onClose()
    } catch (error) {
      notifications.show({
        title: 'Erro!',
        message:
          error instanceof Error ? error.message : 'Erro ao marcar como lida',
        color: 'red',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-text-primary text-xl font-bold">
              Revisar Solicitação de Alteração
            </h2>
            <p className="text-text-secondary mt-1 text-sm">
              Solicitado em {formatDate(request.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-text-secondary hover:text-text-primary"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Informações do solicitante */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-text-primary mb-2 text-sm font-semibold">
              Solicitante
            </h3>
            <div className="space-y-1">
              <p className="text-text-secondary text-sm">
                <span className="font-medium">Nome:</span>{' '}
                {request.user?.fullName}
              </p>
              <p className="text-text-secondary text-sm">
                <span className="font-medium">Email:</span>{' '}
                {request.user?.email}
              </p>
            </div>
          </div>

          {/* Informações da organização */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-text-primary mb-2 text-sm font-semibold">
              Organização
            </h3>
            <p className="text-text-secondary text-sm">
              {request.organization?.legalName}
            </p>
          </div>

          {/* Alterações solicitadas */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-text-primary mb-2 text-sm font-semibold">
              Alterações Solicitadas
            </h3>
            <div className="space-y-2">
              {Object.entries(request.requestedChanges).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-surface flex items-start justify-between rounded-md p-3"
                >
                  <div className="flex-1">
                    <p className="text-text-secondary text-xs font-medium uppercase">
                      {key === 'fullName'
                        ? 'Nome'
                        : key === 'tradeName'
                          ? 'Nome Fantasia'
                          : key === 'taxId'
                            ? 'CNPJ'
                            : key === 'phone'
                              ? 'Telefone'
                              : key === 'email'
                                ? 'Email'
                                : key}
                    </p>
                    <p className="text-text-primary mt-1 text-sm font-semibold">
                      {String(value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-text-primary rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleMarkAsRead}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark rounded-lg px-6 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Processando...' : 'Marcar como Lido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
