'use client'

import { Button } from '@mantine/core'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-8 text-center">
      <h2 className="text-error text-xl font-semibold">
        Erro ao carregar carteira
      </h2>
      <p className="text-text-secondary max-w-md">
        {error.message ||
          'Ocorreu um erro ao carregar as informações da carteira.'}
      </p>
      <Button
        onClick={reset}
        className="bg-primary hover:bg-primary-dark"
        variant="filled"
      >
        Tentar novamente
      </Button>
    </div>
  )
}
