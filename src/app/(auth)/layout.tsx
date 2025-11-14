import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Central de Compras',
  description: 'Faça login no sistema de gestão de compras',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
