export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  CABS: {
    BOOKINGS: '/cabs/bookings',
    BOOKING_DETAIL: (id: string | number) => `/cabs/bookings/${id}`,
    DRIVERS: '/cabs/drivers',
    VEHICLES: '/cabs/vehicles',
    RIDES: '/cabs/rides',
    TRIPS: '/cabs/trips',
    PAYMENTS: '/cabs/payments',
    INVENTORY: '/cabs/inventory',
  },
  FLIGHTS: {
    BOOKINGS: '/flights/bookings',
    BOOKING_DETAIL: (id: string | number) => `/flights/bookings/${id}`,
    INVENTORY: '/flights/inventory',
  },
  HOTELS: {
    BOOKINGS: '/hotels/bookings',
    INVENTORY: '/hotels/inventory',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string | number) => `/users/${id}`,
  },
  REPORTS: {
    SUMMARY: '/reports/summary',
    REVENUE: '/reports/revenue',
    BOOKINGS: '/reports/bookings',
  },
} as const

export type ApiEndpointGroup = keyof typeof API_ENDPOINTS

