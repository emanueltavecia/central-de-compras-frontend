export enum ChangeRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface ChangeRequest {
  id: string
  userId: string
  organizationId: string
  requestedChanges: Record<string, any>
  status: ChangeRequestStatus
  reviewedBy?: string
  reviewedAt?: string
  reviewNote?: string
  createdAt: string
  user?: {
    fullName: string
    email: string
  }
  organization?: {
    legalName: string
    type: string
    tradeName?: string
    taxId?: string
    phone?: string
    email?: string
  }
}

export interface CreateChangeRequestInput {
  requestedChanges: Record<string, any>
}

export interface ReviewChangeRequestInput {
  status: ChangeRequestStatus.APPROVED | ChangeRequestStatus.REJECTED
  reviewNote?: string
}

export interface ChangeRequestFilters {
  status?: ChangeRequestStatus
  organizationId?: string
  userId?: string
}
