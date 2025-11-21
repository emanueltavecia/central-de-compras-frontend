export interface Contact {
  id: string
  organizationId: string
  name: string
  email?: string
  phone?: string
  role?: string
  isPrimary?: boolean
  createdAt: string
}

export interface CreateContactInput {
  organizationId: string
  name: string
  email?: string
  phone?: string
  role?: string
  isPrimary?: boolean
}

export interface UpdateContactInput {
  name?: string
  email?: string
  phone?: string
  role?: string
  isPrimary?: boolean
}

export interface ContactFilters {
  organizationId?: string
}
