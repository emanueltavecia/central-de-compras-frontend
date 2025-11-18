'use server'

import { cacheTag, revalidateTag } from 'next/cache'

import { productsService } from '@/sdk/products'
import type { Product } from '@/types'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import type {
  CreateProductInput,
  UpdateProductInput,
} from '@/utils/schemas/products'

export async function getProducts(): Promise<Product[]> {
  'use cache'
  cacheTag(CACHE_TAGS.PRODUCTS.LIST)

  try {
    const products = await productsService.getProducts({})
    return products
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    throw error
  }
}

export async function createProduct(
  data: CreateProductInput,
): Promise<{ success: boolean; error?: string; product?: Product }> {
  try {
    const product = await productsService.createProduct(data)
    revalidateTag(CACHE_TAGS.PRODUCTS.LIST, { expire: 0 })

    return { success: true, product }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return {
      success: false,
      error: 'Erro ao criar produto. Tente novamente.',
    }
  }
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput,
): Promise<{ success: boolean; error?: string; product?: Product }> {
  try {
    const product = await productsService.updateProduct(id, data)
    revalidateTag(CACHE_TAGS.PRODUCTS.LIST, { expire: 0 })

    return { success: true, product }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return {
      success: false,
      error: 'Erro ao atualizar produto. Tente novamente.',
    }
  }
}
