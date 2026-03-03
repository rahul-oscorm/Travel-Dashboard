export type TripStatus = 'ongoing' | 'completed' | 'cancelled'

export interface Trip {
  id: string
  bookingId: string
  driverId: string
  distanceKm: number
  durationMin: number
  finalFare: number
  startTime: string
  endTime: string
  status: TripStatus
}
