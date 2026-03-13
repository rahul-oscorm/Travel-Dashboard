'use client'

import { useEffect, useState } from 'react'
import type { Payment } from '../types'
import { getFailedPayments } from '../services/payment.service'

export const useFailedPayments = () => {
  const [data, setData] = useState<Payment[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getFailedPayments()
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load failed payments')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      mounted = false
    }
  }, [])

  return { data, loading, error }
}
