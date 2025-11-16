import { CampaignScope, CampaignType } from '@/utils/enums'

export interface Campaign {
  id: string
  supplierOrgId: string
  name: string
  type: CampaignType
  scope?: CampaignScope
  minTotal?: number
  minQuantity?: number
  cashbackPercent?: number
  giftProductId?: string
  categoryId?: string
  productIds?: string[]
  startAt?: string
  endAt?: string
  active?: boolean
  createdAt: string
}

export interface CampaignStatus {
  active: boolean
}
