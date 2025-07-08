'use client'

import { useState, useEffect } from 'react'
import { Star, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { useRatings } from '@/hooks/use-ratings'
import { cn } from '@/lib/utils'

interface AdvancedRatingModalProps {
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

interface RatingData {
  rating: number
  loose_fit?: number
  false_fit?: number
  shape_versatility?: number
  finish?: number
  review_text?: string
  other_metadata_notes?: string
}

export function AdvancedRatingModal({ isOpen, onClose, puzzle }: AdvancedRatingModalProps) {
  const { user } = useUser()
  const { userReview, submitAdvancedReview } = useRatings(puzzle.id)
  
  // Rating states for each category
  const [overallRating, setOverallRating] = useState(0)
  const [pieceFitRating, setPieceFitRating] = useState(0)
  const [falseFitRating, setFalseFitRating] = useState(0)
  const [shapeVarietyRating, setShapeVarietyRating] = useState(0)
  const [finishRating, setFinishRating] = useState(0)
  
  // Text fields
  const [reviewText, setReviewText] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)

  // Load existing review data when modal opens
  useEffect(() => {
    if (isOpen && userReview) {
      setOverallRating(userReview.rating || 0)
      setPieceFitRating(userReview.loose_fit || 0)
      setFalseFitRating(userReview.false_fit || 0)
      setShapeVarietyRating(userReview.shape_versatility || 0)
      setFinishRating(userReview.finish || 0)
      setReviewText(userReview.review_text || '')
      setAdditionalNotes(userReview.other_metadata_notes || '')
    } else if (isOpen && !userReview) {
      // Reset form for new review
      setOverallRating(0)
      setPieceFitRating(0)
      setFalseFitRating(0)
      setShapeVarietyRating(0)
      setFinishRating(0)
      setReviewText('')
      setAdditionalNotes('')
    }
  }, [isOpen, userReview])

  const handleStarClick = (category: string, rating: number) => {
    switch (category) {
      case 'overall':
        setOverallRating(rating)
        break
      case 'piece_fit':
        setPieceFitRating(rating)
        break
      case 'false_fit':
        setFalseFitRating(rating)
        break
      case 'shape_variety':
        setShapeVarietyRating(rating)
        break
      case 'finish':
        setFinishRating(rating)
        break
    }
  }

  const getDisplayRating = (category: string, baseRating: number) => {
    if (hoveredCategory === category && hoveredRating > 0) {
      return hoveredRating
    }
    return baseRating
  }

  const handleSubmit = async () => {
    if (!overallRating || !user) return

    setIsSubmitting(true)
    try {
      const reviewData: RatingData = {
        rating: overallRating,
        loose_fit: pieceFitRating > 0 ? pieceFitRating : undefined,
        false_fit: falseFitRating > 0 ? falseFitRating : undefined,
        shape_versatility: shapeVarietyRating > 0 ? shapeVarietyRating : undefined,
        finish: finishRating > 0 ? finishRating : undefined,
        review_text: reviewText.trim() || undefined,
        other_metadata_notes: additionalNotes.trim() || undefined
      }

      await submitAdvancedReview(reviewData)
      setSubmitSuccess(true)
      
      // Close modal after success message
      setTimeout(() => {
        setSubmitSuccess(false)
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Failed to submit advanced review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRatingRow = ({ 
    category, 
    label, 
    description, 
    rating, 
    required = false 
  }: { 
    category: string
    label: string
    description: string
    rating: number
    required?: boolean
  }) => (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg hover:bg-slate-100 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-base font-medium text-slate-900 flex items-center mb-1">
            {label}
            {required && (
              <span className="text-xs font-medium text-red-600 ml-2 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                Required
              </span>
            )}
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center space-x-3 ml-6">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-all duration-200 hover:scale-110 focus:outline-none focus:scale-110"
                onMouseEnter={() => {
                  setHoveredCategory(category)
                  setHoveredRating(star)
                }}
                onMouseLeave={() => {
                  setHoveredCategory('')
                  setHoveredRating(0)
                }}
                onClick={() => handleStarClick(category, star)}
                disabled={isSubmitting || submitSuccess}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-all duration-200",
                    star <= getDisplayRating(category, rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 hover:text-amber-300"
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="px-3 py-1 bg-violet-100 rounded-lg border border-violet-200">
              <span className="text-sm font-medium text-violet-700">{rating}/5</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader className="relative pb-6 border-b border-slate-100">
          <DialogTitle className="text-xl font-semibold text-slate-900 text-center">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0 h-10 w-10 p-0 hover:bg-slate-100 rounded-full"
          >
            <X className="h-5 w-5 text-slate-600" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Puzzle Info */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={puzzle.imageUrl || '/placeholder-puzzle.svg'}
                  alt={puzzle.title}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-200"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{puzzle.title}</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-violet-600">{puzzle.brand?.name}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm font-medium text-slate-700">{puzzle.pieceCount.toLocaleString()} pieces</span>
                </div>
              </div>
            </div>
          </div>
          
          {submitSuccess ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 flex items-center justify-center shadow-sm mb-4">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Review Submitted Successfully!</h3>
                <p className="text-sm text-emerald-700 mb-3">Thank you for sharing your experience with this puzzle.</p>
                <div className="flex items-center justify-center space-x-2 text-xs text-emerald-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="font-medium">Your review is now live and helping other puzzlers</span>
                </div>
              </div>
            </div>
          ) : (
                                      <>
               {/* Rating Categories */}
               <div className="bg-white border border-slate-200 p-6 rounded-xl">
                 <div className="text-center mb-6">
                   <h3 className="text-lg font-semibold text-slate-900 mb-2">Rate Your Experience</h3>
                   <p className="text-sm text-slate-600">Help other puzzlers by sharing your detailed thoughts</p>
                 </div>
               
                 <div className="space-y-4">
                   <StarRatingRow
                     category="overall"
                     label="Overall Rating"
                     description="Your overall satisfaction with this puzzle"
                     rating={overallRating}
                     required
                   />
                   
                   <StarRatingRow
                     category="piece_fit"
                     label="Piece Fit Quality"
                     description="How well do the pieces fit together?"
                     rating={pieceFitRating}
                   />
                   
                   <StarRatingRow
                     category="false_fit"
                     label="False Fits (Inverted)"
                     description="How often did pieces seem to fit but were wrong? (5 = no false fits)"
                     rating={falseFitRating}
                   />
                   
                   <StarRatingRow
                     category="shape_variety"
                     label="Piece Shape Variety"
                     description="How varied and interesting are the piece shapes?"
                     rating={shapeVarietyRating}
                   />
                   
                   <StarRatingRow
                     category="finish"
                     label="Image/Finish Quality"
                     description="Quality of the image printing and piece finish"
                     rating={finishRating}
                   />
                 </div>
               </div>

                                            {/* Written Review */}
               <div className="bg-white border border-slate-200 p-6 rounded-xl">
                 <div className="mb-4">
                   <label htmlFor="review-text" className="block text-lg font-semibold text-slate-900 mb-2">
                     Written Review
                   </label>
                   <p className="text-sm text-slate-600">
                     Share your thoughts about this puzzle (optional)
                   </p>
                 </div>
                 <Textarea
                   id="review-text"
                   value={reviewText}
                   onChange={(e) => setReviewText(e.target.value)}
                   placeholder="What did you like or dislike about this puzzle? Any tips for other puzzlers?"
                   className="min-h-[100px] text-sm border-slate-300 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200 resize-none"
                   disabled={isSubmitting}
                 />
               </div>

               {/* Additional Notes */}
               <div className="bg-white border border-slate-200 p-6 rounded-xl">
                 <div className="mb-4">
                   <label htmlFor="additional-notes" className="block text-lg font-semibold text-slate-900 mb-2">
                     Additional Notes
                   </label>
                   <p className="text-sm text-slate-600">
                     Any other details about your experience (optional)
                   </p>
                 </div>
                 <Textarea
                   id="additional-notes"
                   value={additionalNotes}
                   onChange={(e) => setAdditionalNotes(e.target.value)}
                   placeholder="Manufacturing defects, missing pieces, packaging issues, etc."
                   className="min-h-[80px] text-sm border-slate-300 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all duration-200 resize-none"
                   disabled={isSubmitting}
                 />
               </div>

                                            {/* Submit Buttons */}
               <div className="flex space-x-4 pt-6 border-t border-slate-100">
                 <Button
                   variant="outline"
                   onClick={onClose}
                   disabled={isSubmitting}
                   className="flex-1 h-10 text-sm font-medium border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                 >
                   Cancel
                 </Button>
                 <Button
                   onClick={handleSubmit}
                   disabled={!overallRating || isSubmitting}
                   className="flex-1 h-10 text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isSubmitting ? (
                     <div className="flex items-center space-x-2">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <span>Submitting...</span>
                     </div>
                   ) : (
                     userReview ? 'Update Review' : 'Submit Review'
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