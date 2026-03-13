import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { axiosInstance } from './axios'

export const apiClient = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.get<T>(url, config)
  },
  post<T = unknown, B = unknown>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.post<T>(url, data, config)
  },
  put<T = unknown, B = unknown>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.put<T>(url, data, config)
  },
  patch<T = unknown, B = unknown>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.patch<T>(url, data, config)
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.delete<T>(url, config)
  },
}

