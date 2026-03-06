'use client'

import React from 'react'
import Link from 'next/link'
import {
  PageContainer,
  PageHeader,
  DataTable,
  Card,
  CardContent,
  Button,
} from '@/shared/components'
import type { Column } from '@/shared/components'
import type { InventoryStatus } from '@/modules/cabs/types'
import { formatCurrency } from '@/shared/lib'
import { Plus, Car } from 'lucide-react'
import { cn } from '@/shared/lib'

export interface CabInventoryItem {
  id: string
  car_name: string
  brand: string
  model: string
  registration_number: string
  vehicle_category: string
  fuel_type: string
  transmission: string
  seating_capacity: number
  inventory_status: InventoryStatus
  base_price_per_day: number
  vendor_id: number
}

const availableVehicles: CabInventoryItem[] = [
  {
    id: 'inv-1',
    vendor_id: 101,
    car_name: 'Swift Dzire',
    brand: 'Maruti',
    model: 'Dzire',
    registration_number: 'DL 01 AB 1234',
    vehicle_category: 'Sedan',
    fuel_type: 'Petrol',
    transmission: 'Manual',
    seating_capacity: 5,
    inventory_status: 'Active',
    base_price_per_day: 2499,
  },
  {
    id: 'inv-2',
    vendor_id: 102,
    car_name: 'Innova Crysta',
    brand: 'Toyota',
    model: 'Innova Crysta',
    registration_number: 'DL 02 CD 5678',
    vehicle_category: 'SUV',
    fuel_type: 'Diesel',
    transmission: 'Automatic',
    seating_capacity: 7,
    inventory_status: 'Active',
    base_price_per_day: 4999,
  },
  {
    id: 'inv-3',
    vendor_id: 103,
    car_name: 'i20 Sportz',
    brand: 'Hyundai',
    model: 'i20',
    registration_number: 'DL 03 EF 9012',
    vehicle_category: 'Hatchback',
    fuel_type: 'Petrol',
    transmission: 'Manual',
    seating_capacity: 5,
    inventory_status: 'Active',
    base_price_per_day: 1999,
  },
  {
    id: 'inv-4',
    vendor_id: 104,
    car_name: 'Ertiga',
    brand: 'Maruti',
    model: 'Ertiga',
    registration_number: 'DL 04 GH 3456',
    vehicle_category: 'SUV',
    fuel_type: 'Petrol',
    transmission: 'Manual',
    seating_capacity: 7,
    inventory_status: 'Maintenance',
    base_price_per_day: 3499,
  },
]

function InventoryStatusBadge({ status }: { status: InventoryStatus }) {
  const styles = {
    Active: 'bg-green-100 text-green-800',
    Maintenance: 'bg-amber-100 text-amber-800',
    Inactive: 'bg-gray-100 text-gray-700',
  }
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[status]
      )}
    >
      {status}
    </span>
  )
}

const columns: Column<CabInventoryItem>[] = [
  {
    key: 'car_name',
    label: 'Car Name',
    render: (_, row) => (
      <span className="font-medium text-gray-900">{row.car_name}</span>
    ),
  },
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'registration_number', label: 'Registration' },
  { key: 'vehicle_category', label: 'Category' },
  { key: 'fuel_type', label: 'Fuel' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'seating_capacity', label: 'Seats' },
  {
    key: 'inventory_status',
    label: 'Status',
    render: (_, row) => <InventoryStatusBadge status={row.inventory_status} />,
  },
  {
    key: 'base_price_per_day',
    label: 'Price/Day',
    render: (value) => (
      <span className="font-medium">{formatCurrency(Number(value), 'INR')}</span>
    ),
  },
]

export default function CabInventoryPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Inventory"
        description="Available vehicles in cab fleet"
        actions={
          <Link href="/admin/cabs/add-vehicle">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-4">
          <DataTable<CabInventoryItem>
            columns={columns}
            data={availableVehicles}
            emptyMessage="No available vehicles"
            emptyIcon={Car}
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
