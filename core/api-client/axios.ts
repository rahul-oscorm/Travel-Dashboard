import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    )

    this.instance.interceptors.response.use(
      (response) => response,
      this.handleResponseError
    )
  }

  private handleRequest = (
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig => {
    const token = this.getToken()
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }

  private handleRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  }

  private handleResponseError = (error: AxiosError): Promise<ApiError> => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
    }

    if (error.response) {
      const data = error.response.data as any

      apiError.message = data?.message || error.message
      apiError.errors = data?.errors

      if (error.response.status === 401) {
        this.handleUnauthorized()
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

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private handleUnauthorized(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }

  public setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
  }

  public removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
  }

  public getAxiosInstance(): AxiosInstance {
    return this.instance
  }
}

export const apiClient = new ApiClient()
export const axiosInstance = apiClient.getAxiosInstance()
