'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MessageSquare, BarChart3 } from 'lucide-react'
import { QuickRating, AdvancedRatingModal, DifficultyRating } from './rating'
import { useRatings, useDifficultyRating } from '@/hooks/use-ratings'

interface RatingExampleProps {
  puzzleId: string
  puzzleTitle: string
  puzzleLogId?: string // For difficulty rating during puzzle logging
  context: 'home' | 'browse' | 'detail' | 'logging'
}

export function RatingExample({ 
  puzzleId, 
  puzzleTitle, 
  puzzleLogId,
  context 
}: RatingExampleProps) {
  const [showAdvancedModal, setShowAdvancedModal] = useState(false)
  
  // Main ratings hook
  const {
    userReview,
    reviews,
    loading,
    submitting,
    submitRating,
    submitAdvancedReview,
    averageRating,
    totalReviews
  } = useRatings(puzzleId)

  // Difficulty rating hook (for puzzle logging)
  const { 
    submitDifficultyRating, 
    submitting: difficultySubmitting 
  } = useDifficultyRating(puzzleLogId || '')

  const handleQuickRating = async (rating: number) => {
    try {
      await submitRating(rating)
      console.log('Quick rating submitted successfully!')
    } catch (error) {
      alert('Failed to submit rating. Please try again.')
    }
  }

  const handleAdvancedReview = async (reviewData: any) => {
    try {
      await submitAdvancedReview(reviewData)
      console.log('Advanced review submitted successfully!')
    } catch (error) {
      alert('Failed to submit review. Please try again.')
    }
  }

  const handleDifficultyRating = async (rating: number) => {
    try {
      await submitDifficultyRating(rating)
      console.log('Difficulty rating submitted successfully!')
    } catch (error) {
      alert('Failed to submit difficulty rating. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Context-based rating display */}
      <Card className="glass-card border border-white/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Rating System Demo - {context.charAt(0).toUpperCase() + context.slice(1)} Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Context: Home/Browse Pages - Quick Rating */}
          {(context === 'home' || context === 'browse') && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-800">Quick Rating</h3>
              <p className="text-sm text-slate-600">
                Fast rating for browsing - overall rating only
              </p>
              <div className="flex items-center space-x-4">
                <QuickRating
                  puzzleId={puzzleId}
                  currentRating={userReview?.rating}
                  onRatingSubmit={handleQuickRating}
                  showSubmitButton={false} // Auto-submit on click
                  size="md"
                />
                {averageRating > 0 && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    {averageRating} avg ({totalReviews} reviews)
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Context: Detail Pages - Full Rating Options */}
          {context === 'detail' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">Puzzle Ratings</h3>
                <div className="flex items-center space-x-4">
                  <QuickRating
                    puzzleId={puzzleId}
                    currentRating={userReview?.rating}
                    onRatingSubmit={handleQuickRating}
                    showSubmitButton={true}
                    size="lg"
                  />
                  {averageRating > 0 && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                        {averageRating} average
                      </Badge>
                      <span className="text-sm text-slate-600">
                        ({totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowAdvancedModal(true)}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {userReview ? 'Edit Review' : 'Write Review'}
                </Button>
                
                {userReview && (
                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                    You've reviewed this puzzle
                  </Badge>
                )}
              </div>

              {/* Show existing review summary */}
              {userReview && (
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <h4 className="font-medium text-slate-800 mb-2">Your Review</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Overall: {userReview.rating}/5</div>
                    {userReview.loose_fit && <div>Fit: {userReview.loose_fit}/5</div>}
                    {userReview.false_fit && <div>False Fits: {userReview.false_fit}/5</div>}
                    {userReview.shape_versatility && <div>Shape Variety: {userReview.shape_versatility}/5</div>}
                    {userReview.finish && <div>Finish: {userReview.finish}/5</div>}
                  </div>
                  {userReview.review_text && (
                    <p className="text-sm text-slate-600 mt-2">
                      "{userReview.review_text}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Context: Puzzle Logging - Difficulty Rating */}
          {context === 'logging' && puzzleLogId && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-violet-500" />
                Difficulty Assessment
              </h3>
              <p className="text-sm text-slate-600">
                Rate the difficulty while working on this puzzle
              </p>
              <DifficultyRating
                onRatingSubmit={handleDifficultyRating}
                showLabels={true}
                showSubmitButton={true}
                disabled={difficultySubmitting}
              />
            </div>
          )}

          {/* All Reviews Display (for detail pages) */}
          {context === 'detail' && reviews.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Community Reviews</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-3 bg-white border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {review.users?.username || 'Anonymous'}
                        </span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.review_text && (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {review.review_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading/Submitting States */}
          {(loading || submitting || difficultySubmitting) && (
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-600">
                  {loading && 'Loading reviews...'}
                  {submitting && 'Submitting rating...'}
                  {difficultySubmitting && 'Saving difficulty...'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Rating Modal */}
      <AdvancedRatingModal
        isOpen={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
        puzzleId={puzzleId}
        puzzleTitle={puzzleTitle}
        currentReview={userReview}
        onSubmit={handleAdvancedReview}
      />
    </div>
  )
}

/* 
USAGE EXAMPLES:

// 1. Home/Browse Pages - Quick Rating Only
<RatingExample 
  puzzleId="puzzle-123" 
  puzzleTitle="Beautiful Landscape"
  context="home" 
/>

// 2. Puzzle Detail Page - Full Rating System  
<RatingExample 
  puzzleId="puzzle-123" 
  puzzleTitle="Beautiful Landscape"
  context="detail" 
/>

// 3. Puzzle Logging - Difficulty Rating
<RatingExample 
  puzzleId="puzzle-123" 
  puzzleTitle="Beautiful Landscape"
  puzzleLogId="log-456"
  context="logging" 
/>

// 4. Browse Page - Quick Rating with Stats
<RatingExample 
  puzzleId="puzzle-123" 
  puzzleTitle="Beautiful Landscape"
  context="browse" 
/>
*/ 