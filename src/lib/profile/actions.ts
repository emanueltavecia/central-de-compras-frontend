'use server'

import { cookies } from 'next/headers'

import { COOKIE_NAMES } from '@/utils/constants/cookie-names'
import type { SessionUser } from '@/lib/auth'

export async function updateUserProfileImage(profileImageUrl: string) {
  const cookieStore = await cookies()
  const userData = cookieStore.get(COOKIE_NAMES.AUTH.USER)?.value

  if (!userData) return

  try {
    const user: SessionUser = JSON.parse(userData)
    user.profileImageUrl = profileImageUrl
    user.profileImage = profileImageUrl

    cookieStore.set(COOKIE_NAMES.AUTH.USER, JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  } catch (error) {
    console.error('Failed to update user session:', error)
  }
}
