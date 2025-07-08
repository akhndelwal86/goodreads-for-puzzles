'use client'

import { useState, useEffect } from 'react'
import { Star, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUser } from '@clerk/nextjs'
import { useRatings } from '@/hooks/use-ratings'
import { cn } from '@/lib/utils'

interface QuickRatingModalProps {
  isOpen: boolean
  onClose: () => void
  puzzle: {
    id: string
    title: string
    brand?: { name: string }
    imageUrl?: string
    pieceCount: number
  }
}

export function QuickRatingModal({ isOpen, onClose, puzzle }: QuickRatingModalProps) {
  const { user } = useUser()
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { userReview, submitRating } = useRatings(puzzle.id)

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
  }

  const handleSubmit = async () => {
    if (!selectedRating || !user) return

    setIsSubmitting(true)
    try {
      await submitRating(selectedRating)
      setSubmitSuccess(true)
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedRating(0)
        setHoveredRating(0)
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Failed to submit rating:', error)
      alert('Failed to submit rating. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || selectedRating

  // If user already rated, show their rating
  if (userReview?.rating) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              You Already Rated This
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={puzzle.imageUrl || '/placeholder-puzzle.svg'}
                alt={puzzle.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-slate-800">{puzzle.title}</h3>
                <p className="text-sm text-slate-600">{puzzle.brand?.name}</p>
                <p className="text-xs text-slate-500">{puzzle.pieceCount.toLocaleString()} pieces</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 py-4">
              <span className="text-sm text-slate-600">Your rating:</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-5 w-5",
                      star <= userReview.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
                <span className="text-sm font-medium text-slate-700 ml-2">
                  ({userReview.rating}/5)
                </span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={onClose} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Rate This Puzzle
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Puzzle Info */}
          <div className="flex items-center space-x-4">
            <img
              src={puzzle.imageUrl || '/placeholder-puzzle.svg'}
              alt={puzzle.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-slate-800">{puzzle.title}</h3>
              <p className="text-sm text-slate-600">{puzzle.brand?.name}</p>
              <p className="text-xs text-slate-500">{puzzle.pieceCount.toLocaleString()} pieces</p>
            </div>
          </div>
          
          {/* Rating Interface */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-4">
                How would you rate this puzzle?
              </p>
              
              <div 
                className="flex items-center justify-center space-x-2"
                onMouseLeave={() => setHoveredRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-colors duration-150 hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onClick={() => handleRatingClick(star)}
                    disabled={isSubmitting || submitSuccess}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-all duration-150",
                        star <= displayRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 hover:text-amber-300"
                      )}
                    />
                  </button>
                ))}
              </div>
              
              {selectedRating > 0 && !submitSuccess && (
                <p className="text-sm text-slate-600 mt-2">
                  You selected {selectedRating} star{selectedRating !== 1 ? 's' : ''}
                </p>
              )}
              
              {submitSuccess && (
                <div className="flex items-center justify-center space-x-2 mt-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <p className="text-sm font-medium">Rating saved successfully!</p>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            {!submitSuccess && (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedRating || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 