export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  status: UserStatus
}
