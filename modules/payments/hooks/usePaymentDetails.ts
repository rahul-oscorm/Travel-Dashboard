'use client'

import { useEffect, useState } from 'react'
import type { Payment } from '../types'
import { getPaymentById } from '../services/payment.service'

export const usePaymentDetails = (id: string | undefined) => {
  const [data, setData] = useState<Payment | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getPaymentById(id)
        if (mounted) {
          if (result) {
            setData(result)
          } else {
            setError('Payment not found')
          }
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load payment details')
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
  }, [id])

  return { data, loading, error }
}

