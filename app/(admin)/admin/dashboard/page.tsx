import React from 'react'
import {
  PageHeader,
  PageContainer,
  StatCard,
  DashboardSection,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@/shared/components'
import {
  Plane,
  Hotel,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/shared/lib'

export default function DashboardPage() {
  const stats = {
    totalBookings: 3847,
    activeUsers: 1256,
    monthlyRevenue: 435890,
    completionRate: 94.5,
  }

  const quickActions = [
    { label: 'New Flight Booking', href: '/admin/flights/bookings', icon: Plane },
    { label: 'Manage Users', href: '/admin/users', icon: Users },
    { label: 'View Reports', href: '/admin/reports', icon: TrendingUp },
    { label: 'System Settings', href: '/admin/settings', icon: Activity },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Enterprise overview and analytics"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={Calendar}
          trend={{ value: 12.5, isPositive: true }}
          description="All-time bookings"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          description="Registered users"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
          description="This month's earnings"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={CheckCircle}
          trend={{ value: 2.1, isPositive: true }}
          description="Successful bookings"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection title="Quick Actions" description="Common tasks and operations">
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary-200">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{action.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </DashboardSection>

        <DashboardSection title="System Status" description="Platform health and performance">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">API Services</span>
                  </div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">Database</span>
                  </div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">Payment Gateway</span>
                  </div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium text-gray-700">Email Service</span>
                  </div>
                  <span className="text-sm text-yellow-600">Degraded</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </DashboardSection>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Plane className="h-5 w-5 text-primary-600" />
                <h4 className="font-semibold text-gray-900">Flights Module</h4>
              </div>
              <p className="mb-3 text-sm text-gray-600">
                Flight bookings and management system
              </p>
              <Link href="/admin/flights">
                <Button size="sm" variant="outline" className="w-full">
                  Open Module
                </Button>
              </Link>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 opacity-60">
              <div className="mb-2 flex items-center gap-2">
                <Hotel className="h-5 w-5 text-gray-400" />
                <h4 className="font-semibold text-gray-500">Hotels Module</h4>
              </div>
              <p className="mb-3 text-sm text-gray-500">
                Coming soon - Hotel reservations
              </p>
              <Button size="sm" variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 opacity-60">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <h4 className="font-semibold text-gray-500">Users Module</h4>
              </div>
              <p className="mb-3 text-sm text-gray-500">
                Coming soon - User management
              </p>
              <Button size="sm" variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
