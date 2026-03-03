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
import { Plus, Search, Filter, Eye, Edit, XCircle } from 'lucide-react'
import { mockFlights, mockAirlines } from '@/modules/flights/mockData'
import { FlightStatusBadge } from '@/modules/flights/components'
import { getAirlineNameByAirlineId } from '@/modules/flights/utils/lookups'
import type { Flight, FlightStatus } from '@/modules/flights/types'
import { formatCurrency, formatDate } from '@/shared/lib'
import { useAuth, canCancelFlight } from '@/core/auth'

export default function FlightsInventoryPage(): React.ReactElement {
  const user = useAuth((state) => state.user)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortKey, setSortKey] = useState<string>('departureTime')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const [searchFlightNumber, setSearchFlightNumber] = useState('')
  const [selectedAirlineId, setSelectedAirlineId] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [departureDateFilter, setDepartureDateFilter] = useState('')

  const handleSort = (key: string, direction: 'asc' | 'desc'): void => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const airlineOptions = useMemo(() => {
    return [{ id: 'all', name: 'All Airlines' }, ...mockAirlines]
  }, [])

  const statusOptions: Array<'all' | FlightStatus> = useMemo(
    () => [
      'all',
      'scheduled',
      'boarding',
      'departed',
      'arrived',
      'cancelled',
      'delayed',
    ],
    []
  )

  const filteredFlights = useMemo(() => {
    let result = [...mockFlights]

    if (searchFlightNumber.trim()) {
      const q = searchFlightNumber.toLowerCase().trim()
      result = result.filter((f) =>
        f.flightNumber.toLowerCase().includes(q)
      )
    }

    if (selectedAirlineId !== 'all') {
      result = result.filter((f) => f.airlineId === selectedAirlineId)
    }

    if (selectedStatus !== 'all') {
      result = result.filter((f) => f.status === selectedStatus)
    }

    if (departureDateFilter) {
      result = result.filter((f) => {
        const depDate = f.departureTime.slice(0, 10)
        return depDate === departureDateFilter
      })
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey as keyof Flight]
        const bVal = b[sortKey as keyof Flight]
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
    searchFlightNumber,
    selectedAirlineId,
    selectedStatus,
    departureDateFilter,
    sortKey,
    sortDirection,
  ])

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentFlights = filteredFlights.slice(startIndex, startIndex + itemsPerPage)

  const columns: Column<Flight>[] = useMemo(
    () => [
      {
        key: 'flightNumber',
        label: 'Flight Number',
        sortable: true,
        render: (value) => (
          <span className="font-medium text-primary-600">{String(value)}</span>
        ),
      },
      {
        key: 'airlineId',
        label: 'Airline',
        sortable: true,
        render: (value) => getAirlineNameByAirlineId(value as string),
      },
      {
        key: 'origin',
        label: 'Origin',
        sortable: true,
      },
      {
        key: 'destination',
        label: 'Destination',
        sortable: true,
      },
      {
        key: 'departureTime',
        label: 'Departure',
        sortable: true,
        render: (value) => formatDate(value as string),
      },
      {
        key: 'arrivalTime',
        label: 'Arrival',
        sortable: true,
        render: (value) => formatDate(value as string),
      },
      {
        key: 'price',
        label: 'Price',
        sortable: true,
        render: (value) => (
          <span className="font-semibold">{formatCurrency(Number(value))}</span>
        ),
      },
      {
        key: 'availableSeats',
        label: 'Available Seats',
        sortable: true,
      },
      {
        key: 'status',
        label: 'Status',
        render: (value) => <FlightStatusBadge status={value as FlightStatus} />,
      },
    ],
    []
  )

  const getTableActions = (row: Flight): Action[] => {
    const actions: Action[] = [
      {
        label: 'View',
        icon: Eye,
        onClick: () => console.log('View', row.id),
      },
      {
        label: 'Edit',
        icon: Edit,
        onClick: () => console.log('Edit', row.id),
      },
    ]
    if (canCancelFlight(user)) {
      actions.push({
        label: 'Cancel Flight',
        icon: XCircle,
        variant: 'destructive',
        onClick: () => console.log('Cancel flight', row.id),
      })
    }
    return actions
  }

  const hasActiveFilters =
    searchFlightNumber.trim() !== '' ||
    selectedAirlineId !== 'all' ||
    selectedStatus !== 'all' ||
    departureDateFilter !== ''

  const handleResetFilters = (): void => {
    setSearchFlightNumber('')
    setSelectedAirlineId('all')
    setSelectedStatus('all')
    setDepartureDateFilter('')
    setCurrentPage(1)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Flights Inventory"
        description="Manage flight schedule and availability"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Flight
          </Button>
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
                  placeholder="Search flight number..."
                  value={searchFlightNumber}
                  onChange={(e) => {
                    setSearchFlightNumber(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedAirlineId}
                  onChange={(e) => {
                    setSelectedAirlineId(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {airlineOptions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={departureDateFilter}
                  onChange={(e) => {
                    setDepartureDateFilter(e.target.value)
                    setCurrentPage(1)
                  }}
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

          <DataTable<Flight>
            columns={columns}
            data={currentFlights}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            actions={getTableActions}
            emptyMessage="No flights found matching your filters"
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredFlights.length}
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