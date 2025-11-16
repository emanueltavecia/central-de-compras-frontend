import { AxiosError } from 'axios'

import {
  GetCampaignsParams,
  GetCampaignsResponse,
  CreateCampaignBody,
  CreateCampaignResponse,
  UpdateCampaignBody,
  UpdateCampaignResponse,
  UpdateCampaignStatusBody,
  UpdateCampaignStatusResponse,
} from './types'

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

  async createCampaign(
    body: CreateCampaignBody,
  ): Promise<CreateCampaignResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.post<CreateCampaignResponse>(
        CAMPAIGNS_ROUTES.CREATE_CAMPAIGN,
        body,
      )
      return data
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
      console.log('response', (error as AxiosError).response?.data)
      throw error
    }
  },

  async updateCampaign(
    id: string,
    body: UpdateCampaignBody,
  ): Promise<UpdateCampaignResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.patch<UpdateCampaignResponse>(
        CAMPAIGNS_ROUTES.UPDATE_CAMPAIGN(id),
        body,
      )
      return data
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error)
      throw error
    }
  },

  async updateCampaignStatus(
    id: string,
    body: UpdateCampaignStatusBody,
  ): Promise<UpdateCampaignStatusResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.patch<UpdateCampaignStatusResponse>(
        CAMPAIGNS_ROUTES.UPDATE_CAMPAIGN_STATUS(id),
        body,
      )
      return data
    } catch (error) {
      console.error('Erro ao atualizar status da campanha:', error)
      throw error
    }
  },

  async deleteCampaign(id: string): Promise<void> {
    try {
      await api.delete(CAMPAIGNS_ROUTES.DELETE_CAMPAIGN(id))
    } catch (error) {
      console.error('Erro ao excluir campanha:', error)
      throw error
    }
  },
}
