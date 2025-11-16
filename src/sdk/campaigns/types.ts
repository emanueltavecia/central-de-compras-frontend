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
