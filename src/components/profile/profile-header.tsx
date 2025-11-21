'use client'

import { useState, useEffect } from 'react'

import { UploadImageModal } from './upload-image-modal'

import { UserRole } from '@/utils/enums'

interface ProfileHeaderProps {
  userId: string
  fullName: string
  role: UserRole
  profileImage?: string
}

export function ProfileHeader({
  userId,
  fullName,
  role,
  profileImage,
}: ProfileHeaderProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
  const initialFullUrl = profileImage?.startsWith('/uploads/') ? `${apiUrl}${profileImage}` : profileImage
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [image, setImage] = useState(initialFullUrl)

  useEffect(() => {
    const fullUrl = profileImage?.startsWith('/uploads/') ? `${apiUrl}${profileImage}` : profileImage
    setImage(fullUrl)
  }, [profileImage, apiUrl])

  useEffect(() => {
    const handler = (e: any) => {
      const newUrl = e.detail?.url
      if (newUrl !== undefined) {
        setImage(newUrl || undefined)
      }
    }
    window.addEventListener('profile-image-updated', handler)
    return () => window.removeEventListener('profile-image-updated', handler)
  }, [])

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
          {image ? (
            <>
              <img
                src={image}
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
                    d="M12 5l2.5 3H19a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1h4.5L12 5zm0 4a4 4 0 100 8 4 4 0 000-8z"
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
                    d="M12 5l2.5 3H19a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1h4.5L12 5zm0 4a4 4 0 100 8 4 4 0 000-8z"
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
        userId={userId}
        currentImage={image}
      />
    </>
  )
}
