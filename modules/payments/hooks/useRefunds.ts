'use client'

import { useEffect, useState } from 'react'
import type { Refund } from '../types'
import { getRefunds } from '../services/refund.service'

export const useRefunds = () => {
  const [data, setData] = useState<Refund[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getRefunds()
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load refunds')
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

