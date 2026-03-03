'use client'

import React, { useState, useMemo } from 'react'
import {
  PageContainer,
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Input,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/shared/components'
import { formatCurrency } from '@/shared/lib'

type TabId =
  | 'general'
  | 'business'
  | 'commission'
  | 'surge'
  | 'payment'
  | 'roles'
  | 'branding'

type CurrencyOption = 'INR' | 'USD'
type CommissionTypeOption = 'percentage' | 'fixed'

const TIMEZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Asia/Dubai',
  'Australia/Sydney',
]

const ROLES = ['super_admin', 'manager', 'support'] as const
type RoleId = (typeof ROLES)[number]

const PERMISSIONS = [
  'canCancelBooking',
  'canRefund',
  'canEditVehicleType',
  'canDeleteDriver',
  'canViewFinancialReports',
] as const
type PermissionId = (typeof PERMISSIONS)[number]

type RolePermissions = Record<RoleId, Record<PermissionId, boolean>>

const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  super_admin: {
    canCancelBooking: true,
    canRefund: true,
    canEditVehicleType: true,
    canDeleteDriver: true,
    canViewFinancialReports: true,
  },
  manager: {
    canCancelBooking: true,
    canRefund: true,
    canEditVehicleType: true,
    canDeleteDriver: false,
    canViewFinancialReports: true,
  },
  support: {
    canCancelBooking: true,
    canRefund: false,
    canEditVehicleType: false,
    canDeleteDriver: false,
    canViewFinancialReports: false,
  },
}

const PERMISSION_LABELS: Record<PermissionId, string> = {
  canCancelBooking: 'Can Cancel Booking',
  canRefund: 'Can Refund',
  canEditVehicleType: 'Can Edit Vehicle Type',
  canDeleteDriver: 'Can Delete Driver',
  canViewFinancialReports: 'Can View Financial Reports',
}

