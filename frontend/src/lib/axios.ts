import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders, AxiosRequestHeaders } from 'axios'
import { getToken, clearToken } from './auth'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    const h = config.headers as AxiosHeaders | Record<string, unknown> | undefined
    if ((h as AxiosHeaders | undefined)?.set) {
      ;(h as AxiosHeaders).set('Authorization', `Bearer ${token}`)
    } else {
      const merged = { ...(h as Record<string, string>), Authorization: `Bearer ${token}` } as AxiosRequestHeaders
      config.headers = merged
    }
  }
  return config
})

api.interceptors.response.use(
  (r: AxiosResponse) => r,
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      clearToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
