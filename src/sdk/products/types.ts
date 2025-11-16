import type { Product, ProductFilters } from '@/types'
import { SuccessResponse } from '@/types/request'

export interface GetProductsParams extends ProductFilters {}

export type GetProductsResponse = SuccessResponse<Product[]>
