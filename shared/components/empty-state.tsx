import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-primary-50 p-3">
          <Icon className="h-8 w-8 text-primary-600" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
