export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Easy SkyTrip',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
} as const

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
} as const

export const ROUTES = {
  public: {
    home: '/',
    login: '/login',
    register: '/register',
  },
  admin: {
    dashboard: '/admin/dashboard',
  },
} as const
