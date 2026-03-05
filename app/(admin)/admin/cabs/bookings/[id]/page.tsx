'use client'

import React, { useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@/shared/components'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatCurrency, formatDate } from '@/shared/lib'
import {
  bookings,
  users,
  drivers,
  vehicles,
  vehicleTypes,
  payments,
  trips,
} from '@/modules/cabs/mockData'
import { RideStatusBadge, DriverStatusBadge, VehicleStatusBadge, PaymentStatusBadge } from '@/modules/cabs/components'
import { CABS_MODULE_CONFIG } from '@/modules/cabs/config'

export default function BookingDetailPage(): React.ReactElement {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : undefined

  const resolved = useMemo(() => {
    const list = bookings ?? []
    const booking = id ? list.find((b) => b.id === id) : undefined
    if (!booking) return null
    const userList = users ?? []
    const driverList = drivers ?? []
    const vehicleList = vehicles ?? []
    const vehicleTypeList = vehicleTypes ?? []
    const paymentList = payments ?? []
    const tripList = trips ?? []
    const user = userList.find((u) => u.id === booking.userId)
    const driver = driverList.find((d) => d.id === booking.driverId)
    const vehicle = vehicleList.find((v) => v.id === booking.vehicleId)
    const vehicleType = vehicle
      ? vehicleTypeList.find((vt) => vt.id === vehicle.typeId)
      : undefined
    const payment = paymentList.find((p) => p.bookingId === booking.id)
    const trip = tripList.find((t) => t.bookingId === booking.id)
    return {
      booking,
      user,
      driver,
      vehicle,
      vehicleType,
      payment,
      trip,
    }
  }, [id])

  if (!id || !resolved) {
    return (
      <PageContainer>
        <PageHeader title="Booking not found" />
        <Link href={CABS_MODULE_CONFIG.routes.bookings}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </Link>
      </PageContainer>
    )
  }

  const { booking, user, driver, vehicle, vehicleType, payment, trip } = resolved

  return (
    <PageContainer>
      <PageHeader
        title={`Booking ${booking.id}`}
        description="Booking details"
        actions={
          <Link href={CABS_MODULE_CONFIG.routes.bookings}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Customer Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{user?.name ?? '—'}</p>
            <p className="text-sm text-gray-600">{user?.email ?? '—'}</p>
            <p className="text-sm text-gray-600">{user?.phone ?? '—'}</p>
            <p className="text-sm text-gray-600">Status: {user?.status ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{driver?.name ?? '—'}</p>
            <p className="text-sm text-gray-600">{driver?.phone ?? '—'}</p>
            <p className="text-sm text-gray-600">{driver?.city ?? '—'}</p>
            <p className="text-sm text-gray-600">Rating: {driver?.rating ?? '—'}</p>
            {driver && <DriverStatusBadge status={driver.status} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{vehicle?.plateNumber ?? '—'}</p>
            <p className="text-sm text-gray-600">Type: {vehicleType?.name ?? '—'}</p>
            <p className="text-sm text-gray-600">City: {vehicle?.city ?? '—'}</p>
            {vehicle && <VehicleStatusBadge status={vehicle.status} />}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Pickup & Drop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm"><span className="font-medium text-gray-700">Pickup:</span> {booking.pickupAddress}</p>
            <p className="text-sm"><span className="font-medium text-gray-700">Drop:</span> {booking.dropAddress}</p>
            <p className="text-sm text-gray-600">Pickup time: {formatDate(booking.pickupTime)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fare Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Estimated: {formatCurrency(booking.estimatedFare, 'INR')}</p>
            {trip && <p className="text-sm">Final: {formatCurrency(trip.finalFare, 'INR')}</p>}
            {trip && <p className="text-sm">Distance: {trip.distanceKm} km</p>}
            {trip && <p className="text-sm">Duration: {trip.durationMin} min</p>}
            <RideStatusBadge status={booking.status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {payment ? (
              <>
                <p className="text-sm font-medium text-gray-700">{formatCurrency(payment.amount, 'INR')}</p>
                <p className="text-sm text-gray-600">Method: {payment.method}</p>
                <p className="text-sm text-gray-600">TXN: {payment.transactionId}</p>
                <p className="text-sm text-gray-600">{formatDate(payment.createdAt)}</p>
                <PaymentStatusBadge status={payment.status} />
              </>
            ) : (
              <p className="text-sm text-gray-500">No payment record</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
