'use client'

import React, { useMemo, useState } from 'react'
import {
  DataTable,
  Pagination,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column } from '@/shared/components'
import { formatCurrency, formatDate } from '@/shared/lib'
import type { Refund } from '../types'
import { RefundStatusBadge } from './refund-status-badge'

interface RefundTableProps {
  refunds: Refund[]
  loading?: boolean
}

export const RefundTable: React.FC<RefundTableProps> = ({ refunds, loading }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const sortedRefunds = useMemo(
    () =>
      [...refunds].sort(
        (a, b) =>
          new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
      ),
    [refunds]
  )

  const totalPages = Math.ceil(sortedRefunds.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const pageData = sortedRefunds.slice(startIndex, startIndex + itemsPerPage)

  const columns: Column<Refund>[] = useMemo(
    () => [
      { key: 'refundId', label: 'Refund ID' },
      { key: 'paymentId', label: 'Payment ID' },
      { key: 'bookingId', label: 'Booking ID' },
      { key: 'customerName', label: 'Customer' },
      {
        key: 'amount',
        label: 'Refund Amount',
        render: (value) => formatCurrency(Number(value), 'INR'),
      },
      {
        key: 'status',
        label: 'Status',
        render: (_, row) => <RefundStatusBadge status={row.status} />,
      },
      {
        key: 'requestedAt',
        label: 'Requested Date',
        render: (value) => formatDate(String(value)),
      },
      {
        key: 'processedAt',
        label: 'Processed Date',
        render: (value) => (value ? formatDate(String(value)) : '—'),
      },
    ],
    []
  )

  return (
    <Card>
      <CardContent className="p-4">
        <DataTable<Refund>
          columns={columns}
          data={pageData}
          loading={loading}
          emptyMessage="No refunds found"
        />

        {sortedRefunds.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedRefunds.length}
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
