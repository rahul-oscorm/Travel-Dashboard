'use client'

import React, { useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatCard,
  DataTable,
} from '@/shared/components'
import type { Column, Action } from '@/shared/components'
import { formatCurrency, formatDate } from '@/shared/lib'
import { DollarSign, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePayments } from '@/modules/payments/hooks'
import { PaymentStatusBadge } from '@/modules/payments/components'
import type { Payment } from '@/modules/payments/types'

export default function PaymentsDashboardPage() {
  const { data: payments, loading } = usePayments()
  const router = useRouter()

  const stats = useMemo(() => {
    const total = payments.length
    const successful = payments.filter((p) => p.status === 'SUCCESS').length
    const pending = payments.filter((p) => p.status === 'PENDING').length
    const failed = payments.filter((p) => p.status === 'FAILED').length
    const refundedAmount = payments
      .filter((p) => p.status === 'REFUNDED')
      .reduce((sum, p) => sum + p.amount, 0)
    const totalRevenue = payments
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0)

    return {
      totalPayments: total,
      successful,
      pending,
      failed,
      refundedAmount,
      totalRevenue,
    }
  }, [payments])

  const statusCounts = useMemo(() => {
    const success = payments.filter((p) => p.status === 'SUCCESS').length
    const pending = payments.filter((p) => p.status === 'PENDING').length
    const failed = payments.filter((p) => p.status === 'FAILED').length
    const refunded = payments.filter((p) => p.status === 'REFUNDED').length
    const max = Math.max(success, pending, failed, refunded, 1)
    return [
      { label: 'Success', value: success, pct: (success / max) * 100, color: 'bg-green-500' },
      { label: 'Pending', value: pending, pct: (pending / max) * 100, color: 'bg-yellow-500' },
      { label: 'Failed', value: failed, pct: (failed / max) * 100, color: 'bg-red-500' },
      { label: 'Refunded', value: refunded, pct: (refunded / max) * 100, color: 'bg-blue-500' },
    ]
  }, [payments])

  const recentPayments = useMemo(
    () =>
      [...payments]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [payments]
  )

  const recentColumns: Column<Payment>[] = [
    { key: 'id', label: 'Payment ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'module', label: 'Module' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value, row) => formatCurrency(Number(value), row.currency),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => <PaymentStatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => formatDate(String(value)),
    },
  ]

  const recentActions = (row: Payment): Action[] => [
    { label: 'View', onClick: () => router.push(`/admin/payments/${row.id}`) },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Payments Dashboard"
        description="Overview of payments and revenue"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          icon={DollarSign}
          description="All transactions"
          className="min-w-0"
        />
        <StatCard
          title="Successful"
          value={stats.successful}
          icon={CheckCircle}
          description="Completed"
          className="min-w-0"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          description="Awaiting"
          className="min-w-0"
        />
        <StatCard
          title="Failed"
          value={stats.failed}
          icon={XCircle}
          description="Failed attempts"
          className="min-w-0"
        />
        <StatCard
          title="Refunded Amount"
          value={formatCurrency(stats.refundedAmount, 'INR')}
          icon={RotateCcw}
          description="Total refunded"
          className="min-w-0"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Success)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total revenue</span>
                <span className="font-semibold">{formatCurrency(stats.totalRevenue, 'INR')}</span>
              </div>
              <div className="h-4 w-full rounded-full bg-gray-200">
                <div
                  className="h-4 rounded-full bg-green-500"
                  style={{
                    width: `${payments.length ? (stats.totalRevenue / (stats.totalRevenue + stats.refundedAmount + 1)) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statusCounts.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600">{item.label}</span>
                <div className="flex-1 h-6 rounded bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<Payment>
            columns={recentColumns}
            data={recentPayments}
            loading={loading}
            actions={recentActions}
            emptyMessage="No payments yet"
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
