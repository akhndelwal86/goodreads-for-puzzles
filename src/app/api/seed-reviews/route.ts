import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

// Create Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Sample review data with realistic ratings and comments
const sampleReviews = [
  {
    rating: 4.8,
    review_text: "Absolutely stunning puzzle! The image quality is incredible and the pieces fit perfectly. Took me about 8 hours to complete but every minute was enjoyable.",
    loose_fit: 1,
    false_fit: 1,
    shape_versatility: 4,
    finish: 5,
    pick_test: true
  },
  {
    rating: 4.5,
    review_text: "Beautiful artwork and good quality pieces. A few pieces were slightly loose but overall great experience.",
    loose_fit: 2,
    false_fit: 1,
    shape_versatility: 4,
    finish: 4,
    pick_test: true
  },
  {
    rating: 4.2,
    review_text: "Challenging but rewarding. The color variations made it tricky but that's what I love about puzzles!",
    loose_fit: 1,
    false_fit: 2,
    shape_versatility: 3,
    finish: 4,
    pick_test: false
  },
  {
    rating: 3.8,
    review_text: "Good puzzle overall, though some pieces felt a bit thin. Still enjoyable to work on.",
    loose_fit: 3,
    false_fit: 1,
    shape_versatility: 3,
    finish: 3,
    pick_test: true
  },
  {
    rating: 4.7,
    review_text: "One of the best puzzles I've ever done! Perfect fit, beautiful image, highly recommended.",
    loose_fit: 1,
    false_fit: 1,
    shape_versatility: 5,
    finish: 5,
    pick_test: true
  },
  {
    rating: 3.5,
    review_text: "Decent puzzle but had some quality issues. A few pieces didn't fit well.",
    loose_fit: 4,
    false_fit: 3,
    shape_versatility: 2,
    finish: 3,
    pick_test: false
  },
  {
    rating: 4.9,
    review_text: "Perfect in every way! Amazing artwork, perfect piece fit, and great finish quality.",
    loose_fit: 1,
    false_fit: 1,
    shape_versatility: 5,
    finish: 5,
    pick_test: true
  },
  {
    rating: 4.1,
    review_text: "Great puzzle for the price point. Some pieces were tricky to place but that made it more fun.",
    loose_fit: 2,
    false_fit: 2,
    shape_versatility: 4,
    finish: 4,
    pick_test: true
  }
]

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user from database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get all approved puzzles
    const { data: puzzles, error: puzzleError } = await supabaseAdmin
      .from('puzzles')
      .select('id, title')
      .eq('approval_status', 'approved')
      .limit(15) // Limit to first 15 puzzles

    if (puzzleError) {
      return NextResponse.json(
        { error: 'Failed to fetch puzzles' },
        { status: 500 }
      )
    }

    // Create exactly one review per puzzle to avoid duplicates
    const allReviews = []
    const puzzleAggregates = []

    for (let i = 0; i < Math.min(10, puzzles.length); i++) {
      const puzzle = puzzles[i]
      const sampleReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)]
      
      // Create simple review object matching schema exactly
      const review = {
        user_id: userData.id,
        puzzle_id: puzzle.id,
        rating: Math.round(sampleReview.rating), // Ensure integer
        review_text: sampleReview.review_text,
        loose_fit: sampleReview.loose_fit,
        false_fit: sampleReview.false_fit,
        shape_versatility: sampleReview.shape_versatility,
        finish: sampleReview.finish,
        pick_test: sampleReview.pick_test
      }
      
      allReviews.push(review)

      // Calculate aggregate stats for this puzzle (single review)
      puzzleAggregates.push({
        id: puzzle.id,
        avg_rating: review.rating,
        review_count: 1,
        last_updated: new Date().toISOString()
      })
    }

    console.log('About to insert reviews:', allReviews.length)
    console.log('Sample review:', JSON.stringify(allReviews[0], null, 2))

    // First, delete any existing reviews for these puzzles from this user
    const puzzleIds = puzzles.slice(0, 10).map(p => p.id)
    const { error: deleteError } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('user_id', userData.id)
      .in('puzzle_id', puzzleIds)

    if (deleteError) {
      console.log('Note: Could not delete existing reviews:', deleteError)
    }

    // Insert all reviews
    const { error: reviewInsertError } = await supabaseAdmin
      .from('reviews')
      .insert(allReviews)

    if (reviewInsertError) {
      console.error('Review insert error:', reviewInsertError)
      return NextResponse.json(
        { error: 'Failed to insert reviews', details: reviewInsertError },
        { status: 500 }
      )
    }

    // Update puzzle_aggregates
    for (const aggregate of puzzleAggregates) {
      const { error: aggregateError } = await supabaseAdmin
        .from('puzzle_aggregates')
        .upsert(aggregate, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })

      if (aggregateError) {
        console.error('Aggregate update error for puzzle', aggregate.id, ':', aggregateError)
      }
    }

    console.log(`✅ Created ${allReviews.length} reviews for ${puzzles.length} puzzles`)

    return NextResponse.json({
      success: true,
      message: `Created ${allReviews.length} reviews for ${puzzles.length} puzzles`,
      reviewsCreated: allReviews.length,
      puzzlesWithReviews: puzzles.length,
      aggregatesUpdated: puzzleAggregates.length
    })

  } catch (error) {
    console.error('Error seeding reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 