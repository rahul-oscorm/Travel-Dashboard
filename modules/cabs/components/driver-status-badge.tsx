'use client'

import React from 'react'
import { Badge } from '@/shared/components'
import type { CabDriverStatus } from '../types'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'

const statusConfig: Record<
  CabDriverStatus,
  { label: string; variant: BadgeVariant }
> = {
  active: { label: 'Active', variant: 'success' },
  suspended: { label: 'Suspended', variant: 'destructive' },
}

interface DriverStatusBadgeProps {
  status: CabDriverStatus
  className?: string
}

export function DriverStatusBadge({ status, className }: DriverStatusBadgeProps): React.ReactElement {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
