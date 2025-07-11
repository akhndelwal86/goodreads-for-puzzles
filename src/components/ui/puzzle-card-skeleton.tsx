import { cn } from '@/lib/utils'

interface PuzzleCardSkeletonProps {
  className?: string
}

export function PuzzleCardSkeleton({ className }: PuzzleCardSkeletonProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden animate-pulse",
      className
    )}>
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        
        {/* Brand skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        
        {/* Stats skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-gray-200 rounded flex-1" />
          <div className="h-8 bg-gray-200 rounded w-8" />
        </div>
      </div>
    </div>
  )
}

interface PuzzleCardGridSkeletonProps {
  count?: number
  className?: string
}

export function PuzzleCardGridSkeleton({ count = 6, className }: PuzzleCardGridSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <PuzzleCardSkeleton key={i} />
      ))}
    </div>
  )
}