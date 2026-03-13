import { axiosInstance } from '../api/axios'
export type { ApiError } from '../api/interceptors'

export { axiosInstance }

/**
 * Backwards compatible wrapper so any legacy imports from
 * `@/core/api-client` keep working after introducing `core/api`.
 */
export class ApiClient {
  public getAxiosInstance() {
    return axiosInstance
  }
}

export const apiClient = new ApiClient()

