import type { BaseEntity } from '@/core/types'

// ---------------------------------------------------------------------------
// Airline
// ---------------------------------------------------------------------------

export type AirlineStatus = 'active' | 'inactive'

export interface Airline {
  id: string
  name: string
  code: string
  logoUrl: string
  status: AirlineStatus
}

// ---------------------------------------------------------------------------
// Flight
// ---------------------------------------------------------------------------

export type FlightStatus =
  | 'scheduled'
  | 'boarding'
  | 'departed'
  | 'arrived'
  | 'cancelled'
  | 'delayed'

export interface Flight extends BaseEntity {
  flightNumber: string
  airlineId: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: number // minutes
  price: number
  totalSeats: number
  availableSeats: number
  status: FlightStatus
}

// ---------------------------------------------------------------------------
// Flight Booking
// ---------------------------------------------------------------------------

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

export type PaymentStatus = 'paid' | 'pending' | 'failed'

export interface FlightBooking extends BaseEntity {
  bookingReference: string
  flightId: string
  passengerName: string
  passengerEmail: string
  passengerPhone: string
  seatNumber: string
  bookingDate: string
  travelDate: string
  price: number
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface FlightStats {
  totalFlights: number
  activeFlights: number
  totalBookings: number
  revenue: number
  occupancyRate: number
}
