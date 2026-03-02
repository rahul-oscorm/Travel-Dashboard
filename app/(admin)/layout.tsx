'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar, Navbar, Breadcrumb } from '@/shared/components'
import { useSidebar } from '@/shared/hooks'
import { useAuth } from '@/core/auth'
import { cn } from '@/shared/lib'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isCollapsed } = useSidebar()
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const hasHydrated = useAuth((state) => state._hasHydrated)

  useEffect(() => {
    if (!hasHydrated) return
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [hasHydrated, isAuthenticated, router])

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300',
          isCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6">
          <Breadcrumb className="mb-6" />
          {children}
        </div>
      </main>
    </div>
  )
}
