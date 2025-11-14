import { User } from "@/types/user"

export interface LoginResponse {
  token: string
  user: User
}
