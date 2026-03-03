export type VehicleTypeStatus = 'active' | 'inactive'

export interface VehicleType {
  id: string
  name: string
  baseFare: number
  perKmRate: number
  perMinRate: number
  seatingCapacity: number
  status: VehicleTypeStatus
}
