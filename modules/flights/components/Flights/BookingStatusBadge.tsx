import React from 'react'
import { Badge } from '@/shared/components'
import type { BookingStatus } from '../../types'

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

const bookingStatusConfig: Record<
  BookingStatus,
  { variant: 'success' | 'warning' | 'info' | 'secondary' | 'destructive'; label: string }
> = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  pending: { variant: 'warning', label: 'Pending' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  completed: { variant: 'info', label: 'Completed' },
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps): React.ReactElement {
  const config = bookingStatusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
