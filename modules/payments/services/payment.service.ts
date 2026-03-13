import type { Payment } from '../types'
import { payments } from '../mockData'

const delay = () => new Promise((resolve) => setTimeout(resolve, 500))

export const getPayments = async (): Promise<Payment[]> => {
  await delay()
  return payments
}

export const getPaymentById = async (id: string): Promise<Payment | undefined> => {
  await delay()
  return payments.find((p) => p.id === id)
}

export const getFailedPayments = async (): Promise<Payment[]> => {
  await delay()
  return payments.filter((p) => p.status === 'FAILED')
}
