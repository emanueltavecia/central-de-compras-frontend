'use client'

import { useEffect, useState } from 'react'

import { getPendingCount, getAllChangeRequests } from '@/lib/change-requests'
import type { ChangeRequest } from '@/sdk/change-requests/types'
import { ChangeRequestStatus } from '@/sdk/change-requests/types'

interface NotificationBellProps {
  onRequestClick: (request: ChangeRequest) => void
}

export function NotificationBell({ onRequestClick }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [requests, setRequests] = useState<ChangeRequest[]>([])
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const loadPendingRequests = async () => {
    try {
      const pendingCount = await getPendingCount()
      setCount(pendingCount)

      if (pendingCount > 0) {
        const allRequests = await getAllChangeRequests({
          status: ChangeRequestStatus.PENDING,
        })
        setRequests(allRequests)
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  useEffect(() => {
    loadPendingRequests()
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadPendingRequests, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false)
    }, 500)
    setTimeoutId(id)
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
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="hover:border-primary relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition-all hover:shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="text-text-primary h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {count > 0 && (
          <span className="bg-error absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 px-4 py-3">
            <h3 className="text-text-primary text-sm font-semibold">
              Solicitações Pendentes
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {requests.length === 0 ? (
              <div className="text-text-secondary px-4 py-8 text-center text-sm">
                Nenhuma solicitação pendente
              </div>
            ) : (
              requests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => {
                    onRequestClick(request)
                    setIsOpen(false)
                  }}
                  className="hover:bg-surface w-full border-b border-gray-100 px-4 py-3 text-left transition-colors"
                >
                  <div className="mb-1 flex items-start justify-between">
                    <p className="text-text-primary text-sm font-medium">
                      {request.user?.fullName || request.user?.email}
                    </p>
                    <span className="text-text-secondary text-xs">
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs">
                    {request.organization?.legalName}
                  </p>
                  <p className="text-text-secondary mt-1 text-xs">
                    {Object.keys(request.requestedChanges).length}{' '}
                    alteração(ões)
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
