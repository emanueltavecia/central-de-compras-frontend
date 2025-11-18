import { redirect } from 'next/navigation'

import { OrganizationsPageClient } from '@/components/organizations/organizations-page-client'
import { getSession } from '@/lib/auth'
import { UserRole } from '@/utils/enums'

export default async function StoresPage() {
  const { user } = await getSession()
  if (!user || user.role.name !== UserRole.ADMIN) {
    redirect('/dashboard')
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <OrganizationsPageClient variant="stores" />
    </div>
  )
}
