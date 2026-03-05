'use client'

import React, { useState, useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  DataTable,
  Pagination,
  Button,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column, Action } from '@/shared/components'
import { Search, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDate } from '@/shared/lib'
import { bookings, users, drivers } from '@/modules/cabs/mockData'
import { RideStatusBadge } from '@/modules/cabs/components'
import type { Booking, BookingStatus } from '@/modules/cabs/types'

type BookingRow = Booking & { userName: string; driverName: string }

const BOOKING_STATUS_OPTIONS: Array<'all' | BookingStatus> = [
  'all',
  'pending',
  'confirmed',
  'ongoing',
  'completed',
  'cancelled',
]

export default function CabsBookingsPage(): React.ReactElement {
  const router = useRouter()
  const [searchName, setSearchName] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const userMap = useMemo(() => new Map((users ?? []).map((u) => [u.id, u])), [])
  const driverMap = useMemo(() => new Map((drivers ?? []).map((d) => [d.id, d])), [])

  const filteredBookings = useMemo((): BookingRow[] => {
    let list = (bookings ?? []).map((b) => ({
      ...b,
      userName: userMap.get(b.userId)?.name ?? b.userId,
      driverName: driverMap.get(b.driverId)?.name ?? b.driverId,
    }))
    if (searchName.trim()) {
      const q = searchName.toLowerCase().trim()
      list = list.filter((b) => b.userName.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') {
      list = list.filter((b) => b.status === statusFilter)
    }
    list = [...list].sort((a, b) => {
      const aVal = a[sortKey as keyof BookingRow]
      const bVal = b[sortKey as keyof BookingRow]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }
      return 0
    })
    return list
  }, [searchName, statusFilter, sortKey, sortDirection, userMap, driverMap])

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const pageData = filteredBookings.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: string, direction: 'asc' | 'desc'): void => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const columns: Column<BookingRow>[] = useMemo(
    () => [
      { key: 'id', label: 'Booking ID', sortable: true },
      { key: 'userName', label: 'Customer', sortable: true },
      { key: 'driverName', label: 'Driver', sortable: true },
      {
        key: 'estimatedFare',
        label: 'Est. Fare',
        sortable: true,
        render: (value) => formatCurrency(Number(value), 'INR'),
      },
      {
        key: 'pickupTime',
        label: 'Pickup',
        render: (value) => formatDate(String(value)),
      },
      {
        key: 'status',
        label: 'Status',
        render: (_, row) => <RideStatusBadge status={row.status} />,
      },
    ],
    []
  )

  const actions = (row: BookingRow): Action[] => [
    {
      label: 'View',
      icon: Eye,
      onClick: () => router.push(`/admin/cabs/bookings/${row.id}`),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Cab Bookings"
        description="View and manage cab bookings"
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {BOOKING_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'all' ? 'All statuses' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <DataTable<BookingRow>
            columns={columns}
            data={pageData}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            actions={actions}
            emptyMessage="No bookings found"
          />

          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBookings.length}
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
