'use client'

import React, { useState } from 'react'
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
import type { Column } from '@/shared/components'
import { Car, Users, CheckCircle, DollarSign, Eye, Edit, XCircle } from 'lucide-react'
import { mockCabStats, mockRides } from '@/modules/cabs/mockData'
import { CabStatusBadge, PaymentStatusBadgeLegacy } from '@/modules/cabs/components'
import type { CabRide, RideStatus, PaymentStatus } from '@/modules/cabs/types'
import { formatCurrency } from '@/shared/lib'
import Link from 'next/link'

export default function CabsOverviewPage() {
  const [sortKey, setSortKey] = useState<string>()
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const columns: Column<CabRide>[] = [
    {
      key: 'rideId',
      label: 'Ride ID',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-primary-600">{String(value)}</span>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
    },
    {
      key: 'vehicleType',
      label: 'Vehicle',
      render: (value) => (
        <span className="capitalize">{String(value)}</span>
      ),
    },
    {
      key: 'fare',
      label: 'Fare',
      sortable: true,
      render: (value) => (
        <span className="font-semibold">{formatCurrency(Number(value), 'INR')}</span>
      ),
    },
    {
      key: 'rideStatus',
      label: 'Ride Status',
      render: (value) => <CabStatusBadge status={value as RideStatus} />,
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value) => <PaymentStatusBadgeLegacy status={value as PaymentStatus} />,
    },
  ]

  const recentRides = mockRides.slice(0, 5)

  const getTableActions = (row: CabRide) => [
    { label: 'View Details', icon: Eye, onClick: () => console.log('View', row.id) },
    { label: 'Edit', icon: Edit, onClick: () => console.log('Edit', row.id) },
    { label: 'Cancel Ride', icon: XCircle, variant: 'destructive' as const, onClick: () => console.log('Cancel', row.id) },
  ]

  const statusBreakdown: { status: RideStatus; count: number; label: string }[] = [
    { status: 'completed', count: mockRides.filter(r => r.rideStatus === 'completed').length, label: 'Completed' },
    { status: 'ongoing', count: mockRides.filter(r => r.rideStatus === 'ongoing').length, label: 'Ongoing' },
    { status: 'on_the_way', count: mockRides.filter(r => r.rideStatus === 'on_the_way').length, label: 'On The Way' },
    { status: 'pending', count: mockRides.filter(r => r.rideStatus === 'pending').length, label: 'Pending' },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Cabs Dashboard"
        description="Monitor taxi rides, drivers and revenue"
        actions={
          <Link href="/admin/cabs/rides">
            <Button>View All Rides</Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rides"
          value={mockCabStats.totalRides.toLocaleString()}
          icon={Car}
          trend={{ value: 8.5, isPositive: true }}
          description="All-time rides"
        />
        <StatCard
          title="Active Drivers"
          value={mockCabStats.activeDrivers}
          icon={Users}
          trend={{ value: 5.2, isPositive: true }}
          description="Available for rides"
        />
        <StatCard
          title="Completed Today"
          value={mockCabStats.completedToday}
          icon={CheckCircle}
          trend={{ value: 12.3, isPositive: true }}
          description="Rides completed today"
        />
        <StatCard
          title="Revenue Today"
          value={formatCurrency(mockCabStats.revenueToday, 'INR')}
          icon={DollarSign}
          trend={{ value: 15.8, isPositive: true }}
          description="Today's earnings"
        />
      </div>

      <DashboardSection
        title="Ride Status Breakdown"
        description="Current ride distribution by status"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statusBreakdown.map((item) => (
            <Card key={item.status} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{item.count}</p>
                  </div>
                  <CabStatusBadge status={item.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title="Recent Rides"
        description="Latest cab bookings"
        action={
          <Link href="/admin/cabs/rides">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        }
      >
        <DataTable<CabRide>
          columns={columns}
          data={recentRides}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          actions={getTableActions}
          emptyMessage="No rides found"
          emptyIcon={Car}
        />
      </DashboardSection>
    </PageContainer>
  )
}
