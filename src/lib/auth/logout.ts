'use server'

import { redirect } from 'next/navigation'

import { destroySession } from './session'

import { clearAuthToken } from '@/sdk/client'

export async function logout() {
  await destroySession()
  clearAuthToken()
  redirect('/login')
}
