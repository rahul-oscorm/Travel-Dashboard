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
