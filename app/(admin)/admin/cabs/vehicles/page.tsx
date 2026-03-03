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
import { vehicles, vehicleTypes, drivers } from '@/modules/cabs/mockData'
import { VehicleStatusBadge } from '@/modules/cabs/components'
import type { Vehicle } from '@/modules/cabs/types'

type VehicleRow = Vehicle & { typeName: string; driverName: string }

export default function CabsVehiclesPage(): React.ReactElement {
  const vehicleTypeMap = useMemo(() => new Map(vehicleTypes.map((vt) => [vt.id, vt])), [])
  const driverMap = useMemo(() => new Map(drivers.map((d) => [d.id, d])), [])

  const rows = useMemo((): VehicleRow[] => {
    return vehicles.map((v) => ({
      ...v,
      typeName: vehicleTypeMap.get(v.typeId)?.name ?? v.typeId,
      driverName: driverMap.get(v.driverId)?.name ?? v.driverId,
    }))
  }, [vehicleTypeMap, driverMap])

  const columns: Column<VehicleRow>[] = useMemo(
    () => [
      { key: 'plateNumber', label: 'Plate Number' },
      { key: 'typeName', label: 'Vehicle Type' },
      { key: 'driverName', label: 'Driver' },
      { key: 'city', label: 'City' },
      {
        key: 'status',
        label: 'Status',
        render: (_, row) => <VehicleStatusBadge status={row.status} />,
      },
    ],
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title="Cab Vehicles"
        description="Fleet and vehicle status"
      />

      <Card>
        <CardContent className="p-4">
          <DataTable<VehicleRow>
            columns={columns}
            data={rows}
            emptyMessage="No vehicles found"
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
