import type {
  PaymentCondition,
  PaymentConditionFilters,
  UpdatePaymentConditionStatus,
} from '@/types'
import type { SuccessResponse } from '@/types/request'
import { paymentConditionSchema } from '@/utils/schemas/payment-condition'

import { PAYMENT_CONDITIONS_ROUTES } from './routes'
import { api } from '../client'

import type { PaymentConditionFormInput } from '@/utils/schemas/payment-condition'
import { AxiosError } from 'axios'

export const paymentConditionsService = {
  async getPaymentConditions(
    filters?: PaymentConditionFilters,
  ): Promise<PaymentCondition[]> {
    try {
      const {
        data: { data },
      } = await api.get<SuccessResponse<PaymentCondition[]>>(
        PAYMENT_CONDITIONS_ROUTES.GET_PAYMENT_CONDITIONS,
        { params: filters },
      )
      return data
    } catch (error) {
      console.error('Erro ao buscar condições de pagamento:', error)
      
      throw error
    }
  },

  async createPaymentCondition(
    data: PaymentConditionFormInput & { supplierOrgId: string },
  ): Promise<PaymentCondition> {
    try {
      const validatedData = paymentConditionSchema.parse(data)
      const {
        data: { data: responseData },
      } = await api.post<SuccessResponse<PaymentCondition>>(
        PAYMENT_CONDITIONS_ROUTES.CREATE_PAYMENT_CONDITION,
        {
          ...validatedData,
          supplierOrgId: data.supplierOrgId,
        },
      )
      return responseData
    } catch (error) {
      console.error('Erro ao criar condição de pagamento:', error)
      throw error
    }
  },

  async updatePaymentCondition(
    id: string,
    data: PaymentConditionFormInput & { supplierOrgId: string },
  ): Promise<PaymentCondition> {
    try {
      const validatedData = paymentConditionSchema.parse(data)
      const {
        data: { data: responseData },
      } = await api.put<SuccessResponse<PaymentCondition>>(
        PAYMENT_CONDITIONS_ROUTES.UPDATE_PAYMENT_CONDITION(id),
        {
          ...validatedData,
          supplierOrgId: data.supplierOrgId,
        },
      )
      return responseData
    } catch (error) {
      console.error('Erro ao atualizar condição de pagamento:', error)
      throw error
    }
  },

  async deletePaymentCondition(id: string): Promise<void> {
    try {
      await api.delete(PAYMENT_CONDITIONS_ROUTES.DELETE_PAYMENT_CONDITION(id))
    } catch (error) {
      console.error('Erro ao deletar condição de pagamento:', error)
      throw error
    }
  },

  async updatePaymentConditionStatus(
    id: string,
    body: UpdatePaymentConditionStatus,
  ): Promise<PaymentCondition> {
    try {
      const cleanBody = { active: body.active }
      const {
        data: { data },
      } = await api.patch<SuccessResponse<PaymentCondition>>(
        PAYMENT_CONDITIONS_ROUTES.UPDATE_PAYMENT_CONDITION_STATUS(id),
        cleanBody,
      )
      return data
    } catch (error) {
      console.error('Erro ao atualizar status da condição de pagamento:', error)
      if (error instanceof AxiosError) {
      console.log(
        'Detalhes do erro Axios:',
        error.response?.data.error.validationErrors,
      )
    }
      throw error
    }
  },
}
