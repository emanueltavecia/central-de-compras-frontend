import { Category } from '@/types'
import { SuccessResponse } from '@/types/request'

export interface GetCategoriesParams {
  parentId?: string
  search?: string
  supplierOrgId?: string
}
export interface CreateCategoryParams {
  name: string
  parentId?: string
  description?: string
}
export interface UpdateCategoryParams {
  name?: string
  parentId?: string
  description?: string
}
export type GetCategoriesResponse = SuccessResponse<Category[]>
export type GetCategoryResponse = SuccessResponse<Category>
export type CreateCategoryResponse = SuccessResponse<Category>
export type UpdateCategoryResponse = SuccessResponse<Category>
export type DeleteCategoryResponse = SuccessResponse<null>
