export enum UserAccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface User {
  id: string
  email: string
  fullName?: string
  phone?: string
  roleId: string
  organizationId: string
  status: UserAccountStatus
  createdBy?: string
  createdAt: string
}

export interface UserFilters {
  status?: string
  roleId?: string
  organizationId?: string
}

export interface CreateUserInput {
  email: string
  password: string
  fullName?: string
  phone?: string
  organizationId: string
}

export interface UpdateUserInput {
  email?: string
  fullName?: string
  phone?: string
  password?: string
}

export interface UpdateUserStatusInput {
  status: UserAccountStatus
}
