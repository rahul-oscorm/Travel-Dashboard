'use client'

import React, { useState } from 'react'
import {
  DataTable,
  Pagination,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column, Action } from '@/shared/components'
import { formatCurrency, formatDate } from '@/shared/lib'
import type { Payment } from '../types'
import { useRouter } from 'next/navigation'

interface FailedPaymentsTableProps {
  payments: Payment[]
  loading?: boolean
  onRetry?: (payment: Payment) => void
}

export const FailedPaymentsTable: React.FC<FailedPaymentsTableProps> = ({
  payments,
  loading = false,
  onRetry,
}) => {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(payments.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const pageData = payments.slice(startIndex, startIndex + itemsPerPage)

  const columns: Column<Payment>[] = [
    { key: 'id', label: 'Payment ID' },
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'customerName', label: 'Customer' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value, row) => formatCurrency(Number(value), row.currency),
    },
    { key: 'gateway', label: 'Gateway' },
    {
      key: 'errorMessage',
      label: 'Error Message',
      render: (value) => (
        <span className="text-red-600">{value ? String(value) : '—'}</span>
      ),
    },
    {
      key: 'attemptedAt',
      label: 'Attempt Date',
      render: (value) => (value ? formatDate(String(value)) : '—'),
    },
  ]

  const actions = (row: Payment): Action[] => [
    {
      label: 'View',
      onClick: () => router.push(`/admin/payments/${row.id}`),
    },
    ...(onRetry
      ? [
          {
            label: 'Retry',
            onClick: () => onRetry(row),
            variant: 'default' as const,
          },
        ]
      : []),
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <DataTable<Payment>
          columns={columns}
          data={pageData}
          loading={loading}
          actions={actions}
          emptyMessage="No failed payments"
        />

        {payments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={payments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(n) => {
              setItemsPerPage(n)
              setCurrentPage(1)
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
