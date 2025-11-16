export interface Address {
  id: string
  organizationId: string
  street: string
  number?: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  postalCode: string
  isPrimary?: boolean
  createdAt: string
}
