import React from 'react'
import { Badge } from '@/shared/components'
import type { PaymentStatus } from '../../types'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

const paymentStatusConfig: Record<
  PaymentStatus,
  { variant: 'success' | 'warning' | 'destructive'; label: string }
> = {
  paid: { variant: 'success', label: 'Paid' },
  pending: { variant: 'warning', label: 'Pending' },
  failed: { variant: 'destructive', label: 'Failed' },
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
