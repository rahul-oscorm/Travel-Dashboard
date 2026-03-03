'use client'

import React, { useState, useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  StatCard,
  DashboardSection,
  DataTable,
  Button,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column, Action } from '@/shared/components'
import { Plane, Users, DollarSign, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react'
import { mockFlightStats, mockFlightBookings } from '@/modules/flights/mockData'
import { BookingStatusBadge, PaymentStatusBadge } from '@/modules/flights/components'
import type { FlightBooking, BookingStatus, PaymentStatus } from '@/modules/flights/types'
import { getFlightNumberByFlightId } from '@/modules/flights/utils/lookups'
import { formatCurrency, formatDate } from '@/shared/lib'
import Link from 'next/link'

const RECENT_BOOKINGS_LIMIT = 5

export default function FlightsOverviewPage(): React.ReactElement {
  const [sortKey, setSortKey] = useState<string | undefined>()
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string, direction: 'asc' | 'desc'): void => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const recentBookings = useMemo(
    () => mockFlightBookings.slice(0, RECENT_BOOKINGS_LIMIT),
    []
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
        label: 'Passenger',
        sortable: true,
      },
      {
        key: 'flightId',
        label: 'Flight Number',
        sortable: true,
        render: (value) => getFlightNumberByFlightId(value as string),
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
        key: 'bookingStatus',
        label: 'Booking Status',
        render: (value) => <BookingStatusBadge status={value as BookingStatus} />,
      },
      {
        key: 'paymentStatus',
        label: 'Payment Status',
        render: (value) => <PaymentStatusBadge status={value as PaymentStatus} />,
      },
    ],
    []
  )

  const tableActions = (row: FlightBooking): Action[] => [
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
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Flights Dashboard"
        description="Monitor flight operations, inventory and bookings"
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
          description="In inventory"
        />
        <StatCard
          title="Active Flights"
          value={mockFlightStats.activeFlights}
          icon={Plane}
          trend={{ value: 5, isPositive: true }}
          description="Scheduled / boarding / in-flight"
        />
        <StatCard
          title="Total Bookings"
          value={mockFlightStats.totalBookings.toLocaleString()}
          icon={Users}
          trend={{ value: 8.5, isPositive: true }}
          description="All time"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(mockFlightStats.revenue)}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
          description="Total revenue"
        />
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Occupancy Rate</h3>
              <p className="text-sm text-gray-500">Average seat occupancy across flights</p>
            </div>
            <div className="text-3xl font-bold text-primary-600">
              {mockFlightStats.occupancyRate}%
            </div>
          </div>
        </CardContent>
      </Card>

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
          actions={tableActions}
          emptyMessage="No bookings found"
          emptyIcon={Plane}
        />
      </DashboardSection>
    </PageContainer>
  )
}
