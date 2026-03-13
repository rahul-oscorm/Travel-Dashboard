'use client'

import React from 'react'
import { PageContainer, PageHeader } from '@/shared/components'
import { useRefunds } from '@/modules/payments/hooks'
import { RefundTable } from '@/modules/payments/components'

export default function RefundsPage() {
  const { data, loading } = useRefunds()

  return (
    <PageContainer>
      <PageHeader
        title="Refunds"
        description="View and track payment refunds"
      />
      <RefundTable refunds={data} loading={loading} />
    </PageContainer>
  )
}
