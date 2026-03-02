export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager'
}

export interface HardcodedUser extends AuthUser {
  password: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
