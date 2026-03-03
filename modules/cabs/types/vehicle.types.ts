export type VehicleStatus = 'active' | 'maintenance' | 'inactive'

export interface Vehicle {
  id: string
  typeId: string
  plateNumber: string
  driverId: string
  city: string
  status: VehicleStatus
}
