import { Suspense } from 'react'

import { Header, HeaderSkeleton } from '@/components/header'

export default function PrivateRoutesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface min-h-screen">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main>{children}</main>
    </div>
  )
}
