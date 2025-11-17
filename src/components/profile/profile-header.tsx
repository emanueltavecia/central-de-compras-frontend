'use client'

import { useState } from 'react'

import { UploadImageModal } from './upload-image-modal'

import { UserRole } from '@/utils/enums'

interface ProfileHeaderProps {
  fullName: string
  role: UserRole
  profileImage?: string
}

export function ProfileHeader({
  fullName,
  role,
  profileImage,
}: ProfileHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin'
      case UserRole.SUPPLIER:
        return 'Fornecedor'
      case UserRole.STORE:
        return 'Lojista'
      default:
        return ''
    }
  }

  return (
    <>
      <div className="relative mb-8 overflow-hidden rounded-lg">
        <div className="flex flex-col">
          <div className="bg-primary h-24"></div>
          <div className="h- bg-white"></div>
          <div className="h-24 bg-gray-300"></div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="group absolute top-1/2 left-8 h-32 w-32 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white shadow-lg transition-transform hover:scale-105"
        >
          {profileImage ? (
            <>
              <img
                src={profileImage}
                alt={fullName}
                className="h-full w-full object-cover transition-all group-hover:blur-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <svg
                  className="h-12 w-12 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-full w-full items-center justify-center bg-white transition-all group-hover:blur-sm">
                <span className="text-primary text-4xl font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <svg
                  className="text-primary h-12 w-12 drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </>
          )}
        </button>
        <div className="text-text-primary absolute top-1/2 left-44 translate-y-1/4 pl-4">
          <h1 className="text-3xl font-bold">{fullName}</h1>
          <p className="mt-1 text-lg">{getRoleLabel(role)}</p>
        </div>
      </div>

      <UploadImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
