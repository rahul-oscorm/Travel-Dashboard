import {
  LayoutDashboard,
  Plane,
  Hotel,
  Car,
  Users,
  FileText,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface ModuleNavItem {
  label: string
  route: string
}

export interface ModuleConfig {
  key: string
  name: string
  icon: LucideIcon
  route: string
  enabled: boolean
  badge?: string
  description?: string
  /** Sub-routes for dropdown (e.g. Overview, Rides, Drivers) */
  subRoutes?: ModuleNavItem[]
}

export const modules: ModuleConfig[] = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    route: '/admin/dashboard',
    enabled: true,
    description: 'Overview and analytics',
  },
  {
    key: 'flights',
    name: 'Flights',
    icon: Plane,
    route: '/admin/flights',
    enabled: true,
    description: 'Flight inventory, bookings and management',
    subRoutes: [
      { label: 'Overview', route: '/admin/flights' },
      { label: 'Inventory', route: '/admin/flights/inventory' },
      { label: 'Bookings', route: '/admin/flights/bookings' },
    ],
  },
  {
    key: 'cabs',
    name: 'Cabs',
    icon: Car,
    route: '/admin/cabs',
    enabled: true,
    description: 'Cab bookings, drivers, vehicles, trips and payments',
    subRoutes: [
      { label: 'Overview', route: '/admin/cabs' },
      { label: 'Inventory', route: '/admin/cabs/inventory' },
      { label: 'Add Vehicle', route: '/admin/cabs/add-vehicle' },
      { label: 'Bookings', route: '/admin/cabs/bookings' },
      { label: 'Drivers', route: '/admin/cabs/drivers' },
      { label: 'Vehicles', route: '/admin/cabs/vehicles' },
      { label: 'Trips', route: '/admin/cabs/trips' },
      { label: 'Payments', route: '/admin/cabs/payments' },
    ],
  },
  {
    key: 'hotels',
    name: 'Hotels',
    icon: Hotel,
    route: '/admin/hotels',
    enabled: false,
    description: 'Hotel reservations',
  },
  {
    key: 'users',
    name: 'Users',
    icon: Users,
    route: '/admin/users',
    enabled: false,
    description: 'User management',
  },
  {
    key: 'reports',
    name: 'Reports',
    icon: FileText,
    route: '/admin/reports',
    enabled: false,
    description: 'Analytics and reports',
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: Settings,
    route: '/admin/settings',
    enabled: true,
    description: 'System configuration',
  },
]

export const getEnabledModules = (): ModuleConfig[] => {
  return modules.filter((module) => module.enabled)
}

export const getModuleByKey = (key: string): ModuleConfig | undefined => {
  return modules.find((module) => module.key === key)
}
