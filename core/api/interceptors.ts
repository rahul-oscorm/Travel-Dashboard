import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

const handleUnauthorized = (): void => {
  if (typeof window === 'undefined') return

  localStorage.removeItem('auth_token')
  window.location.href = '/login'
}

const handleRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = getToken()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

const handleRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

const handleResponseError = (error: AxiosError): Promise<ApiError> => {
  const apiError: ApiError = {
    message: 'An unexpected error occurred',
    statusCode: error.response?.status || 500,
  }

  if (error.response) {
    const data = error.response.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined

    apiError.message = data?.message ?? error.message
    apiError.errors = data?.errors

    if (error.response.status === 401) {
      handleUnauthorized()
    }

    if (error.response.status === 403) {
      apiError.message = 'You do not have permission to perform this action'
    }

    if (error.response.status === 404) {
      apiError.message = 'The requested resource was not found'
    }

    if (error.response.status >= 500) {
      apiError.message = 'A server error occurred. Please try again later'
    }
  } else if (error.request) {
    apiError.message = 'No response received from server. Check your connection'
  }

  return Promise.reject(apiError)
}

export const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    handleRequest,
    handleRequestError
  )

  instance.interceptors.response.use(
    (response) => response,
    handleResponseError
  )
}

