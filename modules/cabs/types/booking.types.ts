export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export interface Booking {
  id: string
  userId: string
  vehicleId: string
  driverId: string
  pickupAddress: string
  dropAddress: string
  pickupTime: string
  estimatedFare: number
  status: BookingStatus
  createdAt: string
}
