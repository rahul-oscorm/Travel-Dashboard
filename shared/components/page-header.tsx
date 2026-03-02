import React from 'react'
import { cn } from '@/shared/lib'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
