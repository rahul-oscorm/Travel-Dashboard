'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components'
import { useAuth } from '@/core/auth'
import { LogIn, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuth((state) => state.login)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 shadow-lg">
            <span className="text-2xl font-bold text-white">ES</span>
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to EasY SKYTRIP Admin Panel</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="admin@easyskytrip.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold text-gray-700">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div>
                <p className="font-medium">Admin:</p>
                <p>Email: admin@easyskytrip.com</p>
                <p>Password: admin123</p>
              </div>
              <div>
                <p className="font-medium">Manager:</p>
                <p>Email: manager@easyskytrip.com</p>
                <p>Password: manager123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
