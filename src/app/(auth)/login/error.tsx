'use client'

import { Button } from '@mantine/core'

export default function LoginError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="max-w-md px-4 py-8 text-center">
        <div className="mb-6">
          <div className="bg-error/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-error h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-text-primary mb-2 text-xl font-bold">
          Erro ao carregar a página
        </h2>
        <p className="text-text-secondary mb-6 text-sm">
          Ocorreu um erro ao tentar acessar a página de login.
        </p>
        <Button
          onClick={reset}
          className="bg-primary hover:bg-primary-dark transition-colors"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  )
}
