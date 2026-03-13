import type { Refund } from '../types'
import { refunds } from '../mockData'

const delay = () => new Promise((resolve) => setTimeout(resolve, 500))

export const getRefunds = async (): Promise<Refund[]> => {
  await delay()
  return refunds
}
