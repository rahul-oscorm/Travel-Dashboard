import React from 'react'
import { Badge } from '@/shared/components'
import type { PaymentStatus } from '../types'

const STATUS_STYLES: Record<PaymentStatus, { bg: string; text: string }> = {
  SUCCESS: { bg: 'bg-green-100', text: 'text-green-700' },
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-700' },
  REFUNDED: { bg: 'bg-blue-100', text: 'text-blue-700' },
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const styles = STATUS_STYLES[status]
  const label = status.charAt(0) + status.slice(1).toLowerCase()

  return (
    <Badge className={`${styles.bg} ${styles.text} border-none`}>
      {label}
    </Badge>
  )
}
