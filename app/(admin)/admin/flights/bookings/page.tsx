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
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react'
import { mockFlightBookings } from '@/modules/flights/mockData'
import { BookingStatusBadge, PaymentStatusBadge } from '@/modules/flights/components'
import type {
  FlightBooking,
  BookingStatus,
  PaymentStatus,
} from '@/modules/flights/types'
import { getFlightNumberByFlightId } from '@/modules/flights/utils/lookups'
import { formatCurrency, formatDate } from '@/shared/lib'
import { useAuth, canDeleteRecords } from '@/core/auth'

export default function FlightBookingsPage(): React.ReactElement {
  const user = useAuth((state) => state.user)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<string>('bookingDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const [searchBookingRef, setSearchBookingRef] = useState('')
  const [selectedBookingStatus, setSelectedBookingStatus] = useState<string>('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all')
  const [dateRangeStart, setDateRangeStart] = useState('')
  const [dateRangeEnd, setDateRangeEnd] = useState('')

  const handleSort = (key: string, direction: 'asc' | 'desc'): void => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const bookingStatusOptions: Array<'all' | BookingStatus> = useMemo(
    () => ['all', 'confirmed', 'pending', 'cancelled', 'completed'],
    []
  )

  const paymentStatusOptions: Array<'all' | PaymentStatus> = useMemo(
    () => ['all', 'paid', 'pending', 'failed'],
    []
  )

  const filteredBookings = useMemo(() => {
    let result = [...mockFlightBookings]

    if (searchBookingRef.trim()) {
      const q = searchBookingRef.toLowerCase().trim()
      result = result.filter((b) =>
        b.bookingReference.toLowerCase().includes(q)
      )
    }

    if (selectedBookingStatus !== 'all') {
      result = result.filter((b) => b.bookingStatus === selectedBookingStatus)
    }

    if (selectedPaymentStatus !== 'all') {
      result = result.filter((b) => b.paymentStatus === selectedPaymentStatus)
    }

    if (dateRangeStart) {
      result = result.filter((b) => b.travelDate.slice(0, 10) >= dateRangeStart)
    }

    if (dateRangeEnd) {
      result = result.filter((b) => b.travelDate.slice(0, 10) <= dateRangeEnd)
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey as keyof FlightBooking]
        const bVal = b[sortKey as keyof FlightBooking]
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
    }

    return result
  }, [
    searchBookingRef,
    selectedBookingStatus,
    selectedPaymentStatus,
    dateRangeStart,
    dateRangeEnd,
    sortKey,
    sortDirection,
  ])

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns: Column<FlightBooking>[] = useMemo(
    () => [
      {
        key: 'bookingReference',
        label: 'Booking Ref',
        sortable: true,
        render: (value) => (
          <span className="font-medium text-primary-600">{String(value)}</span>
        ),
      },
      {
        key: 'passengerName',
        label: 'Passenger Name',
        sortable: true,
      },
      {
        key: 'passengerEmail',
        label: 'Email',
        render: (value) => (
          <span className="text-gray-600">{String(value)}</span>
        ),
      },
      {
        key: 'flightId',
        label: 'Flight',
        sortable: true,
        render: (value) => getFlightNumberByFlightId(value as string),
      },
      {
        key: 'seatNumber',
        label: 'Seat',
      },
      {
        key: 'travelDate',
        label: 'Travel Date',
        sortable: true,
        render: (value) => formatDate(value as string),
      },
      {
        key: 'price',
        label: 'Price',
        sortable: true,
        render: (value) => (
          <span className="font-semibold">
            {formatCurrency(Number(value))}
          </span>
        ),
      },
      {
        key: 'bookingStatus',
        label: 'Booking Status',
        render: (value) => (
          <BookingStatusBadge status={value as BookingStatus} />
        ),
      },
      {
        key: 'paymentStatus',
        label: 'Payment Status',
        render: (value) => (
          <PaymentStatusBadge status={value as PaymentStatus} />
        ),
      },
    ],
    []
  )

  const getTableActions = (row: FlightBooking): Action[] => {
    const actions: Action[] = [
      {
        label: 'View Details',
        icon: Eye,
        onClick: () => console.log('View', row.id),
      },
      {
        label: 'Edit Booking',
        icon: Edit,
        onClick: () => console.log('Edit', row.id),
      },
    ]
    if (canDeleteRecords(user)) {
      actions.push({
        label: 'Cancel Booking',
        icon: Trash2,
        variant: 'destructive',
        onClick: () => console.log('Cancel', row.id),
      })
    }
    return actions
  }

  const hasActiveFilters =
    searchBookingRef.trim() !== '' ||
    selectedBookingStatus !== 'all' ||
    selectedPaymentStatus !== 'all' ||
    dateRangeStart !== '' ||
    dateRangeEnd !== ''

  const handleResetFilters = (): void => {
    setSearchBookingRef('')
    setSelectedBookingStatus('all')
    setSelectedPaymentStatus('all')
    setDateRangeStart('')
    setDateRangeEnd('')
    setCurrentPage(1)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Flight Bookings"
        description="Manage all flight bookings"
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search booking reference..."
                  value={searchBookingRef}
                  onChange={(e) => {
                    setSearchBookingRef(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedBookingStatus}
                  onChange={(e) => {
                    setSelectedBookingStatus(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="all">All Booking Statuses</option>
                  {bookingStatusOptions
                    .filter((s) => s !== 'all')
                    .map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                </select>
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => {
                    setSelectedPaymentStatus(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="all">All Payment Statuses</option>
                  {paymentStatusOptions
                    .filter((s) => s !== 'all')
                    .map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                </select>
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => {
                    setDateRangeStart(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="From"
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => {
                    setDateRangeEnd(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="To"
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    disabled={!hasActiveFilters}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          <DataTable<FlightBooking>
            columns={columns}
            data={currentBookings}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            actions={getTableActions}
            emptyMessage="No bookings found matching your filters"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBookings.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value)
              setCurrentPage(1)
            }}
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}