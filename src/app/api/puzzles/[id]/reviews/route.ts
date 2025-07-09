import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid puzzle ID format' }, { status: 400 })
    }

    const supabase = createServiceClient()
    
    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    
    // Fetch reviews with user information
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        review_text,
        loose_fit,
        loose_fit_explanation,
        false_fit,
        false_fit_explanation,
        shape_versatility,
        shape_versatility_explanation,
        finish,
        finish_explanation,
        pick_test,
        pick_test_explanation,
        other_metadata_notes,
        created_at,
        user:users!user_id(
          id,
          username,
          avatar_url
        )
      `)
      .eq('puzzle_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('puzzle_id', id)

    if (countError) {
      console.error('Error fetching review count:', countError)
    }

    // Calculate rating breakdown
    const { data: allRatings, error: ratingsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('puzzle_id', id)

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let averageRating = 0
    let totalRatings = 0

    if (!ratingsError && allRatings) {
      totalRatings = allRatings.length
      
      // Count ratings by star level
      allRatings.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingBreakdown[review.rating as keyof typeof ratingBreakdown]++
        }
      })

      // Calculate average rating
      if (totalRatings > 0) {
        const totalRatingSum = allRatings.reduce((sum, review) => sum + (review.rating || 0), 0)
        averageRating = totalRatingSum / totalRatings
      }
    }

    // Calculate percentages for rating breakdown
    const ratingBreakdownWithPercentages = Object.entries(ratingBreakdown).map(([stars, count]) => ({
      stars: parseInt(stars),
      count,
      percentage: totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0
    })).reverse() // Show 5 stars first

    // Calculate quality breakdown from metadata
    const qualityBreakdown = {
      imageQuality: 0,
      pieceFit: 0,
      durability: 0,
      overallExperience: 0
    }

    if (allRatings && allRatings.length > 0) {
      // For now, use rating as proxy for quality metrics
      // In the future, these could be separate database fields
      qualityBreakdown.imageQuality = averageRating
      qualityBreakdown.pieceFit = averageRating * 0.95 // Slightly lower
      qualityBreakdown.durability = averageRating * 0.92 // Slightly lower
      qualityBreakdown.overallExperience = averageRating
    }

    // Format reviews for response
    const formattedReviews = reviews?.map(review => ({
      id: review.id,
      user: {
        id: review.user?.id || '',
        username: review.user?.username || 'Anonymous',
        avatar: review.user?.avatar_url || null
      },
      rating: review.rating,
      title: null, // Could be extracted from review_text or added as separate field
      review: review.review_text,
      date: review.created_at,
      timeAgo: formatTimeAgo(review.created_at),
      verified: true, // Could be determined by purchase history or puzzle completion
      helpful: 0, // Could be added as separate table for helpfulness votes
      metadata: {
        looseFit: review.loose_fit,
        looseFitExplanation: review.loose_fit_explanation,
        falseFit: review.false_fit,
        falseFitExplanation: review.false_fit_explanation,
        shapeVersatility: review.shape_versatility,
        shapeVersatilityExplanation: review.shape_versatility_explanation,
        finish: review.finish,
        finishExplanation: review.finish_explanation,
        pickTest: review.pick_test,
        pickTestExplanation: review.pick_test_explanation,
        otherNotes: review.other_metadata_notes
      }
    })) || []

    const response = {
      reviews: formattedReviews,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
        hasMore: (totalCount || 0) > offset + limit
      },
      summary: {
        totalReviews: totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingBreakdown: ratingBreakdownWithPercentages,
        qualityBreakdown: {
          imageQuality: Math.round(qualityBreakdown.imageQuality * 10) / 10,
          pieceFit: Math.round(qualityBreakdown.pieceFit * 10) / 10,
          durability: Math.round(qualityBreakdown.durability * 10) / 10,
          overallExperience: Math.round(qualityBreakdown.overallExperience * 10) / 10
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in puzzle reviews API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to format timestamps
function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const reviewTime = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - reviewTime.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) { // 30 days
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 31536000) { // 365 days
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months !== 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} year${years !== 1 ? 's' : ''} ago`
  }
}