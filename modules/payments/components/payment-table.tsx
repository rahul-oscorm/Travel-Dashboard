'use client'

import React, { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  DataTable,
  Pagination,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column, Action } from '@/shared/components'
import { formatCurrency, formatDate } from '@/shared/lib'
import type { Payment, PaymentStatus, PaymentModule, PaymentMethod } from '../types'
import { PaymentStatusBadge } from './payment-status-badge'
import { PaymentMethodBadge } from './payment-method-badge'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS: Array<'all' | PaymentStatus> = [
  'all',
  'SUCCESS',
  'PENDING',
  'FAILED',
  'REFUNDED',
]

interface PaymentTableProps {
  payments: Payment[]
  loading?: boolean
  /** When true, show module and method filters */
  showFilters?: boolean
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  loading = false,
  showFilters = true,
}) => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all')
  const [moduleFilter, setModuleFilter] = useState<'all' | PaymentModule>('all')
  const [methodFilter, setMethodFilter] = useState<'all' | PaymentMethod>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const filteredPayments = useMemo((): Payment[] => {
    let list = [...payments]

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.customerName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.bookingId.toLowerCase().includes(q) ||
          p.transactionId.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') list = list.filter((p) => p.status === statusFilter)
    if (moduleFilter !== 'all') list = list.filter((p) => p.module === moduleFilter)
    if (methodFilter !== 'all') list = list.filter((p) => p.paymentMethod === methodFilter)

    list = [...list].sort((a, b) => {
      const aVal = a[sortKey as keyof Payment]
      const bVal = b[sortKey as keyof Payment]
      if (typeof aVal === 'string' && typeof bVal === 'string')
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      return 0
    })

    return list
  }, [payments, search, statusFilter, moduleFilter, methodFilter, sortKey, sortDirection])

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const pageData = filteredPayments.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const columns: Column<Payment>[] = useMemo(
    () => [
      { key: 'id', label: 'Payment ID', sortable: true },
      { key: 'bookingId', label: 'Booking ID', sortable: true },
      { key: 'customerName', label: 'Customer', sortable: true },
      { key: 'module', label: 'Module', sortable: true },
      {
        key: 'amount',
        label: 'Amount',
        sortable: true,
        render: (value, row) => formatCurrency(Number(value), row.currency),
      },
      {
        key: 'paymentMethod',
        label: 'Payment Method',
        render: (_, row) => <PaymentMethodBadge method={row.paymentMethod} />,
      },
      { key: 'transactionId', label: 'Transaction ID' },
      {
        key: 'status',
        label: 'Status',
        render: (_, row) => <PaymentStatusBadge status={row.status} />,
      },
      {
        key: 'createdAt',
        label: 'Created Date',
        sortable: true,
        render: (value) => formatDate(String(value)),
      },
    ],
    []
  )

  const actions = (row: Payment): Action[] => [
    {
      label: 'View',
      onClick: () => router.push(`/admin/payments/${row.id}`),
    },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, payment ID, booking or transaction ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | PaymentStatus)
              setCurrentPage(1)
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'all' ? 'All statuses' : opt.charAt(0) + opt.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {showFilters && (
            <>
              <select
                value={moduleFilter}
                onChange={(e) => {
                  setModuleFilter(e.target.value as 'all' | PaymentModule)
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All modules</option>
                <option value="flight">Flight</option>
                <option value="cab">Cab</option>
                <option value="hotel">Hotel</option>
              </select>
              <select
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter(e.target.value as 'all' | PaymentMethod)
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All methods</option>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Wallet">Wallet</option>
              </select>
            </>
          )}
        </div>

        <DataTable<Payment>
          columns={columns}
          data={pageData}
          loading={loading}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
          actions={actions}
          emptyMessage="No payments found"
        />

        {filteredPayments.length > 0 && (
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
  )
}