export default function SettingsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>('general')

  // General
  const [appName, setAppName] = useState('EXY SKYTRIP')
  const [supportEmail, setSupportEmail] = useState('support@exyskytrip.com')
  const [supportPhone, setSupportPhone] = useState('+91 1800 123 4567')
  const [defaultCurrency, setDefaultCurrency] = useState<CurrencyOption>('INR')
  const [timezone, setTimezone] = useState('Asia/Kolkata')

  // Business
  const [minFare, setMinFare] = useState(40)
  const [baseFare, setBaseFare] = useState(60)
  const [perKmRate, setPerKmRate] = useState(15)
  const [perMinRate, setPerMinRate] = useState(2.5)
  const [cancellationFee, setCancellationFee] = useState(50)
  const [instantBooking, setInstantBooking] = useState(true)
  const [allowCash, setAllowCash] = useState(true)

  // Commission
  const [commissionType, setCommissionType] = useState<CommissionTypeOption>('percentage')
  const [commissionValue, setCommissionValue] = useState(15)
  const [gstOnCommission, setGstOnCommission] = useState(18)
  const [driverBonus, setDriverBonus] = useState(false)

  // Surge
  const [surgeEnabled, setSurgeEnabled] = useState(true)
  const [peakStartTime, setPeakStartTime] = useState('08:00')
  const [peakEndTime, setPeakEndTime] = useState('10:00')
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.5)
  const [rainModeMultiplier, setRainModeMultiplier] = useState(1.8)
  const [weekendMultiplier, setWeekendMultiplier] = useState(1.2)

  // Payment
  const [enableUpi, setEnableUpi] = useState(true)
  const [enableCard, setEnableCard] = useState(true)
  const [enableCash, setEnableCash] = useState(true)
  const [enableWallet, setEnableWallet] = useState(false)
  const [refundProcessingDays, setRefundProcessingDays] = useState(5)
  const [autoRefundFailed, setAutoRefundFailed] = useState(true)

  // Roles
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(DEFAULT_ROLE_PERMISSIONS)

  // Branding
  const [primaryColor, setPrimaryColor] = useState('#2563eb')
  const [logoUrl, setLogoUrl] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')

  const handleRolePermissionChange = (role: RoleId, permission: PermissionId, checked: boolean) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: checked,
      },
    }))
  }

  const commissionPreview = useMemo(() => {
    const fare = 1000
    const commValue = Number(commissionValue) || 0
    const gst = Number(gstOnCommission) || 0
    let platformEarns: number
    if (commissionType === 'percentage') {
      const beforeGst = (fare * commValue) / 100
      const gstAmount = (beforeGst * gst) / 100
      platformEarns = beforeGst + gstAmount
    } else {
      const beforeGst = commValue
      const gstAmount = (beforeGst * gst) / 100
      platformEarns = beforeGst + gstAmount
    }
    const driverEarns = fare - (commissionType === 'percentage' ? (fare * commValue) / 100 : commValue)
    return { fare, platformEarns, driverEarns }
  }, [commissionType, commissionValue, gstOnCommission])

  const surgePreview = useMemo(() => {
    const base = 500
    const mult = Number(surgeMultiplier) || 1
    const final = base * mult
    return { base, multiplier: mult, final }
  }, [surgeMultiplier])

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Application and business configuration"
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="surge">Surge Pricing</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Application Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Application Name</label>
                  <Input
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Application Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Support Email</label>
                  <Input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Support Phone</label>
                  <Input
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    placeholder="+91 1800 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Default Currency</label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value as CurrencyOption)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Ride Business Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Minimum Fare</label>
                  <Input
                    type="number"
                    min={0}
                    value={minFare}
                    onChange={(e) => setMinFare(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Base Fare</label>
                  <Input
                    type="number"
                    min={0}
                    value={baseFare}
                    onChange={(e) => setBaseFare(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Per KM Rate</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={perKmRate}
                    onChange={(e) => setPerKmRate(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Per Minute Rate</label>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    value={perMinRate}
                    onChange={(e) => setPerMinRate(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cancellation Fee</label>
                  <Input
                    type="number"
                    min={0}
                    value={cancellationFee}
                    onChange={(e) => setCancellationFee(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={instantBooking}
                    onCheckedChange={setInstantBooking}
                  />
                  <span className="text-sm font-medium text-gray-700">Enable Instant Booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={allowCash} onCheckedChange={setAllowCash} />
                  <span className="text-sm font-medium text-gray-700">Allow Cash Payment</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <CardTitle>Platform Commission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Commission Type</label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value as CommissionTypeOption)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Commission Value {commissionType === 'percentage' ? '(%)' : '(fixed amount)'}
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={commissionValue}
                    onChange={(e) => setCommissionValue(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">GST on Commission (%)</label>
                  <Input
                    type="number"
                    min={0}
                    value={gstOnCommission}
                    onChange={(e) => setGstOnCommission(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center gap-3 sm:items-end">
                  <Switch checked={driverBonus} onCheckedChange={setDriverBonus} />
                  <span className="text-sm font-medium text-gray-700">Enable Driver Bonus</span>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="mb-2 text-sm font-medium text-gray-700">Preview (Fare ₹{commissionPreview.fare})</p>
                <p className="text-sm text-gray-600">
                  Platform earns {formatCurrency(commissionPreview.platformEarns, 'INR')} → Driver earns{' '}
                  {formatCurrency(commissionPreview.driverEarns, 'INR')}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="surge">
          <Card>
            <CardHeader>
              <CardTitle>Surge Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Switch checked={surgeEnabled} onCheckedChange={setSurgeEnabled} />
                <span className="text-sm font-medium text-gray-700">Enable Surge</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Peak Start Time</label>
                  <Input
                    type="time"
                    value={peakStartTime}
                    onChange={(e) => setPeakStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Peak End Time</label>
                  <Input
                    type="time"
                    value={peakEndTime}
                    onChange={(e) => setPeakEndTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Surge Multiplier</label>
                  <Input
                    type="number"
                    min={1}
                    step={0.1}
                    value={surgeMultiplier}
                    onChange={(e) => setSurgeMultiplier(Number(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rain Mode Multiplier</label>
                  <Input
                    type="number"
                    min={1}
                    step={0.1}
                    value={rainModeMultiplier}
                    onChange={(e) => setRainModeMultiplier(Number(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Weekend Multiplier</label>
                  <Input
                    type="number"
                    min={1}
                    step={0.1}
                    value={weekendMultiplier}
                    onChange={(e) => setWeekendMultiplier(Number(e.target.value) || 1)}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="mb-2 text-sm font-medium text-gray-700">Live Preview</p>
                <p className="text-sm text-gray-600">
                  Base Fare {formatCurrency(surgePreview.base, 'INR')} × {surgePreview.multiplier} = Final Fare{' '}
                  {formatCurrency(surgePreview.final, 'INR')}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <Switch checked={enableUpi} onCheckedChange={setEnableUpi} />
                  <span className="text-sm font-medium text-gray-700">Enable UPI</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={enableCard} onCheckedChange={setEnableCard} />
                  <span className="text-sm font-medium text-gray-700">Enable Card</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={enableCash} onCheckedChange={setEnableCash} />
                  <span className="text-sm font-medium text-gray-700">Enable Cash</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={enableWallet} onCheckedChange={setEnableWallet} />
                  <span className="text-sm font-medium text-gray-700">Enable Wallet</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Refund Processing Time (days)</label>
                  <Input
                    type="number"
                    min={1}
                    value={refundProcessingDays}
                    onChange={(e) => setRefundProcessingDays(Number(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-center gap-3 sm:items-end pb-2">
                  <Switch checked={autoRefundFailed} onCheckedChange={setAutoRefundFailed} />
                  <span className="text-sm font-medium text-gray-700">Auto Refund Failed Rides</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Admin Role Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 pr-4 text-left font-medium text-gray-700">Permission</th>
                      {ROLES.map((role) => (
                        <th key={role} className="px-4 pb-3 text-left font-medium text-gray-700 capitalize">
                          {role.replace('_', ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMISSIONS.map((perm) => (
                      <tr key={perm} className="border-b border-gray-100">
                        <td className="py-3 pr-4 text-gray-700">{PERMISSION_LABELS[perm]}</td>
                        {ROLES.map((role) => (
                          <td key={role} className="px-4 py-3">
                            <Switch
                              checked={rolePermissions[role][perm]}
                              onCheckedChange={(checked) =>
                                handleRolePermissionChange(role, perm, checked)
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Logo URL</label>
                  <Input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Favicon URL</label>
                  <Input
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-3 text-sm font-medium text-gray-700">Preview</p>
                <div
                  className="h-20 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary color preview
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
