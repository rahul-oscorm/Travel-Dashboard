'use client'

import React from 'react'
import { Badge } from '@/shared/components'
import type { PaymentStatusNew } from '../types'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'

const statusConfig: Record<
  PaymentStatusNew,
  { label: string; variant: BadgeVariant }
> = {
  pending: { label: 'Pending', variant: 'warning' },
  success: { label: 'Success', variant: 'success' },
  failed: { label: 'Failed', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'info' },
}

interface PaymentStatusBadgeProps {
  status: PaymentStatusNew
  className?: string
}

const defaultConfig: { label: string; variant: BadgeVariant } = { label: 'Unknown', variant: 'secondary' }

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps): React.ReactElement {
  const config = statusConfig[status] ?? defaultConfig
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
