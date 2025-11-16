import Link from 'next/link'

import { ROUTE_PERMISSIONS } from './consts'
import { LogoutButton } from './logout-button'
import { NavMenu } from './nav-menu'

import { getSession } from '@/lib/auth'

export async function Header() {
  const { user } = await getSession()

  if (!user) {
    return null
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-text-primary text-xl font-bold">
                  Central de Compras
                </h1>
                <p className="text-text-secondary text-xs">
                  {user?.fullName || user?.email}
                </p>
              </div>
            </Link>

            <nav className="flex gap-4">
              {Object.values(ROUTE_PERMISSIONS).map((item) => {
                const hasPermission =
                  !item.roles || item.roles.some((p) => user.role.name === p)

                if (!hasPermission) {
                  return null
                }

                return <NavMenu key={item.route} item={item} />
              })}
            </nav>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

export function HeaderSkeleton() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-text-primary text-xl font-bold">
                  Central de Compras
                </h1>
                <div className="bg-surface h-3 w-32 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-surface h-8 w-16 animate-pulse rounded"></div>
        </div>
      </div>
    </header>
  )
}
