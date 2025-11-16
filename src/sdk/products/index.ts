import { GetProductsParams, GetProductsResponse } from './types'

import { api } from '@/sdk'
import { PRODUCTS_ROUTES } from '@/sdk/products/routes'

export const productsService = {
  async getProducts(
    params: GetProductsParams,
  ): Promise<GetProductsResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.get<GetProductsResponse>(PRODUCTS_ROUTES.GET_PRODUCTS, {
        params,
      })
      return data
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      throw error
    }
  },
}
