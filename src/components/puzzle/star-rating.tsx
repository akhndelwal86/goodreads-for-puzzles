'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  max?: number
  label?: string
  description?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeConfig = {
  sm: {
    star: 'w-4 h-4',
    container: 'space-x-1'
  },
  md: {
    star: 'w-5 h-5',
    container: 'space-x-1.5'
  },
  lg: {
    star: 'w-6 h-6',
    container: 'space-x-2'
  }
}

export function StarRating({ 
  value, 
  onChange, 
  max = 5, 
  label, 
  description,
  className, 
  size = 'md' 
}: StarRatingProps) {
  const config = sizeConfig[size]

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div>
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={cn('flex items-center', config.container)}>
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1
          const isFilled = starValue <= value
          const isHovered = false // We'll add hover state if needed
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => {
                // Could add hover preview here
              }}
              className={cn(
                'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded',
                'hover:scale-110 active:scale-95'
              )}
              aria-label={`Rate ${starValue} out of ${max} stars`}
            >
              <Star
                className={cn(
                  config.star,
                  'transition-colors duration-150',
                  isFilled 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'fill-transparent text-gray-300 hover:text-yellow-300'
                )}
              />
            </button>
          )
        })}
        
        {value > 0 && (
          <span className="ml-3 text-sm text-muted-foreground">
            {value} out of {max}
          </span>
        )}
      </div>
    </div>
  )
} 