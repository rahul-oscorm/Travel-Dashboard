import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { setupInterceptors, type ApiError } from './interceptors'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

setupInterceptors(axiosInstance)

export type { ApiError }

