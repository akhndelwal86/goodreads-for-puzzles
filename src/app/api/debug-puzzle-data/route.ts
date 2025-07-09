import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServiceClient()
    const puzzleId = '4503543e-7399-4c07-a733-ab6520f212c1'
    
    // Check puzzle_aggregates
    const { data: aggregates } = await supabase
      .from('puzzle_aggregates')
      .select('*')
      .eq('id', puzzleId)
    
    // Check reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('puzzle_id', puzzleId)
    
    // Check puzzle_logs
    const { data: logs } = await supabase
      .from('puzzle_logs')
      .select('status')
      .eq('puzzle_id', puzzleId)
      .eq('status', 'completed')
    
    return NextResponse.json({
      puzzleId,
      aggregates: aggregates || [],
      reviewCount: reviews?.length || 0,
      avgReviewRating: reviews?.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
      completedLogs: logs?.length || 0
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
