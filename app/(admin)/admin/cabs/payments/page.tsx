'use client'

import React, { useState, useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  DataTable,
  Pagination,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column } from '@/shared/components'
import { formatCurrency, formatDate } from '@/shared/lib'
import { payments, users } from '@/modules/cabs/mockData'
import { PaymentStatusBadge } from '@/modules/cabs/components'
import type { Payment, PaymentStatus } from '@/modules/cabs/types'

type PaymentRow = Payment & { userName: string }

const STATUS_OPTIONS: Array<'all' | PaymentStatus> = [
  'all',
  'pending',
  'success',
  'failed',
  'refunded',
]

export default function CabsPaymentsPage(): React.ReactElement {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [])

  const filteredPayments = useMemo((): PaymentRow[] => {
    let list = payments.map((p) => ({
      ...p,
      userName: userMap.get(p.userId)?.name ?? p.userId,
    }))
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter)
    }
    return list
  }, [statusFilter, userMap])

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const pageData = filteredPayments.slice(startIndex, startIndex + itemsPerPage)

  const columns: Column<PaymentRow>[] = useMemo(
    () => [
      { key: 'bookingId', label: 'Booking ID' },
      { key: 'userName', label: 'Customer' },
      {
        key: 'amount',
        label: 'Amount',
        render: (value) => formatCurrency(Number(value), 'INR'),
      },
      { key: 'method', label: 'Method' },
      {
        key: 'status',
        label: 'Status',
        render: (_, row) => <PaymentStatusBadge status={row.status} />,
      },
      {
        key: 'createdAt',
        label: 'Date',
        render: (value) => formatDate(String(value)),
      },
    ],
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title="Cab Payments"
        description="Payment history and status"
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'all' ? 'All statuses' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <DataTable<PaymentRow>
            columns={columns}
            data={pageData}
            emptyMessage="No payments found"
          />

          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPayments.length}
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
    </PageContainer>
  )
}
