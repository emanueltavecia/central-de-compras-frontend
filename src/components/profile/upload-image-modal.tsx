'use client'

interface UploadImageModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadImageModal({ isOpen, onClose }: UploadImageModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="text-text-primary mb-4 text-xl font-bold">
          Upload da Imagem de Perfil
        </h2>
        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            className="text-text-secondary w-full rounded-lg border border-gray-300 p-2 text-sm"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-text-primary rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button className="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors">
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
