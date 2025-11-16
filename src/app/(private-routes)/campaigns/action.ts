'use server'

import { revalidateTag } from 'next/cache'
import { campaignsService } from '@/sdk/campaigns'
import {
  campaignSchema,
  type CampaignFormInput,
} from '@/utils/schemas/campaign'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import { getSession } from '@/lib/auth/session'

export async function getCampaigns() {
  try {
    const campaigns = await campaignsService.getCampaigns({})
    return campaigns
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error)
    return []
  }
}

export async function createCampaign(data: CampaignFormInput) {
  try {
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        message: 'Usuário não autenticado ou sem organização',
      }
    }

    const validatedData = campaignSchema.parse(data)

    await campaignsService.createCampaign({
      ...validatedData,
      supplierOrgId: user.organizationId,
    })

    revalidateTag(CACHE_TAGS.CAMPAIGNS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Campanha criada com sucesso',
    }
  } catch (error) {
    console.error('Erro ao criar campanha:', error)
    return {
      success: false,
      message: 'Erro ao criar campanha',
    }
  }
}

export async function updateCampaign(id: string, data: CampaignFormInput) {
  try {
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        message: 'Usuário não autenticado ou sem organização',
      }
    }

    const validatedData = campaignSchema.parse(data)

    await campaignsService.updateCampaign(id, {
      ...validatedData,
      supplierOrgId: user.organizationId,
    })

    revalidateTag(CACHE_TAGS.CAMPAIGNS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Campanha atualizada com sucesso',
    }
  } catch (error) {
    console.error('Erro ao atualizar campanha:', error)
    return {
      success: false,
      message: 'Erro ao atualizar campanha',
    }
  }
}

export async function toggleCampaignStatus(id: string, active: boolean) {
  try {
    await campaignsService.updateCampaignStatus(id, { active })

    revalidateTag(CACHE_TAGS.CAMPAIGNS.LIST, { expire: 0 })

    return {
      success: true,
      message: `Campanha ${active ? 'ativada' : 'desativada'} com sucesso`,
    }
  } catch (error) {
    console.error('Erro ao atualizar status da campanha:', error)
    return {
      success: false,
      message: 'Erro ao atualizar status da campanha',
    }
  }
}

export async function deleteCampaign(id: string) {
  try {
    await campaignsService.deleteCampaign(id)

    revalidateTag(CACHE_TAGS.CAMPAIGNS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Campanha excluída com sucesso',
    }
  } catch (error) {
    console.error('Erro ao excluir campanha:', error)
    return {
      success: false,
      message: 'Erro ao excluir campanha',
    }
  }
}
