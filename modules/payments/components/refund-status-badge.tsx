import React from 'react'
import { Badge } from '@/shared/components'
import type { RefundStatus } from '../types'

const STATUS_STYLES: Record<RefundStatus, { bg: string; text: string }> = {
  REQUESTED: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-700' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-700' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700' },
}

interface RefundStatusBadgeProps {
  status: RefundStatus
}

export const RefundStatusBadge: React.FC<RefundStatusBadgeProps> = ({ status }) => {
  const styles = STATUS_STYLES[status]
  const label = status.charAt(0) + status.slice(1).toLowerCase()

  return (
    <Badge className={`${styles.bg} ${styles.text} border-none`}>
      {label}
    </Badge>
  )
}
