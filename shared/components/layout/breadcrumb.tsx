'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { useBreadcrumbs } from '@/shared/hooks'
import { cn } from '@/shared/lib'

interface BreadcrumbProps {
  className?: string
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const breadcrumbs = useBreadcrumbs()

  if (breadcrumbs.length === 0) return null

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      <Link
        href="/admin/dashboard"
        className="flex items-center text-gray-500 hover:text-gray-700"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((breadcrumb) => (
        <React.Fragment key={breadcrumb.href}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {breadcrumb.isActive ? (
            <span className="font-medium text-gray-900">{breadcrumb.label}</span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="text-gray-500 hover:text-gray-700"
            >
              {breadcrumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
