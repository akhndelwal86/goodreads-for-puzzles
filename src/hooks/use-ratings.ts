'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface Review {
  id: string
  rating: number
  loose_fit?: number
  false_fit?: number
  shape_versatility?: number
  finish?: number
  review_text?: string
  other_metadata_notes?: string
  created_at: string
  users?: {
    username: string
    avatar_url?: string
  }
}

interface ReviewData {
  rating: number
  loose_fit?: number
  false_fit?: number
  shape_versatility?: number
  finish?: number
  review_text?: string
  other_metadata_notes?: string
}

interface UseRatingsReturn {
  // Current user's review
  userReview: Review | null
  // All reviews for the puzzle
  reviews: Review[]
  // Loading states
  loading: boolean
  submitting: boolean
  // Functions
  submitRating: (rating: number) => Promise<void>
  submitAdvancedReview: (reviewData: ReviewData) => Promise<void>
  fetchReviews: () => Promise<void>
  fetchUserReview: () => Promise<void>
  // Stats
  averageRating: number
  totalReviews: number
}

export function useRatings(puzzleId: string): UseRatingsReturn {
  const { user } = useUser()
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Calculate stats from reviews
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const totalReviews = reviews.length

  // Fetch user's specific review
  const fetchUserReview = async () => {
    if (!user || !puzzleId) return

    try {
      const response = await fetch(
        `/api/reviews?puzzle_id=${puzzleId}&user_id=${user.id}&limit=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.reviews.length > 0) {
          setUserReview(data.reviews[0])
        } else {
          setUserReview(null)
        }
      }
    } catch (error) {
      console.error('Error fetching user review:', error)
    }
  }

  // Fetch all reviews for the puzzle
  const fetchReviews = async () => {
    if (!puzzleId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/reviews?puzzle_id=${puzzleId}&limit=50`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setReviews(data.reviews)
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  // Submit a quick rating (overall rating only)
  const submitRating = async (rating: number) => {
    if (!user || !puzzleId) {
      throw new Error('User must be logged in to submit rating')
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          puzzle_id: puzzleId,
          rating
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit rating')
      }

      const data = await response.json()
      if (data.success) {
        // Update user review
        setUserReview(data.review)
        
        // Refresh all reviews to get updated stats
        await fetchReviews()
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  // Submit advanced review with all rating categories
  const submitAdvancedReview = async (reviewData: ReviewData) => {
    if (!user || !puzzleId) {
      throw new Error('User must be logged in to submit review')
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          puzzle_id: puzzleId,
          ...reviewData
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit review')
      }

      const data = await response.json()
      if (data.success) {
        // Update user review
        setUserReview(data.review)
        
        // Refresh all reviews to get updated stats
        await fetchReviews()
      }
    } catch (error) {
      console.error('Error submitting advanced review:', error)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (puzzleId) {
      fetchReviews()
      if (user) {
        fetchUserReview()
      }
    }
  }, [puzzleId, user])

  return {
    userReview,
    reviews,
    loading,
    submitting,
    submitRating,
    submitAdvancedReview,
    fetchReviews,
    fetchUserReview,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews
  }
}

// Helper hook for difficulty rating in puzzle logs
export function useDifficultyRating(puzzleLogId: string) {
  const [submitting, setSubmitting] = useState(false)

  const submitDifficultyRating = async (rating: number) => {
    if (!puzzleLogId) {
      throw new Error('Puzzle log ID is required')
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/puzzle-logs/${puzzleLogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          difficulty_rating: rating
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update difficulty rating')
      }

      return await response.json()
    } catch (error) {
      console.error('Error submitting difficulty rating:', error)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  return {
    submitDifficultyRating,
    submitting
  }
} 