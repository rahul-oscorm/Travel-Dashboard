import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export interface Breadcrumb {
  label: string
  href: string
  isActive: boolean
}

export function useBreadcrumbs(): Breadcrumb[] {
  const pathname = usePathname()

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    
    const breadcrumbs: Breadcrumb[] = segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      const isActive = index === segments.length - 1
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return { label, href, isActive }
    })

    return breadcrumbs
  }, [pathname])
}
