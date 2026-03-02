import React from 'react'
import { Badge } from '@/shared/components'
import type { RideStatus } from '../../types'

interface CabStatusBadgeProps {
  status: RideStatus
  className?: string
}

const rideStatusConfig: Record<
  RideStatus,
  { variant: 'success' | 'warning' | 'info' | 'destructive' | 'default'; label: string }
> = {
  pending: { variant: 'warning', label: 'Pending' },
  accepted: { variant: 'info', label: 'Accepted' },
  on_the_way: { variant: 'info', label: 'On The Way' },
  ongoing: { variant: 'default', label: 'Ongoing' },
  completed: { variant: 'success', label: 'Completed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
}

export function CabStatusBadge({ status, className }: CabStatusBadgeProps) {
  const config = rideStatusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
