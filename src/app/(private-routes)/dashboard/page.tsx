import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getSession } from '@/lib/auth'
import { getDashboardStats } from '@/lib/stats/actions'
import { UserRole } from '@/utils/enums'

export default async function DashboardPage() {
  const { user } = await getSession()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.role.name === UserRole.ADMIN

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg">
          <h1 className="text-text-primary mb-4 text-3xl font-bold">
            Bem-vindo ao Dashboard
          </h1>
          <p className="text-text-secondary mb-6">
            Você está autenticado no sistema Central de Compras
          </p>
          <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-primary h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-text-secondary text-sm">
            Use o menu de navegação para acessar as funcionalidades do sistema
          </p>
        </div>
      </div>
    )
  }

  const stats = await getDashboardStats()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-text-primary mb-8 text-3xl font-bold">
        Dashboard Administrativo
      </h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-text-secondary text-sm font-medium">
              Total de Lojas
            </h3>
            <svg
              className="text-primary h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p className="text-text-primary text-3xl font-bold">
            {stats.totalStores}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-text-secondary text-sm font-medium">
              Total de Fornecedores
            </h3>
            <svg
              className="text-primary h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p className="text-text-primary text-3xl font-bold">
            {stats.totalSuppliers}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-text-secondary text-sm font-medium">
              Total de Usuários
            </h3>
            <svg
              className="text-primary h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <p className="text-text-primary text-3xl font-bold">
            {stats.totalUsers}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-text-primary mb-4 text-xl font-semibold">
          Acessos Rápidos
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/organizations/stores"
            className="hover:border-primary flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <svg
                className="text-primary h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-text-primary text-lg font-semibold">
                Gerenciar Lojas
              </h3>
              <p className="text-text-secondary text-sm">
                Visualizar e gerenciar todas as lojas cadastradas
              </p>
            </div>
          </Link>

          <Link
            href="/organizations/suppliers"
            className="hover:border-primary flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <svg
                className="text-primary h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-text-primary text-lg font-semibold">
                Gerenciar Fornecedores
              </h3>
              <p className="text-text-secondary text-sm">
                Visualizar e gerenciar todos os fornecedores cadastrados
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
