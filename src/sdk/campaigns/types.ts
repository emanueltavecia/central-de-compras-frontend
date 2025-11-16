import { Campaign } from '@/types'
import { SuccessResponse } from '@/types/request'
import { CampaignScope, CampaignType } from '@/utils/enums'

export interface GetCampaignsParams {
  supplierOrgId?: string
  name?: string
  type?: CampaignType
  scope?: CampaignScope
  active?: boolean
  startAtFrom?: string
  endAtTo?: string
}

export type GetCampaignsResponse = SuccessResponse<Campaign[]>

export interface CreateCampaignBody {
  supplierOrgId: string
  name: string
  type: CampaignType
  scope?: CampaignScope
  minTotal?: number | null
  minQuantity?: number | null
  cashbackPercent?: number | null
  giftProductId?: string | null
  categoryId?: string | null
  productIds?: string[] | null
  startAt?: string | null
  endAt?: string | null
}

export type CreateCampaignResponse = SuccessResponse<Campaign>

export interface UpdateCampaignBody extends CreateCampaignBody {}

export type UpdateCampaignResponse = SuccessResponse<Campaign>

export interface UpdateCampaignStatusBody {
  active: boolean
}

export type UpdateCampaignStatusResponse = SuccessResponse<Campaign>
