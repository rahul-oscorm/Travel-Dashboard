import React from 'react'
import { Badge } from './ui/badge'
import type { Status } from '@/core/types'

interface StatusBadgeProps {
  status: Status
  className?: string
}

const statusConfig: Record<
  Status,
  { variant: 'success' | 'warning' | 'info' | 'secondary' | 'destructive'; label: string }
> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  completed: { variant: 'info', label: 'Completed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
