'use client'

import React, { useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  DataTable,
  Card,
  CardContent,
} from '@/shared/components'
import type { Column } from '@/shared/components'
import { formatCurrency } from '@/shared/lib'
import { trips, drivers } from '@/modules/cabs/mockData'
import type { Trip, TripStatus } from '@/modules/cabs/types'

type TripRow = Trip & { driverName: string }

const statusLabels: Record<TripStatus, string> = {
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function CabsTripsPage(): React.ReactElement {
  const driverMap = useMemo(() => new Map(drivers.map((d) => [d.id, d])), [])

  const rows = useMemo((): TripRow[] => {
    return trips.map((t) => ({
      ...t,
      driverName: driverMap.get(t.driverId)?.name ?? t.driverId,
    }))
  }, [driverMap])

  const columns: Column<TripRow>[] = useMemo(
    () => [
      { key: 'id', label: 'Trip ID' },
      { key: 'bookingId', label: 'Booking ID' },
      { key: 'driverName', label: 'Driver' },
      {
        key: 'distanceKm',
        label: 'Distance (km)',
        render: (value) => String(value),
      },
      {
        key: 'durationMin',
        label: 'Duration (min)',
        render: (value) => String(value),
      },
      {
        key: 'finalFare',
        label: 'Final Fare',
        render: (value) => formatCurrency(Number(value), 'INR'),
      },
      {
        key: 'status',
        label: 'Status',
        render: (_, row) => statusLabels[row.status],
      },
    ],
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title="Cab Trips"
        description="Trip history and status"
      />

      <Card>
        <CardContent className="p-4">
          <DataTable<TripRow>
            columns={columns}
            data={rows}
            emptyMessage="No trips found"
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
