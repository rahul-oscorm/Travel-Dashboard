'use client'

import React, { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react'
import { cn } from '@/shared/lib'
import { Button } from '../ui/button'
import { EmptyState } from '../empty-state'
import { TableSkeleton } from '../skeleton-loader'
import type { DataTableProps } from './types'
import { DataTableActions } from './data-table-actions'

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  onSort,
  sortKey,
  sortDirection,
  actions,
  emptyMessage = 'No data available',
  emptyIcon,
}: DataTableProps<T>) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const handleSort = (key: string) => {
    if (!onSort) return

    const newDirection =
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, newDirection)
  }

  const getSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary-600" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary-600" />
    )
  }

  if (loading) {
    return <TableSkeleton rows={5} />
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyMessage}
        description="Try adjusting your filters or search criteria"
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500',
                    column.width && `w-${column.width}`
                  )}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center hover:text-gray-700"
                    >
                      {column.label}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
                className="transition-colors hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <DataTableActions actions={actions(row)} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
