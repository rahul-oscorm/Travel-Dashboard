'use client'

import React, { useState } from 'react'
import {
  PageContainer,
  PageHeader,
  StatCard,
  DashboardSection,
  DataTable,
  Button,
} from '@/shared/components'
import type { Column, Action } from '@/shared/components'
import { Plane, Users, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react'
import { mockFlightStats, mockFlightBookings } from '@/modules/flights/mockData'
import { BookingStatusBadge } from '@/modules/flights/components'
import type { FlightBooking, BookingStatus } from '@/modules/flights/types'
import { formatCurrency, formatDate } from '@/shared/lib'
import Link from 'next/link'

export default function FlightsOverviewPage() {
  const [sortKey, setSortKey] = useState<string>()
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const columns: Column<FlightBooking>[] = [
    {
      key: 'bookingReference',
      label: 'Booking Ref',
      sortable: true,
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
      key: 'travelDate',
      label: 'Travel Date',
      sortable: true,
      render: (value) => formatDate(value as string),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => formatCurrency(Number(value)),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <BookingStatusBadge status={value as BookingStatus} />,
    },
  ]

  const recentBookings = mockFlightBookings.slice(0, 5)

  return (
    <PageContainer>
      <PageHeader
        title="Flights Overview"
        description="Monitor flight operations and bookings"
        actions={
          <Link href="/admin/flights/bookings">
            <Button>View All Bookings</Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Flights"
          value={mockFlightStats.totalFlights}
          icon={Plane}
          trend={{ value: 12, isPositive: true }}
          description="Active flights this month"
        />
        <StatCard
          title="Active Bookings"
          value={mockFlightStats.activeBookings.toLocaleString()}
          icon={Users}
          trend={{ value: 8.5, isPositive: true }}
          description="Confirmed bookings"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(mockFlightStats.revenue)}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
          description="Total revenue this month"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${mockFlightStats.occupancyRate}%`}
          icon={TrendingUp}
          trend={{ value: 3.2, isPositive: true }}
          description="Average seat occupancy"
        />
      </div>

      <DashboardSection
        title="Recent Bookings"
        description="Latest flight bookings"
        action={
          <Link href="/admin/flights/bookings">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        }
      >
        <DataTable<FlightBooking>
          columns={columns}
          data={recentBookings}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          actions={(row): Action[] => [
            {
              label: 'View Details',
              icon: Eye,
              onClick: () => console.log('View', row.id),
            },
            {
              label: 'Edit',
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
          emptyIcon={Plane}
        />
      </DashboardSection>
    </PageContainer>
  )
}
