export type CabDriverStatus = 'active' | 'suspended'

export interface CabDriver {
  id: string
  name: string
  phone: string
  vehicleId: string
  city: string
  rating: number
  isAvailable: boolean
  status: CabDriverStatus
}
