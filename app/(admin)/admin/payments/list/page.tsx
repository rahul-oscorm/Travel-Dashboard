'use client'

import React from 'react'
import { PageContainer, PageHeader } from '@/shared/components'
import { usePayments } from '@/modules/payments/hooks'
import { PaymentTable } from '@/modules/payments/components'

export default function PaymentsListPage() {
  const { data, loading } = usePayments()

  return (
    <PageContainer>
      <PageHeader
        title="Payments List"
        description="Search, filter and manage all payments"
      />
      <PaymentTable payments={data} loading={loading} showFilters={true} />
    </PageContainer>
  )
}
