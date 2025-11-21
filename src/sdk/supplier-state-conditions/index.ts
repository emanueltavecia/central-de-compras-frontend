import {
  GetSupplierStateConditionsParams,
  GetSupplierStateConditionsResponse,
  CreateSupplierStateConditionBody,
  CreateSupplierStateConditionResponse,
  UpdateSupplierStateConditionBody,
  UpdateSupplierStateConditionResponse,
  DeleteSupplierStateConditionResponse,
} from './types'

import { api } from '@/sdk'
import { SUPPLIER_STATE_CONDITIONS_ROUTES } from '@/sdk/supplier-state-conditions/routes'

export const supplierStateConditionsService = {
  async getConditions(
    params: GetSupplierStateConditionsParams,
  ): Promise<GetSupplierStateConditionsResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.get<GetSupplierStateConditionsResponse>(
        SUPPLIER_STATE_CONDITIONS_ROUTES.GET_CONDITIONS,
        { params },
      )
      return data
    } catch (error) {
      console.error('Erro ao buscar condições por estado:', error)
      throw error
    }
  },

  async createCondition(
    body: CreateSupplierStateConditionBody,
  ): Promise<CreateSupplierStateConditionResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.post<CreateSupplierStateConditionResponse>(
        SUPPLIER_STATE_CONDITIONS_ROUTES.CREATE_CONDITION,
        body,
      )
      return data
    } catch (error) {
      console.error('Erro ao criar condição por estado:', error)
      throw error
    }
  },

  async updateCondition(
    id: string,
    body: UpdateSupplierStateConditionBody,
  ): Promise<UpdateSupplierStateConditionResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.put<UpdateSupplierStateConditionResponse>(
        SUPPLIER_STATE_CONDITIONS_ROUTES.UPDATE_CONDITION(id),
        body,
      )
      return data
    } catch (error) {
      console.error('Erro ao atualizar condição por estado:', error)
      throw error
    }
  },

  async deleteCondition(id: string): Promise<void> {
    try {
      await api.delete<DeleteSupplierStateConditionResponse>(
        SUPPLIER_STATE_CONDITIONS_ROUTES.DELETE_CONDITION(id),
      )
    } catch (error) {
      console.error('Erro ao deletar condição por estado:', error)
      throw error
    }
  },
}
