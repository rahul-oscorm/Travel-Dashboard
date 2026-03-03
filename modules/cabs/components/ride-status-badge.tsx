'use client'

import React from 'react'
import { Badge } from '@/shared/components'
import type { BookingStatus } from '../types'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'

const statusConfig: Record<
  BookingStatus,
  { label: string; variant: BadgeVariant }
> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'info' },
  ongoing: { label: 'Ongoing', variant: 'default' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

interface RideStatusBadgeProps {
  status: BookingStatus
  className?: string
}

export function RideStatusBadge({ status, className }: RideStatusBadgeProps): React.ReactElement {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
