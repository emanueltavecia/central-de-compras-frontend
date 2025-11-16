'use server'

import { campaignsService } from '@/sdk/campaigns'

export async function getCampaigns() {
  try {
    const campaigns = await campaignsService.getCampaigns({})
    return campaigns
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error)
    throw error
  }
}
