import { z } from 'zod'

import { VALIDATION_MESSAGES } from '@/utils/constants/validation-messages'
import { CampaignScope, CampaignType } from '@/utils/enums'

export const campaignSchema = z
  .object({
    name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    type: z.enum(CampaignType, {
      message: VALIDATION_MESSAGES.REQUIRED,
    }),
    scope: z.enum(CampaignScope, {
      message: VALIDATION_MESSAGES.REQUIRED,
    }),
    minTotal: z.number().min(0).optional().nullable(),
    minQuantity: z.number().int().min(1).optional().nullable(),
    cashbackPercent: z.number().min(0).max(100).optional().nullable(),
    giftProductId: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    productIds: z.array(z.string()).optional().nullable(),
    startAt: z.string().optional().nullable(),
    endAt: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === CampaignType.CASHBACK) {
        return (
          data.cashbackPercent !== undefined &&
          data.cashbackPercent !== null &&
          data.cashbackPercent > 0
        )
      }
      return true
    },
    {
      message:
        'Porcentagem de cashback é obrigatória para campanhas de cashback',
      path: ['cashbackPercent'],
    },
  )
  .refine(
    (data) => {
      if (data.type === CampaignType.GIFT) {
        return data.giftProductId !== undefined && data.giftProductId !== ''
      }
      return true
    },
    {
      message: 'Produto brinde é obrigatório para campanhas de brinde',
      path: ['giftProductId'],
    },
  )
  .refine(
    (data) => {
      if (data.scope === CampaignScope.CATEGORY) {
        return data.categoryId !== undefined && data.categoryId !== ''
      }
      return true
    },
    {
      message: 'Categoria é obrigatória quando o escopo é categoria',
      path: ['categoryId'],
    },
  )
  .refine(
    (data) => {
      if (data.scope === CampaignScope.PRODUCT) {
        return data.productIds && data.productIds.length > 0
      }
      return true
    },
    {
      message: 'Selecione pelo menos um produto quando o escopo é produto',
      path: ['productIds'],
    },
  )

export type CampaignFormInput = z.infer<typeof campaignSchema>
