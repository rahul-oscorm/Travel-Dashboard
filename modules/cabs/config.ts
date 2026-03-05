export const CABS_MODULE_CONFIG = {
  module: {
    key: 'cabs',
    name: 'Cabs',
    description: 'Taxi rides, drivers and vehicles management',
  },
  routes: {
    overview: '/admin/cabs',
    bookings: '/admin/cabs/bookings',
    rides: '/admin/cabs/rides',
    drivers: '/admin/cabs/drivers',
    vehicles: '/admin/cabs/vehicles',
    trips: '/admin/cabs/trips',
    payments: '/admin/cabs/payments',
  },
  features: {
    createEnabled: true,
    editEnabled: true,
    deleteEnabled: true,
    assignDriverEnabled: true,
    trackRideEnabled: true,
  },
} as const
