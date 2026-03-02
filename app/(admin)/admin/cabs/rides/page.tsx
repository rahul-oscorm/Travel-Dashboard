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
import type { Column } from '@/shared/components'
import { Plus, Search, Filter, Download, Eye, Edit, XCircle } from 'lucide-react'
import { mockRides } from '@/modules/cabs/mockData'
import { CabStatusBadge, PaymentStatusBadge } from '@/modules/cabs/components'
import type { CabRide, RideStatus } from '@/modules/cabs/types'
import { formatCurrency, formatDate } from '@/shared/lib'
import { useAuth, canDeleteRecords } from '@/core/auth'

export default function CabsRidesPage() {
  const user = useAuth((state) => state.user)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<string>('rideDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(mockRides.map(ride => ride.city)))
    return ['all', ...uniqueCities.sort()]
  }, [])

  const rideStatuses: Array<'all' | RideStatus> = [
    'all',
    'pending',
    'accepted',
    'on_the_way',
    'ongoing',
    'completed',
    'cancelled',
  ]

  const filteredRides = useMemo(() => {
    let filtered = [...mockRides]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ride) =>
          ride.rideId.toLowerCase().includes(query) ||
          ride.customerName.toLowerCase().includes(query)
      )
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter((ride) => ride.city === selectedCity)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((ride) => ride.rideStatus === selectedStatus)
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey as keyof CabRide]
        const bValue = b[sortKey as keyof CabRide]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }

        return 0
      })
    }

    return filtered
  }, [searchQuery, selectedCity, selectedStatus, sortKey, sortDirection])

  const totalPages = Math.ceil(filteredRides.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentRides = filteredRides.slice(startIndex, startIndex + itemsPerPage)

  const columns: Column<CabRide>[] = [
    {
      key: 'rideId',
      label: 'Ride ID',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-primary-600">{value}</span>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'pickupLocation',
      label: 'Pickup',
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'dropLocation',
      label: 'Drop',
      render: (value) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
    },
    {
      key: 'driverName',
      label: 'Driver',
      sortable: true,
    },
    {
      key: 'vehicleType',
      label: 'Vehicle',
      render: (value) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: 'fare',
      label: 'Fare',
      sortable: true,
      render: (value) => (
        <span className="font-semibold">{formatCurrency(value, 'INR')}</span>
      ),
    },
    {
      key: 'rideStatus',
      label: 'Ride Status',
      render: (value) => <CabStatusBadge status={value} />,
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value) => <PaymentStatusBadge status={value} />,
    },
    {
      key: 'rideDate',
      label: 'Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
  ]

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCity('all')
    setSelectedStatus('all')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || selectedCity !== 'all' || selectedStatus !== 'all'

  return (
    <PageContainer>
      <PageHeader
        title="All Cab Rides"
        description="Manage and track all taxi bookings"
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Ride
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
                  placeholder="Search by Ride ID or Customer..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  disabled={!hasActiveFilters}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  id="city"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city === 'all' ? 'All Cities' : city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">
                  Ride Status
                </label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {rideStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all'
                        ? 'All Statuses'
                        : status.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Showing {filteredRides.length} of {mockRides.length} rides
                </span>
              </div>
            )}
          </div>

          <DataTable<CabRide>
            columns={columns}
            data={currentRides}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            actions={(row) => {
              const actions = [
                {
                  label: 'View Details',
                  icon: Eye,
                  onClick: () => console.log('View', row.id),
                },
                {
                  label: 'Edit Ride',
                  icon: Edit,
                  onClick: () => console.log('Edit', row.id),
                },
              ]

              if (canDeleteRecords(user)) {
                actions.push({
                  label: 'Cancel Ride',
                  icon: XCircle,
                  variant: 'destructive' as const,
                  onClick: () => console.log('Cancel', row.id),
                })
              }

              return actions
            }}
            emptyMessage="No rides found matching your filters"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRides.length}
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
