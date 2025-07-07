import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface SmartListContainerProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  onViewAll?: () => void
  isLoading?: boolean
  className?: string
}

export function SmartListContainer({ 
  title, 
  icon, 
  children, 
  onViewAll, 
  isLoading = false,
  className 
}: SmartListContainerProps) {
  return (
    <div className={cn("bg-white/80 rounded-xl shadow-sm border border-gray-200/50 p-4", className)}>
      {/* Header */}
      <header className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/80">
          {icon}
        </div>
        <h2
          className="text-base font-medium text-gray-900"
          id={`smart-list-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {title}
        </h2>
      </header>

      {/* Content */}
{isLoading ? (
  <div className="space-y-3" role="status" aria-label="Loading content">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="animate-pulse" aria-hidden="true">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-12 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
    <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {children}
        </div>
      )}

      {/* View All Button */}
      {onViewAll && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Button 
            variant="ghost" 
            onClick={onViewAll}
            className="w-full justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm h-8"
            aria-label={`View all ${title.toLowerCase()}`}
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
} 
