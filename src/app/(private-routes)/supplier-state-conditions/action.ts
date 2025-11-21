'use server'

import { revalidateTag } from 'next/cache'

import { getSession } from '@/lib/auth/session'
import { supplierStateConditionsService } from '@/sdk/supplier-state-conditions'
import type { ErrorResponse } from '@/types'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import { getErrorMessage } from '@/utils/error-messages'
import {
  supplierStateConditionSchema,
  type SupplierStateConditionFormInput,
} from '@/utils/schemas/supplier-state-condition'

export async function getSupplierStateConditions() {
  try {
    const { user } = await getSession()
    const conditions = await supplierStateConditionsService.getConditions({
      supplierOrgId: user?.organizationId as string,
    })
    return conditions
  } catch (error) {
    console.error('Erro ao buscar condições por estado:', error)
    return []
  }
}

export async function createSupplierStateCondition(
  data: SupplierStateConditionFormInput,
) {
  try {
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        message: 'Usuário não autenticado ou sem organização',
      }
    }

    const validatedData = supplierStateConditionSchema.parse(data)

    await supplierStateConditionsService.createCondition({
      supplierOrgId: user.organizationId,
      state: validatedData.state,
      cashbackPercent: validatedData.cashbackPercent,
      paymentTermDays: validatedData.paymentTermDays,
      unitPriceAdjustment: validatedData.unitPriceAdjustment,
      effectiveFrom: validatedData.effectiveFrom,
      effectiveTo: validatedData.effectiveTo,
    })

    revalidateTag(CACHE_TAGS.SUPPLIER_STATE_CONDITIONS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Condição por estado criada com sucesso',
    }
  } catch (error) {
    console.error('Erro ao criar condição por estado:', error)
    return {
      success: false,
      message:
        getErrorMessage(error as ErrorResponse) ||
        'Erro ao criar condição por estado',
    }
  }
}

export async function updateSupplierStateCondition(
  id: string,
  data: SupplierStateConditionFormInput,
) {
  try {
    const { user } = await getSession()

    const validatedData = supplierStateConditionSchema.parse(data)

    await supplierStateConditionsService.updateCondition(id, {
      supplierOrgId: user?.organizationId as string,
      state: validatedData.state,
      cashbackPercent: validatedData.cashbackPercent,
      paymentTermDays: validatedData.paymentTermDays,
      unitPriceAdjustment: validatedData.unitPriceAdjustment,
      effectiveFrom: validatedData.effectiveFrom,
      effectiveTo: validatedData.effectiveTo,
    })

    revalidateTag(CACHE_TAGS.SUPPLIER_STATE_CONDITIONS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Condição por estado atualizada com sucesso',
    }
  } catch (error) {
    console.error('Erro ao atualizar condição por estado:', error)
    return {
      success: false,
      message:
        getErrorMessage(error as ErrorResponse) ||
        'Erro ao atualizar condição por estado',
    }
  }
}

export async function deleteSupplierStateCondition(id: string) {
  try {
    await supplierStateConditionsService.deleteCondition(id)

    revalidateTag(CACHE_TAGS.SUPPLIER_STATE_CONDITIONS.LIST, { expire: 0 })

    return {
      success: true,
      message: 'Condição por estado deletada com sucesso',
    }
  } catch (error) {
    console.error('Erro ao deletar condição por estado:', error)
    return {
      success: false,
      message: 'Erro ao deletar condição por estado',
    }
  }
}
