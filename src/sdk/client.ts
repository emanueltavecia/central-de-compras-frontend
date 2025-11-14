import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar o token de autenticação
    // const token = getAuthToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Aqui você pode tratar erros globalmente
    // Por exemplo, redirecionar para login se o token expirar
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      // router.push('/login')
    }

    return Promise.reject(error)
  },
)
