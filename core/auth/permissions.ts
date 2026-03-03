import type { AuthUser } from './types'

export type Permission =
  | 'view_finance'
  | 'delete_records'
  | 'manage_users'
  | 'view_reports'
  | 'cancel_flight'

const rolePermissions: Record<'admin' | 'manager', Permission[]> = {
  admin: ['view_finance', 'delete_records', 'manage_users', 'view_reports', 'cancel_flight'],
  manager: ['view_reports'],
}

export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false
  
  const permissions = rolePermissions[user.role]
  return permissions.includes(permission)
}

export function canDeleteRecords(user: AuthUser | null): boolean {
  return hasPermission(user, 'delete_records')
}

export function canViewFinance(user: AuthUser | null): boolean {
  return hasPermission(user, 'view_finance')
}

export function canCancelFlight(user: AuthUser | null): boolean {
  return hasPermission(user, 'cancel_flight')
}
