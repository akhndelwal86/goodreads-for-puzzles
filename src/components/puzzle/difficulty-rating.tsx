'use client'

import { useState } from 'react'
import { Star, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

interface DifficultyRatingProps {
  currentRating?: number | null
  onRatingChange?: (rating: number) => void
  onRatingSubmit?: (rating: number) => Promise<void>
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  showSubmitButton?: boolean
  className?: string
  disabled?: boolean
}

const difficultyLabels = {
  1: 'Very Easy',
  2: 'Easy', 
  3: 'Medium',
  4: 'Hard',
  5: 'Very Hard'
}

const difficultyDescriptions = {
  1: 'Quick assembly, obvious piece placement',
  2: 'Straightforward with some challenges',
  3: 'Balanced difficulty, good for most puzzlers',
  4: 'Challenging, requires patience and skill',
  5: 'Extremely difficult, expert level'
}

export function DifficultyRating({
  currentRating,
  onRatingChange,
  onRatingSubmit,
  size = 'md',
  showLabels = true,
  showSubmitButton = false,
  className,
  disabled = false
}: DifficultyRatingProps) {
  const { user } = useUser()
  const [rating, setRating] = useState(currentRating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  }

  const handleStarClick = async (newRating: number) => {
    if (disabled || (!user && onRatingSubmit)) return
    
    setRating(newRating)
    
    // Call change handler if provided
    if (onRatingChange) {
      onRatingChange(newRating)
    }
    
    // Auto-submit if no submit button is shown
    if (!showSubmitButton && onRatingSubmit) {
      setIsSubmitting(true)
      try {
        await onRatingSubmit(newRating)
      } catch (error) {
        console.error('Failed to submit difficulty rating:', error)
        // Revert rating on error
        setRating(currentRating || 0)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleSubmit = async () => {
    if (!onRatingSubmit || !rating) return
    
    setIsSubmitting(true)
    try {
      await onRatingSubmit(rating)
    } catch (error) {
      console.error('Failed to submit difficulty rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || rating
  const currentLabel = displayRating > 0 ? difficultyLabels[displayRating as keyof typeof difficultyLabels] : ''
  const currentDescription = displayRating > 0 ? difficultyDescriptions[displayRating as keyof typeof difficultyDescriptions] : ''

  // Read-only mode for non-authenticated users when submission is expected
  if (!user && onRatingSubmit) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                sizeClasses[size],
                star <= (currentRating || 0)
                  ? "fill-violet-400 text-violet-400"
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
        {currentRating && showLabels && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200">
              {difficultyLabels[currentRating as keyof typeof difficultyLabels]}
            </Badge>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center space-x-2">
        <HelpCircle className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">
          How difficult is this puzzle?
        </span>
      </div>
      
      <div className="space-y-2">
        <div 
          className="flex items-center space-x-1"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={cn(
                "transition-colors duration-150 disabled:cursor-not-allowed",
                (isSubmitting || disabled) && "opacity-50"
              )}
              disabled={isSubmitting || disabled}
              onMouseEnter={() => setHoveredRating(star)}
              onClick={() => handleStarClick(star)}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  star <= displayRating
                    ? "fill-violet-400 text-violet-400"
                    : "text-gray-300 hover:text-violet-300"
                )}
              />
            </button>
          ))}
        </div>

        {/* Rating Label and Description */}
        {showLabels && displayRating > 0 && (
          <div className="space-y-1">
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200">
              {currentLabel}
            </Badge>
            <p className="text-xs text-slate-600">
              {currentDescription}
            </p>
          </div>
        )}

        {/* Submit Button */}
        {showSubmitButton && rating > 0 && rating !== currentRating && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-xs px-3 py-1 h-auto border-violet-200 text-violet-700 hover:bg-violet-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Difficulty'}
          </Button>
        )}
      </div>
    </div>
  )
} 