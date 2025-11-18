'use server'

import { revalidateTag } from 'next/cache'

import { getSession } from '@/lib/auth/session'
import { paymentConditionsService } from '@/sdk/payment-conditions'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import {
  paymentConditionSchema,
  type PaymentConditionFormInput,
} from '@/utils/schemas/payment-condition'

export async function getPaymentConditions() {
  try {
    const paymentConditions =
      await paymentConditionsService.getPaymentConditions({})
    return paymentConditions
  } catch (error) {
    console.error('Erro ao buscar condições de pagamento:', error)
    return []
  }
}

export async function createPaymentCondition(data: PaymentConditionFormInput) {
  try {
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        message: 'Usuário não autenticado ou sem organização',
      }
    }

    const validatedData = paymentConditionSchema.parse(data)

    await paymentConditionsService.createPaymentCondition({
      ...validatedData,
      supplierOrgId: user.organizationId,
    })

    revalidateTag(CACHE_TAGS.PAYMENT_CONDITIONS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Condição de pagamento criada com sucesso',
    }
  } catch (error) {
    console.error('Erro ao criar condição de pagamento:', error)
    return {
      success: false,
      message: 'Erro ao criar condição de pagamento',
    }
  }
}

export async function updatePaymentCondition(
  id: string,
  data: PaymentConditionFormInput,
) {
  try {
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        message: 'Usuário não autenticado ou sem organização',
      }
    }

    const validatedData = paymentConditionSchema.parse(data)

    await paymentConditionsService.updatePaymentCondition(id, {
      ...validatedData,
      supplierOrgId: user.organizationId,
    })

    revalidateTag(CACHE_TAGS.PAYMENT_CONDITIONS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Condição de pagamento atualizada com sucesso',
    }
  } catch (error) {
    console.error('Erro ao atualizar condição de pagamento:', error)
    return {
      success: false,
      message: 'Erro ao atualizar condição de pagamento',
    }
  }
}

export async function deletePaymentCondition(id: string) {
  try {
    await paymentConditionsService.deletePaymentCondition(id)

    revalidateTag(CACHE_TAGS.PAYMENT_CONDITIONS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Condição de pagamento excluída com sucesso',
    }
  } catch (error) {
    console.error('Erro ao excluir condição de pagamento:', error)
    return {
      success: false,
      message: 'Erro ao excluir condição de pagamento',
    }
  }
}

export async function updatePaymentConditionStatus(
  id: string,
  active: boolean,
) {
  try {
    await paymentConditionsService.updatePaymentConditionStatus(id, { active })

    revalidateTag(CACHE_TAGS.PAYMENT_CONDITIONS.LIST, { expire: 0 })

    return {
      success: true,
      message: `Condição de pagamento ${active ? 'ativada' : 'desativada'} com sucesso`,
    }
  } catch (error) {
    console.error('Erro ao atualizar status da condição de pagamento:', error)
    return {
      success: false,
      message: 'Erro ao atualizar status da condição de pagamento',
    }
  }
}
