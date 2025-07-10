import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { createFeedItem } from '@/lib/activity-feed'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      puzzle_id,
      rating,
      loose_fit,
      false_fit,
      shape_versatility,
      finish,
      review_text,
      other_metadata_notes
    } = body

    // Validate required fields
    if (!puzzle_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Puzzle ID and valid rating (1-5) are required' },
        { status: 400 }
      )
    }

    // Get user from our database using clerk_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user already has a review for this puzzle
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('puzzle_id', puzzle_id)
      .single()

    const reviewData = {
      user_id: user.id,
      puzzle_id,
      rating: parseInt(rating),
      loose_fit: loose_fit ? parseInt(loose_fit) : null,
      false_fit: false_fit ? parseInt(false_fit) : null,
      shape_versatility: shape_versatility ? parseInt(shape_versatility) : null,
      finish: finish ? parseInt(finish) : null,
      review_text: review_text?.trim() || null,
      other_metadata_notes: other_metadata_notes?.trim() || null
    }

    let result

    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', existingReview.id)
        .select('*')
        .single()

      if (error) {
        console.error('Error updating review:', error)
        return NextResponse.json(
          { error: 'Failed to update review' },
          { status: 500 }
        )
      }
      result = data
    } else {
      // Create new review
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select('*')
        .single()

      if (error) {
        console.error('Error creating review:', error)
        return NextResponse.json(
          { error: 'Failed to create review' },
          { status: 500 }
        )
      }
      result = data
    }

    // Update puzzle aggregates
    await updatePuzzleAggregates(puzzle_id)

    // Create feed item for the review (async, don't wait for it)
    if (!existingReview) {
      // Only create feed item for new reviews, not updates
      createFeedItem({
        userId: user.id,
        type: 'review',
        puzzleId: puzzle_id,
        reviewId: result.id,
        text: review_text?.trim() || `Rated this puzzle ${rating} stars`
      }).catch(error => {
        console.error('⚠️ Failed to create feed item for review:', error)
      })
    }

    return NextResponse.json({ 
      success: true, 
      review: result,
      action: existingReview ? 'updated' : 'created'
    })

  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const puzzleId = searchParams.get('puzzle_id')
    const userId = searchParams.get('user_id') // clerk_id
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!puzzleId) {
      return NextResponse.json(
        { error: 'Puzzle ID is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('reviews')
      .select(`
        *,
        users!inner(username, avatar_url)
      `)
      .eq('puzzle_id', puzzleId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // If user_id is provided, get only that user's review
    if (userId) {
      // First get the user's database ID from clerk_id
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', userId)
        .single()

      if (user) {
        query = query.eq('user_id', user.id)
      }
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      reviews: reviews || [],
      count: reviews?.length || 0
    })

  } catch (error) {
    console.error('Reviews GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update puzzle aggregates
async function updatePuzzleAggregates(puzzleId: string) {
  try {
    // Get all reviews for this puzzle
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating, loose_fit, false_fit, shape_versatility, finish, pick_test')
      .eq('puzzle_id', puzzleId)

    if (error || !reviews || reviews.length === 0) {
      return
    }

    // Calculate averages and counts
    const totalReviews = reviews.length
    const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews

    const looseFitReviews = reviews.filter(r => r.loose_fit !== null)
    const avgLooseFit = looseFitReviews.length > 0 
      ? looseFitReviews.reduce((sum, r) => sum + r.loose_fit, 0) / looseFitReviews.length 
      : null

    const falseFitReviews = reviews.filter(r => r.false_fit !== null)
    const avgFalseFit = falseFitReviews.length > 0
      ? falseFitReviews.reduce((sum, r) => sum + r.false_fit, 0) / falseFitReviews.length
      : null

    const shapeReviews = reviews.filter(r => r.shape_versatility !== null)
    const avgShapeVersatility = shapeReviews.length > 0
      ? shapeReviews.reduce((sum, r) => sum + r.shape_versatility, 0) / shapeReviews.length
      : null

    const finishReviews = reviews.filter(r => r.finish !== null)
    const avgFinish = finishReviews.length > 0
      ? finishReviews.reduce((sum, r) => sum + r.finish, 0) / finishReviews.length
      : null

    const pickTestReviews = reviews.filter(r => r.pick_test !== null)
    const pickTestSuccessRate = pickTestReviews.length > 0
      ? pickTestReviews.filter(r => r.pick_test === true).length / pickTestReviews.length
      : null

    // Update puzzle_aggregates
    const aggregateData = {
      avg_rating: Math.round(avgRating * 100) / 100,
      review_count: totalReviews,
      avg_loose_fit: avgLooseFit ? Math.round(avgLooseFit * 100) / 100 : null,
      avg_false_fit: avgFalseFit ? Math.round(avgFalseFit * 100) / 100 : null,
      avg_shape_versatility: avgShapeVersatility ? Math.round(avgShapeVersatility * 100) / 100 : null,
      avg_finish: avgFinish ? Math.round(avgFinish * 100) / 100 : null,
      pick_test_success_rate: pickTestSuccessRate ? Math.round(pickTestSuccessRate * 100) / 100 : null,
      loose_fit_count: looseFitReviews.length,
      false_fit_count: falseFitReviews.length,
      shape_versatility_count: shapeReviews.length,
      finish_count: finishReviews.length,
      pick_test_count: pickTestReviews.length,
      last_updated: new Date().toISOString()
    }

    await supabase
      .from('puzzle_aggregates')
      .upsert({ id: puzzleId, ...aggregateData })

  } catch (error) {
    console.error('Error updating puzzle aggregates:', error)
  }
} 