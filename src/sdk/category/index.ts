import {
  CreateCategoryParams,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetCategoriesParams,
  GetCategoriesResponse,
  GetCategoryResponse,
  UpdateCategoryParams,
  UpdateCategoryResponse,
} from './types'

import { api } from '@/sdk'
import { CATEGORY_ROUTES } from '@/sdk/category/routes'

export const categoryService = {
  async getCategories(
    params?: GetCategoriesParams,
  ): Promise<GetCategoriesResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.get<GetCategoriesResponse>(CATEGORY_ROUTES.GET_CATEGORIES, {
        params,
      })
      return data
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
      throw error
    }
  },

  async getCategoryById(id: string): Promise<GetCategoryResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.get<GetCategoryResponse>(CATEGORY_ROUTES.GET_CATEGORY(id))
      return data
    } catch (error) {
      console.error(`Erro ao buscar categoria ${id}:`, error)
      throw error
    }
  },

  async createCategory(
    params: CreateCategoryParams,
  ): Promise<CreateCategoryResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.post<CreateCategoryResponse>(
        CATEGORY_ROUTES.CREATE_CATEGORY,
        params,
      )
      return data
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      throw error
    }
  },

  async updateCategory(
    id: string,
    params: UpdateCategoryParams,
  ): Promise<UpdateCategoryResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.put<UpdateCategoryResponse>(
        CATEGORY_ROUTES.UPDATE_CATEGORY(id),
        params,
      )
      return data
    } catch (error) {
      console.error(`Erro ao atualizar categoria ${id}:`, error)
      throw error
    }
  },

  async deleteCategory(id: string): Promise<DeleteCategoryResponse['data']> {
    try {
      const {
        data: { data },
      } = await api.delete<DeleteCategoryResponse>(
        CATEGORY_ROUTES.DELETE_CATEGORY(id),
      )
      return data
    } catch (error) {
      console.error(`Erro ao deletar categoria ${id}:`, error)
      throw error
    }
  },
}
