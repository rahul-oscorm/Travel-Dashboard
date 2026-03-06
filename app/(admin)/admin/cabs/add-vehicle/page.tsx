'use client'

import React, { useState } from 'react'
import {
  PageContainer,
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Switch,
} from '@/shared/components'
import type { CabInventoryFormData, VehicleCategory, FuelType, TransmissionType, PermitType, InventoryStatus } from '@/modules/cabs/types'
import { cn } from '@/shared/lib'

const VEHICLE_CATEGORIES: VehicleCategory[] = ['Hatchback', 'Sedan', 'SUV']
const FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'CNG', 'EV']
const TRANSMISSIONS: TransmissionType[] = ['Manual', 'Automatic']
const PERMIT_TYPES: PermitType[] = ['Local', 'National']
const INVENTORY_STATUSES: InventoryStatus[] = ['Active', 'Maintenance', 'Inactive']

const selectClassName =
  'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 25 }, (_, i) => currentYear - i)

const defaultForm: CabInventoryFormData = {
  vendor_id: 0,
  car_name: '',
  brand: '',
  model: '',
  variant: '',
  manufacturing_year: currentYear,
  vehicle_category: 'Sedan',
  fuel_type: 'Petrol',
  transmission: 'Manual',
  seating_capacity: 5,
  luggage_capacity: undefined,
  air_conditioning: true,
  registration_number: '',
  permit_type: 'Local',
  insurance_expiry_date: '',
  base_price_per_day: 0,
  price_per_km: undefined,
  inventory_status: 'Active',
  thumbnail_image: '',
  car_images: '',
  description: '',
}

export default function AddVehiclePage() {
  const [form, setForm] = useState<CabInventoryFormData>(defaultForm)

  const update = (key: keyof CabInventoryFormData, value: string | number | boolean | undefined) => {
    setForm((prev: CabInventoryFormData) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Add Vehicle submit:', form)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Add Vehicle"
        description="Register a new vehicle in cab fleet with all required details"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Vendor ID *</label>
                <Input
                  type="number"
                  min={1}
                  value={form.vendor_id || ''}
                  onChange={(e) => update('vendor_id', e.target.value ? Number(e.target.value) : 0)}
                  placeholder="Vendor / car owner"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Car Name *</label>
                <Input
                  value={form.car_name}
                  onChange={(e) => update('car_name', e.target.value)}
                  placeholder="Display name"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Brand *</label>
                <Input
                  value={form.brand}
                  onChange={(e) => update('brand', e.target.value)}
                  placeholder="Manufacturer"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Model *</label>
                <Input
                  value={form.model}
                  onChange={(e) => update('model', e.target.value)}
                  placeholder="Model"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-500">Variant</label>
                <Input
                  value={form.variant ?? ''}
                  onChange={(e) => update('variant', e.target.value || undefined)}
                  placeholder="Variant (optional)"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Manufacturing Year *</label>
                <select
                  className={selectClassName}
                  value={form.manufacturing_year}
                  onChange={(e) => update('manufacturing_year', Number(e.target.value))}
                  required
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Vehicle Category *</label>
                <select
                  className={selectClassName}
                  value={form.vehicle_category}
                  onChange={(e) => update('vehicle_category', e.target.value as VehicleCategory)}
                  required
                >
                  {VEHICLE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Fuel Type *</label>
                <select
                  className={selectClassName}
                  value={form.fuel_type}
                  onChange={(e) => update('fuel_type', e.target.value as FuelType)}
                  required
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Transmission *</label>
                <select
                  className={selectClassName}
                  value={form.transmission}
                  onChange={(e) => update('transmission', e.target.value as TransmissionType)}
                  required
                >
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Seating Capacity *</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={form.seating_capacity || ''}
                  onChange={(e) => update('seating_capacity', e.target.value ? Number(e.target.value) : 0)}
                  placeholder="Seats"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-500">Luggage Capacity (bags)</label>
                <Input
                  type="number"
                  min={0}
                  value={form.luggage_capacity ?? ''}
                  onChange={(e) => update('luggage_capacity', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional"
                />
              </div>
              <div className="flex items-end gap-4 pb-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Air Conditioning *</label>
                  <Switch
                    checked={form.air_conditioning}
                    onCheckedChange={(v) => update('air_conditioning', v)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration & Permit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Registration Number *</label>
                <Input
                  value={form.registration_number}
                  onChange={(e) => update('registration_number', e.target.value)}
                  placeholder="Vehicle number"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Permit Type *</label>
                <select
                  className={selectClassName}
                  value={form.permit_type}
                  onChange={(e) => update('permit_type', e.target.value as PermitType)}
                  required
                >
                  {PERMIT_TYPES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Insurance Expiry Date *</label>
                <Input
                  type="date"
                  value={form.insurance_expiry_date}
                  onChange={(e) => update('insurance_expiry_date', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Base Price per Day *</label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.base_price_per_day || ''}
                  onChange={(e) => update('base_price_per_day', e.target.value ? Number(e.target.value) : 0)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-500">Price per KM</label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price_per_km ?? ''}
                  onChange={(e) => update('price_per_km', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Inventory Status *</label>
                <select
                  className={selectClassName}
                  value={form.inventory_status}
                  onChange={(e) => update('inventory_status', e.target.value as InventoryStatus)}
                  required
                >
                  {INVENTORY_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images & Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-500">Thumbnail Image URL</label>
              <Input
                type="url"
                value={form.thumbnail_image ?? ''}
                onChange={(e) => update('thumbnail_image', e.target.value || undefined)}
                placeholder="Main image URL (optional)"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-500">Car Images (JSON URLs)</label>
              <textarea
                className={cn(
                  'flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
                value={form.car_images ?? ''}
                onChange={(e) => update('car_images', e.target.value || undefined)}
                placeholder='["url1", "url2"] (optional)'
                rows={3}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-500">Description</label>
              <textarea
                className={cn(
                  'flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
                value={form.description ?? ''}
                onChange={(e) => update('description', e.target.value || undefined)}
                placeholder="Car details (optional)"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Add Vehicle</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setForm(defaultForm)}
          >
            Reset
          </Button>
        </div>
      </form>
    </PageContainer>
  )
}
