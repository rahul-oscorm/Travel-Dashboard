export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}
