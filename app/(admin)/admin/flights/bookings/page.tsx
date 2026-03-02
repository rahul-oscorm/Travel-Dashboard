'use client'

import React, { useState } from 'react'
import {
  PageContainer,
  PageHeader,
  DataTable,
  Pagination,
  Button,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column } from '@/shared/components'
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react'
import { mockFlightBookings } from '@/modules/flights/mockData'
import { BookingStatusBadge } from '@/modules/flights/components'
import type { FlightBooking } from '@/modules/flights/types'
import { formatCurrency, formatDate } from '@/shared/lib'

export default function FlightBookingsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<string>('bookingDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const columns: Column<FlightBooking>[] = [
    {
      key: 'bookingReference',
      label: 'Booking Reference',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-primary-600">{value}</span>
      ),
    },
    {
      key: 'flightNumber',
      label: 'Flight',
      sortable: true,
    },
    {
      key: 'passengerName',
      label: 'Passenger',
      sortable: true,
    },
    {
      key: 'passengerEmail',
      label: 'Email',
      render: (value) => (
        <span className="text-gray-600">{value}</span>
      ),
    },
    {
      key: 'seatNumber',
      label: 'Seat',
    },
    {
      key: 'travelDate',
      label: 'Travel Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <BookingStatusBadge status={value} />,
    },
  ]

  const totalPages = Math.ceil(mockFlightBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBookings = mockFlightBookings.slice(startIndex, endIndex)

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
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          <DataTable<FlightBooking>
            columns={columns}
            data={currentBookings}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            actions={(row) => [
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
              {
                label: 'Cancel Booking',
                icon: Trash2,
                variant: 'destructive',
                onClick: () => console.log('Cancel', row.id),
              },
            ]}
            emptyMessage="No bookings found"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={mockFlightBookings.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
