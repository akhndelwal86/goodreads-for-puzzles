'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Star, Heart, Clock, Zap } from 'lucide-react'
import Image from 'next/image'

interface QuickRatingModalProps {
  isOpen: boolean
  onClose: () => void
  puzzle: {
    id: string
    title: string
    brand: string
    piece_count: number
    main_image_url?: string
  }
  onSubmitRating: (puzzleId: string, ratings: QuickRating) => Promise<void>
}

export interface QuickRating {
  overall_rating: number
  difficulty_rating?: number
  quality_rating?: number
  enjoyment_rating?: number
}

export function QuickRatingModal({ isOpen, onClose, puzzle, onSubmitRating }: QuickRatingModalProps) {
  const [ratings, setRatings] = useState<QuickRating>({
    overall_rating: 0,
    difficulty_rating: 0,
    quality_rating: 0,
    enjoyment_rating: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStarClick = (category: keyof QuickRating, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: rating
    }))
  }

  const handleSubmit = async () => {
    if (ratings.overall_rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmitRating(puzzle.id, ratings)
      onClose()
      // Reset ratings for next use
      setRatings({
        overall_rating: 0,
        difficulty_rating: 0,
        quality_rating: 0,
        enjoyment_rating: 0
      })
    } catch (error) {
      console.error('Failed to submit rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({ 
    rating, 
    onRate, 
    icon: Icon = Star,
    color = 'yellow' 
  }: {
    rating: number
    onRate: (rating: number) => void
    icon?: any
    color?: string
  }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Icon
            className={`w-5 h-5 ${
              star <= rating
                ? color === 'yellow' 
                  ? 'fill-yellow-400 text-yellow-400'
                  : color === 'red'
                  ? 'fill-red-400 text-red-400'
                  : color === 'green'
                  ? 'fill-green-400 text-green-400'
                  : 'fill-blue-400 text-blue-400'
                : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Quick Rating
          </DialogTitle>
          <DialogDescription>
            Rate this puzzle to help others discover great puzzles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Puzzle Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            {puzzle.main_image_url ? (
              <Image
                src={puzzle.main_image_url}
                alt={puzzle.title}
                width={48}
                height={48}
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                <Star className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-900 truncate">{puzzle.title}</h3>
              <p className="text-sm text-slate-600">{puzzle.brand} • {puzzle.piece_count} pieces</p>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="space-y-4">
            {/* Overall Rating - Required */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">
                  {ratings.overall_rating > 0 ? `${ratings.overall_rating}/5` : ''}
                </span>
              </div>
              <StarRating
                rating={ratings.overall_rating}
                onRate={(rating) => handleStarClick('overall_rating', rating)}
              />
            </div>

            {/* Optional Quick Ratings */}
            <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Optional (help others even more):</p>
              
              {/* Difficulty */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-700">Difficulty</span>
                </div>
                <StarRating
                  rating={ratings.difficulty_rating || 0}
                  onRate={(rating) => handleStarClick('difficulty_rating', rating)}
                  color="orange"
                />
              </div>

              {/* Quality */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-700">Quality</span>
                </div>
                <StarRating
                  rating={ratings.quality_rating || 0}
                  onRate={(rating) => handleStarClick('quality_rating', rating)}
                  color="green"
                />
              </div>

              {/* Enjoyment */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-slate-700">Enjoyment</span>
                </div>
                <StarRating
                  rating={ratings.enjoyment_rating || 0}
                  onRate={(rating) => handleStarClick('enjoyment_rating', rating)}
                  icon={Heart}
                  color="red"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={ratings.overall_rating === 0 || isSubmitting}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 