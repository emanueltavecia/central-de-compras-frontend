import { cacheTag } from 'next/cache'

import { DashboardButton } from '@/components/dashboard/button'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'

async function getData() {
  'use cache'
  cacheTag(CACHE_TAGS.DASHBOARD.DATA)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  console.log('Fetching dashboard data...')
  return new Date().toISOString()
}
export default async function DashboardPage() {
  const data = await getData()
  return (
    <div className="bg-surface min-h-screen">
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
            Esta é uma página de exemplo. Implemente aqui o conteúdo do seu
            dashboard. Data: {data}
          </p>
          <DashboardButton />
        </div>
      </div>
    </div>
  )
}
