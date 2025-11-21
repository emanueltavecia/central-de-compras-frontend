'use server'

import { cookies } from 'next/headers'

import type { User } from '@/types/user'
import { COOKIE_NAMES } from '@/utils/constants/cookie-names'

export type SessionUser = User

export async function createSession(token: string, user: SessionUser) {
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAMES.AUTH.TOKEN, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  cookieStore.set(COOKIE_NAMES.AUTH.USER, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function getSession(): Promise<{
  token: string | null
  user: SessionUser | null
}> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAMES.AUTH.TOKEN)?.value || null
  const userData = cookieStore.get(COOKIE_NAMES.AUTH.USER)?.value

  let user: SessionUser | null = null
  if (userData) {
    try {
      user = JSON.parse(userData)
    } catch {
      user = null
    }
  }

  return { token, user }
}

export async function destroySession() {
  const cookieStore = await cookies()

  cookieStore.delete(COOKIE_NAMES.AUTH.TOKEN)
  cookieStore.delete(COOKIE_NAMES.AUTH.USER)
}

export async function isAuthenticated(): Promise<boolean> {
  const { token } = await getSession()
  return !!token
}
