import { GetCategoriesParams, GetCategoriesResponse } from './types'

import { api } from '@/sdk'
import { CATEGORIES_ROUTES } from '@/sdk/categories/routes'

export const categoriesService = {
  async getCategories(
    params: GetCategoriesParams,
  ): Promise<GetCategoriesResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.get<GetCategoriesResponse>(
        CATEGORIES_ROUTES.GET_CATEGORIES,
        {
          params,
        },
      )
      return data
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      throw error
    }
  },
}
