import { getSession } from '@/lib/auth'
import { setAuthToken } from '@/sdk/client'

export async function TokenInitializer() {
  const { token } = await getSession()

  if (token) {
    setAuthToken(token)
  }

  return null
}
