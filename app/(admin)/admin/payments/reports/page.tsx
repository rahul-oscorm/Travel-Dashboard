'use client'

import React, { useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/shared/components'
import { formatCurrency } from '@/shared/lib'
import { usePayments, useRefunds } from '@/modules/payments/hooks'
import type { PaymentModule, PaymentMethod } from '@/modules/payments/types'

export default function PaymentReportsPage() {
  const { data: payments } = usePayments()
  const { data: refunds } = useRefunds()

  const dailyRevenue = useMemo(() => {
    const byDay: Record<string, number> = {}
    payments
      .filter((p) => p.status === 'SUCCESS')
      .forEach((p) => {
        const day = p.createdAt
        byDay[day] = (byDay[day] || 0) + p.amount
      })
    return Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
  }, [payments])

  const monthlyRevenue = useMemo(() => {
    const byMonth: Record<string, number> = {}
    payments
      .filter((p) => p.status === 'SUCCESS')
      .forEach((p) => {
        const month = p.createdAt.slice(0, 7)
        byMonth[month] = (byMonth[month] || 0) + p.amount
      })
    return Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b))
  }, [payments])

  const moduleRevenue = useMemo(() => {
    const mods: PaymentModule[] = ['flight', 'cab', 'hotel']
    return mods.map((module) => ({
      module,
      amount: payments
        .filter((p) => p.module === module && p.status === 'SUCCESS')
        .reduce((sum, p) => sum + p.amount, 0),
    }))
  }, [payments])

  const methodDistribution = useMemo(() => {
    const methods: PaymentMethod[] = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet']
    const total = payments.length || 1
    return methods.map((method) => ({
      method,
      count: payments.filter((p) => p.paymentMethod === method).length,
      pct: (payments.filter((p) => p.paymentMethod === method).length / total) * 100,
    }))
  }, [payments])

  const refundTrends = useMemo(() => {
    const byStatus = { REQUESTED: 0, PROCESSING: 0, COMPLETED: 0, REJECTED: 0 }
    refunds.forEach((r) => {
      byStatus[r.status as keyof typeof byStatus]++
    })
    return Object.entries(byStatus)
  }, [refunds])

  const maxDaily = Math.max(...dailyRevenue.map(([, v]) => v), 1)
  const maxModule = Math.max(...moduleRevenue.map((r) => r.amount), 1)

  return (
    <PageContainer>
      <PageHeader
        title="Payment Reports"
        description="Revenue and payment analytics"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dailyRevenue.length ? (
              dailyRevenue.map(([day, amount]) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-gray-600">{day}</span>
                  <div className="flex-1 h-6 rounded bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded bg-primary-500"
                      style={{ width: `${(amount / maxDaily) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(amount, 'INR')}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {monthlyRevenue.length ? (
              monthlyRevenue.map(([month, amount]) => (
                <div key={month} className="flex justify-between text-sm">
                  <span className="text-gray-600">{month}</span>
                  <span className="font-medium">{formatCurrency(amount, 'INR')}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moduleRevenue.map(({ module, amount }) => (
              <div key={module} className="flex items-center gap-3">
                <span className="w-20 capitalize text-sm text-gray-600">{module}</span>
                <div className="flex-1 h-6 rounded bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded bg-primary-600"
                    style={{ width: `${(amount / maxModule) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-24 text-right">
                  {formatCurrency(amount, 'INR')}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {methodDistribution.map(({ method, count, pct }) => (
              <div key={method} className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-600">{method}</span>
                <div className="flex-1 h-5 rounded bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded bg-blue-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Refund Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            {refundTrends.map(([status, count]) => (
              <div
                key={status}
                className="rounded-lg border border-gray-200 p-4 text-center"
              >
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-500 capitalize">{status.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
