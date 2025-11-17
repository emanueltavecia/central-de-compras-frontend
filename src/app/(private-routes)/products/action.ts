'use server'

import { revalidateTag } from 'next/cache'

import { getSession } from '@/lib/auth/session'
import { categoriesService } from '@/sdk/categories'
import { productsService } from '@/sdk/products'
import type { Category, Product } from '@/types'
import { CACHE_TAGS } from '@/utils/constants/cache-tags'
import type {
  CreateProductFormInput,
  UpdateProductInput,
} from '@/utils/schemas/products'

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await categoriesService.getCategories({})
    return categories
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await productsService.getProducts({})
    return products
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    throw error
  }
}

export async function createProduct(
  data: CreateProductFormInput,
): Promise<{ success: boolean; error?: string; product?: Product }> {
  try {
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        error: 'Usuário não está vinculado a uma organização.',
      }
    }

    const product = await productsService.createProduct({
      ...data,
      supplierOrgId: user.organizationId,
    })
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
    const { user } = await getSession()

    if (!user?.organizationId) {
      return {
        success: false,
        error: 'Usuário não está vinculado a uma organização.',
      }
    }

    const product = await productsService.updateProduct(id, {
      ...data,
      supplierOrgId: user.organizationId,
    })
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
