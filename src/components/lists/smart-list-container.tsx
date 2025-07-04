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
    <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 p-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {children}
        </div>
      )}

      {/* View All Button */}
      {onViewAll && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button 
            variant="ghost" 
            onClick={onViewAll}
            className="w-full justify-center gap-2 text-gray-600 hover:text-gray-900"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 