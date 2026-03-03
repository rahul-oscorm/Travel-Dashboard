'use client'

import React from 'react'
import { Badge } from '@/shared/components'
import type { VehicleStatus } from '../types'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'

const statusConfig: Record<
  VehicleStatus,
  { label: string; variant: BadgeVariant }
> = {
  active: { label: 'Active', variant: 'success' },
  maintenance: { label: 'Maintenance', variant: 'warning' },
  inactive: { label: 'Inactive', variant: 'destructive' },
}

interface VehicleStatusBadgeProps {
  status: VehicleStatus
  className?: string
}

export function VehicleStatusBadge({ status, className }: VehicleStatusBadgeProps): React.ReactElement {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
