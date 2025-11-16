import type { Category, CategoryFilters } from '@/types'
import { SuccessResponse } from '@/types/request'

export interface GetCategoriesParams extends CategoryFilters {}

export type GetCategoriesResponse = SuccessResponse<Category[]>
