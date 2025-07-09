'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StarRating } from './star-rating'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

interface Puzzle {
  id: string
  title: string
  brand: { name: string }
  image_url?: string
}

interface SimpleRatingModalProps {
  isOpen: boolean
  onClose: () => void
  puzzle: Puzzle
}

export function SimpleRatingModal({ isOpen, onClose, puzzle }: SimpleRatingModalProps) {
  const { user } = useUser()
  const [rating, setRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (!user) {
      setError('Please sign in to rate puzzles')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puzzleId: puzzle.id,
          rating: rating,
          reviewText: `Quick rating: ${rating} stars`, // Simple default text for quick ratings
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit rating')
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        // Reset state
        setRating(0)
        setSuccess(false)
        setError('')
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      // Reset state
      setRating(0)
      setSuccess(false)
      setError('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Rate this Puzzle
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Puzzle Info */}
          <div className="flex items-center gap-3">
            {puzzle.image_url && (
              <img
                src={puzzle.image_url}
                alt={puzzle.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-medium text-gray-900">{puzzle.title}</h3>
              <p className="text-sm text-gray-600">{puzzle.brand.name}</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="text-center py-4">
              <div className="text-emerald-600 text-lg font-medium">
                ✅ Rating submitted successfully!
              </div>
            </div>
          )}

          {!success && (
            <>
              {/* Star Rating */}
              <div className="text-center space-y-2">
                <p className="text-gray-600">How would you rate this puzzle?</p>
                <StarRating
                  value={rating}
                  onChange={setRating}
                  size="lg"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 h-12 font-medium rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-12 font-medium rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Rating'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 