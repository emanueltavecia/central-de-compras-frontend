import { GetCampaignsParams, GetCampaignsResponse } from './types'

import { api } from '@/sdk'
import { CAMPAIGNS_ROUTES } from '@/sdk/campaigns/routes'

export const campaignsService = {
  async getCampaigns(
    params: GetCampaignsParams,
  ): Promise<GetCampaignsResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.get<GetCampaignsResponse>(CAMPAIGNS_ROUTES.GET_CAMPAIGNS, {
        params,
      })
      return data
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error)
      throw error
    }
  },
}
