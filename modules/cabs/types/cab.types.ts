import type { BaseEntity } from '@/core/types'

export interface CabRide extends BaseEntity {
  rideId: string
  customerName: string
  pickupLocation: string
  dropLocation: string
  city: string
  vehicleType: VehicleType
  driverName: string
  fare: number
  rideDate: string
  rideStatus: RideStatus
  paymentStatus: PaymentStatus
}

export interface Driver extends BaseEntity {
  name: string
  phone: string
  city: string
  vehicleType: string
  rating: number
  availability: DriverAvailability
  status: DriverStatus
}

export interface Vehicle extends BaseEntity {
  vehicleId: string
  vehicleType: VehicleType
  plateNumber: string
  driverAssigned: string
  city: string
  status: VehicleStatus
  lastServiceDate: string
}

export interface CabStats {
  totalRides: number
  activeDrivers: number
  completedToday: number
  revenueToday: number
}

export type VehicleType = 'sedan' | 'suv' | 'hatchback'

export type RideStatus = 'pending' | 'accepted' | 'on_the_way' | 'ongoing' | 'completed' | 'cancelled'

export type PaymentStatus = 'paid' | 'pending' | 'failed'

export type DriverAvailability = 'available' | 'busy'

export type DriverStatus = 'active' | 'inactive'

export type VehicleStatus = 'active' | 'inactive'

// Cab Inventory (Add Cab form)
export type VehicleCategory = 'Hatchback' | 'Sedan' | 'SUV'
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'EV'
export type TransmissionType = 'Manual' | 'Automatic'
export type PermitType = 'Local' | 'National'
export type InventoryStatus = 'Active' | 'Maintenance' | 'Inactive'

export interface CabInventoryFormData {
  vendor_id: number
  car_name: string
  brand: string
  model: string
  variant?: string
  manufacturing_year: number
  vehicle_category: VehicleCategory
  fuel_type: FuelType
  transmission: TransmissionType
  seating_capacity: number
  luggage_capacity?: number
  air_conditioning: boolean
  registration_number: string
  permit_type: PermitType
  insurance_expiry_date: string
  base_price_per_day: number
  price_per_km?: number
  inventory_status: InventoryStatus
  thumbnail_image?: string
  car_images?: string
  description?: string
}
