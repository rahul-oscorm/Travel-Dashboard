'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import {
  PageContainer,
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/shared/components'
import { formatCurrency, formatDate } from '@/shared/lib'
import { usePaymentDetails } from '@/modules/payments/hooks'
import { PaymentStatusBadge, PaymentMethodBadge } from '@/modules/payments/components'

export default function PaymentDetailsPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { data, loading, error } = usePaymentDetails(id)

  return (
    <PageContainer>
      <PageHeader
        title={`Payment Details${data ? ` • ${data.id}` : ''}`}
        description="Detailed view of the selected payment"
      />

      {loading && <p className="text-sm text-gray-500">Loading payment details...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(data.amount, data.currency)}
                </span>
                <PaymentStatusBadge status={data.status} />
                <PaymentMethodBadge method={data.paymentMethod} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem label="Payment ID" value={data.id} />
                <DetailItem label="Booking ID" value={data.bookingId} />
                <DetailItem label="Customer" value={data.customerName} />
                <DetailItem label="Module" value={data.module} />
                <DetailItem label="Amount" value={formatCurrency(data.amount, data.currency)} />
                <DetailItem label="Currency" value={data.currency} />
                <DetailItem label="Payment Method" value={data.paymentMethod} />
                <DetailItem label="Transaction ID" value={data.transactionId} />
                <DetailItem label="Gateway" value={data.gateway} />
                <DetailItem label="Status" value={data.status} />
                <DetailItem label="Created Date" value={formatDate(data.createdAt)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Payment created</p>
                    <p className="text-gray-500">
                      {formatDate(data.createdAt)}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Current status</p>
                    <div className="text-gray-500">
                      <Badge variant="outline" className="mt-1">
                        {data.status}
                      </Badge>
                    </div>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  )
}

interface DetailItemProps {
  label: string
  value: string
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div className="space-y-0.5">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="text-sm text-gray-900">{value}</p>
  </div>
)

