'use server'

import { cookies } from 'next/headers'

import { COOKIE_NAMES } from '@/utils/constants/cookie-names'
import type {
  Contact,
  CreateContactInput,
  UpdateContactInput,
  ContactFilters,
} from '@/sdk/contacts/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAMES.AUTH.TOKEN)?.value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Erro na requisição')
  }

  return response.json()
}

export async function getAllContacts(
  filters?: ContactFilters,
): Promise<Contact[]> {
  const params = new URLSearchParams()
  if (filters?.organizationId) {
    params.append('organizationId', filters.organizationId)
  }

  const queryString = params.toString()
  const url = `/contacts${queryString ? `?${queryString}` : ''}`

  const response = await fetchWithAuth(url)
  return response.data
}

export async function getContactById(id: string): Promise<Contact> {
  const response = await fetchWithAuth(`/contacts/${id}`)
  return response.data
}

export async function createContact(
  input: CreateContactInput,
): Promise<Contact> {
  const response = await fetchWithAuth('/contacts', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.data
}

export async function updateContact(
  id: string,
  input: UpdateContactInput,
): Promise<Contact> {
  const response = await fetchWithAuth(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return response.data
}

export async function deleteContact(id: string): Promise<void> {
  await fetchWithAuth(`/contacts/${id}`, {
    method: 'DELETE',
  })
}

export async function setPrimaryContact(id: string): Promise<Contact> {
  const response = await fetchWithAuth(`/contacts/${id}/set-primary`, {
    method: 'PATCH',
  })
  return response.data
}

export async function unsetPrimaryContact(id: string): Promise<Contact> {
  const response = await fetchWithAuth(`/contacts/${id}/unset-primary`, {
    method: 'PATCH',
  })
  return response.data
}
