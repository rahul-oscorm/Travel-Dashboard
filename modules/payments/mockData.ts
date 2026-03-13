import type {
  Payment,
  PaymentStatus,
  PaymentMethod,
  PaymentModule,
  PaymentGateway,
  Refund,
  RefundStatus,
} from './types'

const MODULES: PaymentModule[] = ['flight', 'cab', 'hotel']
const METHODS: PaymentMethod[] = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Wallet',
]
const GATEWAYS: PaymentGateway[] = ['Razorpay', 'Stripe', 'Paytm']
const PAYMENT_STATUSES: PaymentStatus[] = ['SUCCESS', 'PENDING', 'FAILED', 'REFUNDED']
const REFUND_STATUSES: RefundStatus[] = ['REQUESTED', 'PROCESSING', 'COMPLETED', 'REJECTED']

const CUSTOMERS = [
  'Rahul Sharma',
  'Priya Singh',
  'Amit Verma',
  'Sneha Iyer',
  'Vikram Rao',
  'Neha Gupta',
  'Rohan Das',
  'Ananya Menon',
  'Karthik Reddy',
  'Divya Nair',
]

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const paymentRecords: Payment[] = Array.from({ length: 30 }, (_, i) => {
  const status = randomItem(PAYMENT_STATUSES)
  const module = randomItem(MODULES)
  const baseAmount =
    module === 'flight' ? 6000 + i * 200 : module === 'hotel' ? 4000 + i * 150 : 800 + i * 50
  const amount = Math.round(baseAmount / 100) * 100
  const isFailed = status === 'FAILED'
  return {
    id: `PAY-${1001 + i}`,
    bookingId:
      module === 'flight'
        ? `FLT-${3000 + i}`
        : module === 'hotel'
          ? `HTL-${4000 + i}`
          : `CAB-${4520 + i}`,
    module,
    customerName: CUSTOMERS[i % CUSTOMERS.length],
    amount,
    currency: 'INR',
    paymentMethod: randomItem(METHODS),
    status,
    transactionId: `TXN${938470 + i}`,
    gateway: randomItem(GATEWAYS),
    createdAt: new Date(Date.now() - (i + 1) * 3600000 * 6)
      .toISOString()
      .slice(0, 10),
    ...(isFailed && {
      errorMessage: ['Insufficient funds', 'Card declined', 'Timeout', 'Gateway error'][i % 4],
      attemptedAt: new Date(Date.now() - (i + 1) * 3600000 * 6).toISOString(),
    }),
  }
})

const refundRecords: Refund[] = Array.from({ length: 15 }, (_, i) => {
  const payment = paymentRecords[i % paymentRecords.length]
  const status = randomItem(REFUND_STATUSES)
  return {
    refundId: `RF-${5001 + i}`,
    paymentId: payment.id,
    bookingId: payment.bookingId,
    customerName: payment.customerName,
    amount: Math.round(payment.amount * 0.8 + i * 10),
    status,
    requestedAt: new Date(Date.now() - (i + 2) * 3600000 * 24).toISOString().slice(0, 10),
    processedAt:
      status === 'COMPLETED' || status === 'REJECTED'
        ? new Date(Date.now() - (i + 1) * 3600000 * 24).toISOString().slice(0, 10)
        : null,
  }
})

export const payments: Payment[] = paymentRecords
export const refunds: Refund[] = refundRecords
