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
    description: 'Flight bookings and management',
  },
  {
    key: 'cabs',
    name: 'Cabs',
    icon: Car,
    route: '/admin/cabs',
    enabled: true,
    description: 'Taxi rides, drivers and vehicles management',
    subRoutes: [
      { label: 'Overview', route: '/admin/cabs' },
      { label: 'Rides', route: '/admin/cabs/rides' },
      { label: 'Drivers', route: '/admin/cabs/drivers' },
      { label: 'Vehicles', route: '/admin/cabs/vehicles' },
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
