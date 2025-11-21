'use client'

import { useState } from 'react'

import { NotificationBell } from './notification-bell'
import { ReviewRequestModal } from './review-request-modal'
import { UserMenu } from './user-menu'

import { SessionUser } from '@/lib/auth'
import type { ChangeRequest } from '@/sdk/change-requests/types'
import { UserRole } from '@/utils/enums'

interface HeaderActionsProps {
  user: SessionUser
}

export function HeaderActions({ user }: HeaderActionsProps) {
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(
    null,
  )
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const isAdmin = user.role.name === UserRole.ADMIN
  const isStoreOrSupplier =
    user.role.name === UserRole.STORE || user.role.name === UserRole.SUPPLIER

  const handleRequestClick = (request: ChangeRequest) => {
    setSelectedRequest(request)
    setIsReviewModalOpen(true)
  }

  const handleReviewed = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <>
      <div className="flex items-center gap-4">
        {(isAdmin || isStoreOrSupplier) && (
          <NotificationBell
            key={refreshTrigger}
            onRequestClick={handleRequestClick}
            userId={isStoreOrSupplier ? user.id : undefined}
          />
        )}
        <UserMenu user={user} />
      </div>

      <ReviewRequestModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        request={selectedRequest}
        onReviewed={handleReviewed}
        isAdmin={isAdmin}
      />
    </>
  )
}
