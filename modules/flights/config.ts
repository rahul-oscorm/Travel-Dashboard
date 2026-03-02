export const FLIGHT_CONFIG = {
  module: {
    key: 'flights',
    name: 'Flights',
    description: 'Flight bookings and management',
  },
  routes: {
    overview: '/admin/flights',
    bookings: '/admin/flights/bookings',
  },
  features: {
    bookingEnabled: true,
    cancellationEnabled: true,
    refundEnabled: true,
  },
} as const
