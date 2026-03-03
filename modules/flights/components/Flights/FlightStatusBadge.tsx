import React from 'react'
import { Badge } from '@/shared/components'
import type { FlightStatus } from '../../types'

interface FlightStatusBadgeProps {
  status: FlightStatus
  className?: string
}

const flightStatusConfig: Record<
  FlightStatus,
  { variant: 'success' | 'warning' | 'info' | 'secondary' | 'destructive'; label: string }
> = {
  scheduled: { variant: 'info', label: 'Scheduled' },
  boarding: { variant: 'warning', label: 'Boarding' },
  departed: { variant: 'secondary', label: 'Departed' },
  arrived: { variant: 'success', label: 'Arrived' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  delayed: { variant: 'warning', label: 'Delayed' },
}

export function FlightStatusBadge({ status, className }: FlightStatusBadgeProps): React.ReactElement {
  const config = flightStatusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
