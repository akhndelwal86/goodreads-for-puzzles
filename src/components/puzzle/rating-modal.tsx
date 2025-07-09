'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { X, Star, Info, HelpCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { StarRating } from './star-rating'
import { cn } from '@/lib/utils'

interface Puzzle {
  id: string
  title: string
  brand?: { name: string }
  pieceCount: number
  imageUrl?: string
}

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  puzzle: Puzzle | null
  onSubmit?: (reviewData: ReviewFormData) => Promise<void>
}

interface ReviewFormData {
  rating: number
  reviewText: string
  looseFit?: number
  falseFit?: number
  shapeVersatility?: number
  finish?: number
  pickTest?: boolean
  pickTestExplanation?: string
  otherNotes?: string
}

export function RatingModal({ isOpen, onClose, puzzle, onSubmit }: RatingModalProps) {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    reviewText: '',
    looseFit: undefined,
    falseFit: undefined,
    shapeVersatility: undefined,
    finish: undefined,
    pickTest: undefined,
    pickTestExplanation: '',
    otherNotes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async () => {
    console.log('🎯 [DEBUG] handleSubmit called!')
    
    if (!puzzle) {
      console.log('❌ [DEBUG] No puzzle found, aborting')
      return
    }

    console.log('🎯 [DEBUG] Puzzle found:', puzzle)
    console.log('🎯 [DEBUG] Current form data:', formData)

    // Validation
    const newErrors: Record<string, string> = {}
    
    if (formData.rating === 0) {
      newErrors.rating = 'Overall rating is required'
    }
    
    if (formData.reviewText.length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters'
    }
    
    if (formData.reviewText.length > 1000) {
      newErrors.reviewText = 'Review must be less than 1000 characters'
    }

    console.log('🎯 [DEBUG] Validation errors:', newErrors)
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      console.log('❌ [DEBUG] Validation failed, aborting submission')
      return
    }

    console.log('✅ [DEBUG] Validation passed, starting submission...')
    setIsSubmitting(true)
    
    try {
      console.log('🎯 [DEBUG] Submitting review for puzzle:', puzzle.title)
      console.log('🎯 [DEBUG] Review data:', formData)
      console.log('🎯 [DEBUG] onSubmit function:', onSubmit)
      
      if (onSubmit) {
        console.log('🎯 [DEBUG] Using custom onSubmit function')
        await onSubmit(formData)
      } else {
        console.log('🎯 [DEBUG] Using default API call')
        
        const requestData = {
          puzzleId: puzzle.id,
          rating: formData.rating,
          reviewText: formData.reviewText,
          looseFit: formData.looseFit,
          falseFit: formData.falseFit,
          shapeVersatility: formData.shapeVersatility,
          finish: formData.finish,
          pickTest: formData.pickTest,
          pickTestExplanation: formData.pickTestExplanation,
          otherMetadataNotes: formData.otherNotes
        }
        
        console.log('🎯 [DEBUG] Request payload:', requestData)
        
        // Default API call
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        })
        
        console.log('🎯 [DEBUG] Response status:', response.status)
        console.log('🎯 [DEBUG] Response headers:', response.headers)
        
        const result = await response.json()
        console.log('🎯 [DEBUG] API response:', result)
        
        if (!response.ok) {
          console.log('❌ [DEBUG] Response not ok:', response.status, result)
          throw new Error(result.error || 'Failed to submit review')
        }
        
        console.log('✅ [DEBUG] Review submitted successfully!')
        
        // Show success message temporarily
        alert(`✅ Review submitted successfully!\n\nRating: ${formData.rating}/5\nReview: "${formData.reviewText.substring(0, 50)}..."\n\nCheck the browser console for debug details.`)
      }
      
      console.log('🎯 [DEBUG] Closing modal and resetting form')
      onClose()
      // Reset form
      setFormData({
        rating: 0,
        reviewText: '',
        looseFit: undefined,
        falseFit: undefined,
        shapeVersatility: undefined,
        finish: undefined,
        pickTest: undefined,
        pickTestExplanation: '',
        otherNotes: ''
      })
    } catch (error) {
      console.error('❌ [DEBUG] Error submitting review:', error)
      setErrors({ submit: `Failed to submit review: ${error instanceof Error ? error.message : 'Unknown error'}` })
    } finally {
      console.log('🎯 [DEBUG] Setting isSubmitting to false')
      setIsSubmitting(false)
    }
  }

  if (!user || !puzzle) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/90 backdrop-blur-sm max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-lg border-0 p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="sr-only">
            Rate {puzzle.title}
          </DialogTitle>
          <div className="flex items-center gap-4">
            {/* Puzzle Image */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {puzzle.imageUrl ? (
                <Image
                  src={puzzle.imageUrl}
                  alt={puzzle.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Star className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Puzzle Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {puzzle.title}
              </h2>
              <p className="text-sm text-gray-600">
                {puzzle.brand?.name || 'Unknown Brand'} • {puzzle.pieceCount} pieces
              </p>
            </div>
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Overall Rating - Required */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Overall Rating</h3>
              <span className="text-red-500 text-sm">*</span>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <StarRating
                value={formData.rating}
                onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                size="lg"
                label="How would you rate this puzzle overall?"
                className="mb-2"
              />
              {errors.rating && (
                <p className="text-red-500 text-sm mt-2">{errors.rating}</p>
              )}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Your Review</h3>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <Textarea
                placeholder="Share your experience with this puzzle..."
                value={formData.reviewText}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                className="min-h-24 border-gray-200 rounded-xl"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {formData.reviewText.length}/1000 characters
                </span>
                {errors.reviewText && (
                  <p className="text-red-500 text-xs">{errors.reviewText}</p>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Metadata - Collapsible */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-3 mb-4 w-full text-left hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors"
            >
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Advanced Details</h3>
              <span className="text-sm text-gray-500">(Optional)</span>
              <div className={cn(
                "ml-auto transform transition-transform",
                showAdvanced ? "rotate-180" : ""
              )}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {showAdvanced && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm space-y-6">
                {/* Fit Quality */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Fit Quality
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={formData.looseFit ? [formData.looseFit] : [3]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, looseFit: value[0] }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Very Loose</span>
                      <span>Perfect</span>
                      <span>Very Tight</span>
                    </div>
                  </div>
                </div>

                {/* False Fits */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    False Fit Frequency
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={formData.falseFit ? [formData.falseFit] : [3]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, falseFit: value[0] }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>No False Fits</span>
                      <span>Some</span>
                      <span>Many False Fits</span>
                    </div>
                  </div>
                </div>

                {/* Shape Versatility */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Shape Versatility
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={formData.shapeVersatility ? [formData.shapeVersatility] : [3]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, shapeVersatility: value[0] }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Very Similar</span>
                      <span>Varied</span>
                      <span>Highly Varied</span>
                    </div>
                  </div>
                </div>

                {/* Finish Quality */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Finish Quality
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={formData.finish ? [formData.finish] : [3]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, finish: value[0] }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Poor</span>
                      <span>Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pick Test */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Info className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Pick Test</h3>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <Switch
                  checked={formData.pickTest || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pickTest: checked }))}
                />
                <span className="text-sm font-medium text-gray-900">
                  Did this puzzle pass the pick test?
                </span>
                <div className="relative group">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    Can you pick up a piece and move it easily?
                  </div>
                </div>
              </div>
              
              {formData.pickTest !== undefined && (
                <Textarea
                  placeholder="Explain your pick test experience..."
                  value={formData.pickTestExplanation}
                  onChange={(e) => setFormData(prev => ({ ...prev, pickTestExplanation: e.target.value }))}
                  className="mt-3 min-h-16 border-gray-200 rounded-xl"
                  maxLength={200}
                />
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Additional Notes</h3>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <Textarea
                placeholder="Any other details about this puzzle?"
                value={formData.otherNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, otherNotes: e.target.value }))}
                className="min-h-20 border-gray-200 rounded-xl"
                maxLength={500}
              />
              <span className="text-xs text-gray-500 mt-2 block">
                {(formData.otherNotes || '').length}/500 characters
              </span>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 pt-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-12 font-medium rounded-xl"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-12 font-medium rounded-xl"
              disabled={isSubmitting || formData.rating === 0}
              title={formData.rating === 0 ? "Please select a rating first" : "Submit your review"}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                formData.rating === 0 ? 'Select Rating First' : 'Submit Review'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { Puzzle, ReviewFormData, RatingModalProps }
