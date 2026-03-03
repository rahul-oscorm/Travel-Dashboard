export type PaymentMethod = 'cash' | 'card' | 'upi'

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded'

export interface Payment {
  id: string
  bookingId: string
  userId: string
  amount: number
  method: PaymentMethod
  transactionId: string
  status: PaymentStatus
  createdAt: string
}
