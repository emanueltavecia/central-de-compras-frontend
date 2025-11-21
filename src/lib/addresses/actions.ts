'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { COOKIE_NAMES } from '@/utils/constants/cookie-names'

export interface Address {
  id: string
  organizationId: string
  street: string
  number?: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  postalCode?: string
  createdAt: string
}

export interface CreateAddressInput {
  street: string
  number?: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAMES.AUTH.TOKEN)?.value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    cache: 'no-store',
  })

  let body: any = null
  try {
    body = await res.json()
  } catch {
    body = null
  }

  if (!res.ok) {
    throw new Error(body?.message || `Erro na requisição (${res.status})`)
  }

  return body
}

export async function getOrganizationAddresses(
  organizationId: string,
): Promise<Address[]> {
  const response = await fetchWithAuth(
    `/organizations/${organizationId}/addresses`,
  )
  return response.data
}

export async function createAddress(
  organizationId: string,
  data: CreateAddressInput,
): Promise<Address> {
  const response = await fetchWithAuth(
    `/organizations/${organizationId}/addresses`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
  return response.data
}

export async function updateAddress(
  organizationId: string,
  addressId: string,
  data: Partial<CreateAddressInput>,
): Promise<Address> {
  const response = await fetchWithAuth(
    `/organizations/${organizationId}/addresses/${addressId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  )
  return response.data
}

export async function deleteAddress(
  organizationId: string,
  addressId: string,
): Promise<void> {
  await fetchWithAuth(`/organizations/${organizationId}/addresses/${addressId}`, {
    method: 'DELETE',
  })
}
