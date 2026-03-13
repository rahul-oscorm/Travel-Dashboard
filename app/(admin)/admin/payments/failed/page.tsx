'use client'

import React from 'react'
import { PageContainer, PageHeader } from '@/shared/components'
import { useFailedPayments } from '@/modules/payments/hooks'
import { FailedPaymentsTable } from '@/modules/payments/components'

export default function FailedPaymentsPage() {
  const { data, loading } = useFailedPayments()

  const handleRetry = (payment: { id: string }) => {
    // Placeholder: later call API to retry payment
    console.log('Retry payment', payment.id)
  }

  return (
    <PageContainer>
      <PageHeader
        title="Failed Payments"
        description="View and retry failed transactions"
      />
      <FailedPaymentsTable
        payments={data}
        loading={loading}
        onRetry={handleRetry}
      />
    </PageContainer>
  )
}
