'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

interface QuickRatingProps {
  puzzleId: string
  currentRating?: number | null
  onRatingSubmit?: (rating: number) => Promise<void>
  showSubmitButton?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function QuickRating({ 
  puzzleId, 
  currentRating, 
  onRatingSubmit,
  showSubmitButton = true,
  size = 'md',
  className 
}: QuickRatingProps) {
  const { user } = useUser()
  const [rating, setRating] = useState(currentRating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }

  const handleStarClick = async (newRating: number) => {
    if (!user) return
    
    setRating(newRating)
    
    // Auto-submit if no submit button is shown
    if (!showSubmitButton && onRatingSubmit) {
      setIsSubmitting(true)
      try {
        await onRatingSubmit(newRating)
      } catch (error) {
        console.error('Failed to submit rating:', error)
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
      console.error('Failed to submit rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || rating

  if (!user) {
    // Show read-only rating for non-authenticated users
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= (currentRating || 0)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            )}
          />
        ))}
        {currentRating && (
          <span className="text-sm text-slate-600 ml-1">
            ({currentRating})
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
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
              isSubmitting && "opacity-50"
            )}
            disabled={isSubmitting}
            onMouseEnter={() => setHoveredRating(star)}
            onClick={() => handleStarClick(star)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                star <= displayRating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300 hover:text-amber-300"
              )}
            />
          </button>
        ))}
      </div>
      
      {rating > 0 && (
        <span className="text-sm text-slate-600">
          ({rating})
        </span>
      )}

      {showSubmitButton && rating > 0 && rating !== currentRating && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="text-xs px-2 py-1 h-auto"
        >
          {isSubmitting ? 'Saving...' : 'Rate'}
        </Button>
      )}
    </div>
  )
} 