'use server'

import { categoriesService } from '@/sdk/categories'
import { productsService } from '@/sdk/products'
import { getSession } from '@/lib/auth/session'

export async function getCategories() {
  try {
    const categories = await categoriesService.getCategories({})
    return categories
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

export async function getProducts() {
  try {
    const { user } = await getSession()

    if (!user?.organizationId) {
      return []
    }

    const products = await productsService.getProducts({
      supplierOrgId: user.organizationId,
      status: true,
    })

    return products
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}
