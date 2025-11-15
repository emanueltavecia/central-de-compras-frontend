import { SuccessResponse } from '@/types/request'
import { User } from '@/types/user'

export type LoginResponse = SuccessResponse<{
  token: string
  user: User
}>
