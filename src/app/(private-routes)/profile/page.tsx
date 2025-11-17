import { redirect } from 'next/navigation'

import { AdminPersonalInfoCard } from '@/components/profile/admin-personal-info-card'
import { ChangeRequestCard } from '@/components/profile/change-request-card'
import { OrganizationInfoCard } from '@/components/profile/organization-info-card'
import { PersonalInfoCard } from '@/components/profile/personal-info-card'
import { ProfileHeader } from '@/components/profile/profile-header'
import { getSession } from '@/lib/auth'
import { OrgType, UserRole } from '@/utils/enums'

export default async function ProfilePage() {
  const { user } = await getSession()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.role.name === UserRole.ADMIN

  return (
    <div className="bg-surface min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <ProfileHeader
          fullName={user.fullName || user.email}
          role={user.role.name}
          profileImage={user.profileImage}
        />

        {isAdmin ? (
          <div className="grid gap-6">
            <AdminPersonalInfoCard
              userId={user.id}
              fullName={user.fullName || user.email}
              email={user.email}
              phone={user.phone}
            />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-6 lg:grid-cols-2">
                <PersonalInfoCard
                  fullName={user.fullName || user.email}
                  email={user.email}
                  phone={user.phone}
                />
                <OrganizationInfoCard
                  organizationName={user.organization?.legalName || 'N/A'}
                  taxId={user.organization?.taxId || 'N/A'}
                  type={user.organization?.type}
                  active={user.organization?.active ?? false}
                />
              </div>
            </div>
            <div>
              <ChangeRequestCard
                currentData={{
                  name: user.fullName || '',
                  email: user.email || '',
                  phone: user.phone || '',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
