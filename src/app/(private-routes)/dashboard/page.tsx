import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Tooltip } from '@mantine/core'

import { getSession } from '@/lib/auth'
import { getDashboardStats } from '@/lib/stats/actions'
import type {
  DashboardAdminStats,
  DashboardStoreStats,
  DashboardSupplierStats,
} from '@/sdk/stats/types'
import { UserRole } from '@/utils/enums'

export default async function DashboardPage() {
  const { user } = await getSession()

  if (!user) {
    redirect('/login')
  }

  const stats = await getDashboardStats()
  const userRole = user.role.name

  if (userRole === UserRole.ADMIN) {
    const adminStats = stats as DashboardAdminStats

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
              {adminStats.totalStores}
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
              {adminStats.totalSuppliers}
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
              {adminStats.totalUsers}
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

  if (userRole === UserRole.SUPPLIER) {
    const supplierStats = stats as DashboardSupplierStats

    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-text-primary mb-8 text-3xl font-bold">
          Dashboard do Fornecedor
        </h1>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-text-secondary text-sm font-medium">
                Campanhas Ativas
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
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <p className="text-text-primary text-3xl font-bold">
              {supplierStats.activeCampaigns}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-text-secondary text-sm font-medium">
                Condições de Estado
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <p className="text-text-primary text-3xl font-bold">
              {supplierStats.activeSupplierStateConditions}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-text-secondary text-sm font-medium">
                  Pedidos Ativos
                </h3>
                <Tooltip
                  label="Pedidos não cancelados, rejeitados ou pendentes"
                  position="top"
                  withArrow
                >
                  <svg
                    className="text-text-secondary h-4 w-4 cursor-help"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Tooltip>
              </div>
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-text-primary text-3xl font-bold">
              {supplierStats.activeOrders}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-text-secondary text-sm font-medium">
                Condições de Pagamento
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <p className="text-text-primary text-3xl font-bold">
              {supplierStats.activePaymentConditions}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-text-secondary text-sm font-medium">
                Produtos Ativos
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
              {supplierStats.activeProducts}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-text-primary mb-4 text-xl font-semibold">
            Acessos Rápidos
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/campaigns"
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
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-semibold">
                  Gerenciar Campanhas
                </h3>
                <p className="text-text-secondary text-sm">
                  Visualizar e gerenciar suas campanhas
                </p>
              </div>
            </Link>

            <Link
              href="/products"
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
                  Gerenciar Produtos
                </h3>
                <p className="text-text-secondary text-sm">
                  Visualizar e gerenciar seus produtos
                </p>
              </div>
            </Link>

            <Link
              href="/orders"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-semibold">
                  Gerenciar Pedidos
                </h3>
                <p className="text-text-secondary text-sm">
                  Visualizar e gerenciar seus pedidos
                </p>
              </div>
            </Link>

            <Link
              href="/payment-conditions"
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-semibold">
                  Condições de Pagamento
                </h3>
                <p className="text-text-secondary text-sm">
                  Gerenciar condições de pagamento
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (userRole === UserRole.STORE) {
    const storeStats = stats as DashboardStoreStats

    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-text-primary mb-8 text-3xl font-bold">
          Dashboard da Loja
        </h1>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-text-secondary text-sm font-medium">
                Pedidos Realizados
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <p className="text-text-primary text-3xl font-bold">
              {storeStats.placedOrders}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-text-secondary text-sm font-medium">
                Pedidos Aprovados
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-text-primary text-3xl font-bold">
              {storeStats.confirmedOrders}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-text-secondary text-sm font-medium">
                Saldo de Cashback
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-text-primary text-3xl font-bold">
              R$ {storeStats.cashbackBalance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-text-primary mb-4 text-xl font-semibold">
            Acessos Rápidos
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/orders"
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-semibold">
                  Meus Pedidos
                </h3>
                <p className="text-text-secondary text-sm">
                  Visualizar e acompanhar seus pedidos
                </p>
              </div>
            </Link>

            <Link
              href="/cashback"
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-semibold">
                  Meu Cashback
                </h3>
                <p className="text-text-secondary text-sm">
                  Visualizar saldo e transações de cashback
                </p>
              </div>
            </Link>

            <Link
              href="/campaigns"
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
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-semibold">
                  Campanhas Disponíveis
                </h3>
                <p className="text-text-secondary text-sm">
                  Visualizar campanhas e promoções
                </p>
              </div>
            </Link>

            <Link
              href="/products"
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
                  Catálogo de Produtos
                </h3>
                <p className="text-text-secondary text-sm">
                  Navegar pelo catálogo de produtos
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
