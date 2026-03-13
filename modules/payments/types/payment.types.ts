export type PaymentModule = 'flight' | 'cab' | 'hotel'

export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED'

export type PaymentMethod =
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'Wallet'

export type PaymentGateway = 'Razorpay' | 'Stripe' | 'Paytm'

export interface Payment {
  id: string
  bookingId: string
  module: PaymentModule
  customerName: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  status: PaymentStatus
  transactionId: string
  gateway: PaymentGateway
  createdAt: string
  /** Present for failed payments */
  errorMessage?: string
  /** Present for failed payments */
  attemptedAt?: string
}
