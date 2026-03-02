import type { BaseEntity, Status } from '@/core/types'

export interface Flight extends BaseEntity {
  flightNumber: string
  airline: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  totalSeats: number
  status: FlightStatus
}

export type FlightStatus = 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled' | 'delayed'

export interface FlightBooking extends BaseEntity {
  bookingReference: string
  flightNumber: string
  passengerName: string
  passengerEmail: string
  seatNumber: string
  bookingDate: string
  travelDate: string
  price: number
  status: BookingStatus
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

export interface FlightStats {
  totalFlights: number
  activeBookings: number
  revenue: number
  occupancyRate: number
}
