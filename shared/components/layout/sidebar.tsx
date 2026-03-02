'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib'
import { useSidebar } from '@/shared/hooks'
import { Button } from '../ui/button'
import { getEnabledModules } from '@/core/config'
import type { ModuleConfig } from '@/core/config'

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebar()
  const modules = getEnabledModules()

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    const enabled = getEnabledModules()
    const openKey = enabled.find(
      (m) => m.subRoutes && m.subRoutes.some((sr) => pathname === sr.route || pathname.startsWith(sr.route + '/'))
    )?.key
    if (openKey) {
      setExpandedKeys((prev) => new Set(prev).add(openKey))
    }
  }, [pathname])

  const toggleExpanded = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const renderModuleItem = (module: ModuleConfig) => {
    const Icon = module.icon
    const hasSubRoutes = module.subRoutes && module.subRoutes.length > 0
    const isExpanded = expandedKeys.has(module.key)
    const isParentActive = hasSubRoutes && module.subRoutes!.some((sr) => pathname === sr.route)

    if (hasSubRoutes && !isCollapsed) {
      return (
        <div key={module.key} className="space-y-0.5">
          <button
            type="button"
            onClick={() => toggleExpanded(module.key)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isParentActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">{module.name}</span>
            {module.badge && (
              <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                {module.badge}
              </span>
            )}
            <ChevronDown
              className={cn('h-4 w-4 flex-shrink-0 text-gray-500 transition-transform', isExpanded && 'rotate-180')}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-0.5 border-l-2 border-gray-200 pl-3">
              {module.subRoutes!.map((sub) => {
                const isSubActive = pathname === sub.route
                return (
                  <Link
                    key={sub.route}
                    href={sub.route}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isSubActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    {sub.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    if (hasSubRoutes && isCollapsed) {
      return (
        <Link
          key={module.key}
          href={module.route}
          className={cn(
            'flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            pathname.startsWith(module.route) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
          )}
          title={module.name}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
        </Link>
      )
    }

    const isActive = pathname === module.route
    return (
      <Link
        key={module.key}
        href={module.route}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100',
          isCollapsed && 'justify-center'
        )}
        title={isCollapsed ? module.name : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1">{module.name}</span>
            {module.badge && (
              <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
                {module.badge}
              </span>
            )}
          </>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!isCollapsed && (
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-sm font-bold text-white">ES</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                EasY SKYTRIP
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/admin/dashboard" className="flex items-center justify-center w-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-sm font-bold text-white">ES</span>
              </div>
            </Link>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {modules.map(renderModuleItem)}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className={cn('w-full', isCollapsed && 'px-0')}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="mr-2 h-5 w-5" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
