'use client'

import { useState, useRef, useEffect } from 'react'

import { updateUserProfileImage } from '@/lib/profile/actions'

interface UploadImageModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  currentImage?: string
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return null
}

export function UploadImageModal({
  isOpen,
  onClose,
  currentImage,
}: UploadImageModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | undefined>(currentImage)
  const [loading, setLoading] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setPreview(currentImage)
  }, [currentImage])

  if (!isOpen) return null

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const token = getCookie('@central-de-compras:auth:token')
      if (!token) throw new Error('Token não encontrado')
      const formData = new FormData()
      formData.append('file', file)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
      const res = await fetch(`${apiUrl}/users/profile-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) throw new Error('Falha ao enviar imagem')
      const data = await res.json()
      const newUrl =
        data.data?.profileImageUrl || data.data?.profileImage || preview
      const fullUrl = newUrl?.startsWith('/uploads/')
        ? `${apiUrl}${newUrl}`
        : newUrl
      setPreview(fullUrl)
      await updateUserProfileImage(newUrl)
      window.dispatchEvent(
        new CustomEvent('profile-image-updated', { detail: { url: fullUrl } }),
      )
      onClose()
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const token = getCookie('@central-de-compras:auth:token')
      if (!token) throw new Error('Token não encontrado')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
      const res = await fetch(`${apiUrl}/users/profile-image`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Falha ao excluir imagem')
      setPreview(undefined)
      await updateUserProfileImage('')
      window.dispatchEvent(
        new CustomEvent('profile-image-updated', { detail: { url: '' } }),
      )
      setShowConfirmDelete(false)
      onClose()
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-text-primary mb-4 text-xl font-bold">
          Upload da Imagem de Perfil
        </h2>
        <div className="mb-6 flex flex-col items-center gap-4">
          <label className="group hover:border-primary relative flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover group-hover:opacity-60"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <svg
                  className="group-hover:text-primary h-10 w-10 text-gray-400"
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
                <span className="text-text-secondary group-hover:text-primary text-sm font-medium">
                  Escolher Arquivo
                </span>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSelect}
            />
          </label>
          {currentImage && !showConfirmDelete && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              disabled={loading}
              className="text-error hover:text-error-dark flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Excluir imagem
            </button>
          )}
          {showConfirmDelete && (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-text-primary text-center text-sm font-medium">
                Tem certeza que deseja excluir a imagem de perfil?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={loading}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-error hover:bg-error-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                >
                  {loading ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-text-primary rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:bg-gray-300"
          >
            {loading ? 'Enviando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
