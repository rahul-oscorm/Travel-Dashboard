export type RefundStatus = 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'

export interface Refund {
  refundId: string
  paymentId: string
  bookingId: string
  customerName: string
  amount: number
  status: RefundStatus
  requestedAt: string
  processedAt: string | null
}
