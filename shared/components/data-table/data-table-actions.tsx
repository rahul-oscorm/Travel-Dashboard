'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/shared/lib'
import type { Action } from './types'

interface DataTableActionsProps {
  actions: Action[]
}

export function DataTableActions({ actions }: DataTableActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleActionClick = (action: Action) => {
    action.onClick()
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    'flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors',
                    action.variant === 'destructive'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {action.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
