'use client'

import React, { useState, useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  DataTable,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column } from '@/shared/components'
import { drivers, trips } from '@/modules/cabs/mockData'
import { DriverStatusBadge } from '@/modules/cabs/components'
import type { CabDriver } from '@/modules/cabs/types'

type DriverRow = CabDriver & { totalTrips: number }

const CITIES = ['All', 'Delhi', 'Mumbai', 'Bangalore']

export default function CabsDriversPage(): React.ReactElement {
  const [cityFilter, setCityFilter] = useState<string>('All')

  const driverTripsCount = useMemo(() => {
    const count = new Map<string, number>()
    trips.forEach((t) => {
      count.set(t.driverId, (count.get(t.driverId) ?? 0) + 1)
    })
    return count
  }, [])

  const filteredDrivers = useMemo((): DriverRow[] => {
    const list = drivers.map((d) => ({
      ...d,
      totalTrips: driverTripsCount.get(d.id) ?? 0,
    }))
    if (cityFilter !== 'All') {
      return list.filter((d) => d.city === cityFilter)
    }
    return list
  }, [cityFilter, driverTripsCount])

  const columns: Column<DriverRow>[] = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'city', label: 'City' },
      {
        key: 'rating',
        label: 'Rating',
        render: (value) => String(Number(value).toFixed(1)),
      },
      {
        key: 'isAvailable',
        label: 'Availability',
        render: (value) => (value ? 'Available' : 'Busy'),
      },
      {
        key: 'status',
        label: 'Status',
        render: (_, row) => <DriverStatusBadge status={row.status} />,
      },
      {
        key: 'totalTrips',
        label: 'Total Trips',
        render: (value) => String(value),
      },
    ],
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title="Cab Drivers"
        description="Manage drivers and availability"
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700">City</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <DataTable<DriverRow>
            columns={columns}
            data={filteredDrivers}
            emptyMessage="No drivers found"
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
