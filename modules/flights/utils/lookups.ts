import type { Flight, Airline } from '../types'
import { mockFlights, mockAirlines } from '../mockData'

export function getFlightById(id: string): Flight | undefined {
  return mockFlights.find((f) => f.id === id)
}

export function getAirlineById(id: string): Airline | undefined {
  return mockAirlines.find((a) => a.id === id)
}

export function getFlightNumberByFlightId(flightId: string): string {
  const flight = getFlightById(flightId)
  return flight?.flightNumber ?? '—'
}

export function getAirlineNameByAirlineId(airlineId: string): string {
  const airline = getAirlineById(airlineId)
  return airline?.name ?? '—'
}
