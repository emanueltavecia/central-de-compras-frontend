'use client'

import { useState } from 'react'

import Link from 'next/link'

import { logout, SessionUser } from '@/lib/auth'
import { UserRole } from '@/utils/enums'

interface UserMenuProps {
  user: SessionUser
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

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
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="hover:border-primary flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all hover:shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-text-primary text-sm font-medium">
          {user.fullName || user.email}
        </span>
        <div className="bg-primary flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.fullName || user.email}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-white">
              {(user.fullName || user.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
          <Link
            href="/profile"
            className="text-primary hover:bg-surface flex items-center justify-center gap-2 px-4 py-3 text-sm transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Perfil</span>
          </Link>
          <button
            onClick={() => logout()}
            className="text-error hover:bg-surface flex w-full items-center justify-center gap-2 px-4 py-3 text-sm transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  )
}
