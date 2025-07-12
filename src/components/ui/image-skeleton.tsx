import { cn } from "@/lib/utils"

interface ImageSkeletonProps {
  className?: string
  variant?: 'card' | 'list' | 'thumbnail'
  aspectRatio?: 'square' | 'landscape' | 'portrait'
}

export function ImageSkeleton({ 
  className, 
  variant = 'card',
  aspectRatio = 'square'
}: ImageSkeletonProps) {
  const getSkeletonClasses = () => {
    switch (variant) {
      case 'thumbnail':
        return "w-20 h-20 rounded-lg"
      case 'list':
        return "w-48 h-36 rounded-lg"
      case 'card':
      default:
        return aspectRatio === 'square' 
          ? "w-full h-48 rounded-xl"
          : aspectRatio === 'landscape'
          ? "w-full h-32 rounded-xl"
          : "w-full h-64 rounded-xl"
    }
  }

  return (
    <div className={cn(
      "relative overflow-hidden bg-slate-200",
      "before:absolute before:inset-0",
      "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      "before:translate-x-[-100%] before:animate-[shimmer_2s_infinite]",
      getSkeletonClasses(),
      className
    )}>
      {/* Optional content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-slate-300/50" />
      </div>
    </div>
  )
}

// Card skeleton for full puzzle card loading state
export function PuzzleCardSkeleton() {
  return (
    <div className="w-full max-w-sm glass-card border border-white/40 rounded-xl">
      <div className="p-5">
        {/* Image skeleton */}
        <ImageSkeleton variant="card" className="mb-4" />
        
        {/* Content skeleton */}
        <div className="space-y-3">
          {/* Title */}
          <div className="h-6 bg-slate-200 rounded animate-pulse" />
          
          {/* Brand */}
          <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
          </div>
          
          {/* Piece count and difficulty */}
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-16 animate-pulse" />
          </div>
          
          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <div className="flex-1 h-8 bg-slate-200 rounded animate-pulse" />
            <div className="flex-1 h-8 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

// List item skeleton for list view loading state
export function PuzzleListSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        {/* Image skeleton */}
        <ImageSkeleton variant="thumbnail" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-5 bg-slate-200 rounded animate-pulse" />
          
          {/* Brand */}
          <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
          
          {/* Stats row */}
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-12 animate-pulse" />
            <div className="h-4 bg-slate-200 rounded w-10 animate-pulse" />
          </div>
          
          {/* Difficulty badge */}
          <div className="h-5 bg-slate-200 rounded w-16 animate-pulse" />
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// Grid skeleton for loading multiple cards
export function PuzzleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <PuzzleCardSkeleton key={index} />
      ))}
    </div>
  )
}

// List skeleton for loading multiple list items
export function PuzzleListLoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <PuzzleListSkeleton key={index} />
      ))}
    </div>
  )
}