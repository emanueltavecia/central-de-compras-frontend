import { PRODUCTS_ROUTES } from './routes'

import { api } from '../client'

import type { Product, ProductFilters } from '@/types'
import type {
  CreateProductInput,
  UpdateProductInput,
} from '@/utils/schemas/products'

export const productsService = {
  async getProducts(params?: ProductFilters): Promise<Product[]> {
    const { data } = await api.get(PRODUCTS_ROUTES.BASE, {
      params,
    })
    return data.data
  },

  async getProductById(id: string): Promise<Product> {
    const { data } = await api.get(PRODUCTS_ROUTES.BY_ID(id))
    return data.data
  },

  async createProduct(params: CreateProductInput): Promise<Product> {
    const { data } = await api.post(PRODUCTS_ROUTES.BASE, params)
    return data.data
  },

  async updateProduct(
    id: string,
    params: UpdateProductInput,
  ): Promise<Product> {
    const { data } = await api.put(PRODUCTS_ROUTES.BY_ID(id), params)
    return data.data
  },
}
