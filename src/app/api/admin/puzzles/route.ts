import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-middleware'
import { createServiceClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authResult = requireAdminAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServiceClient()

    // Use the admin view for pending puzzles with user information
    if (status === 'pending') {
      const { data: puzzles, error } = await supabase
        .from('admin_pending_puzzles')
        .select('*')
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching pending puzzles:', error)
        return NextResponse.json(
          { error: 'Failed to fetch pending puzzles' },
          { status: 500 }
        )
      }

      return NextResponse.json(puzzles || [])
    } else {
      // For approved/rejected puzzles, use the main puzzles table
      const { data: puzzles, error } = await supabase
        .from('puzzles')
        .select(`
          *,
          brand:brands(name),
          uploader:users(email, username)
        `)
        .eq('approval_status', status)
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching puzzles:', error)
        return NextResponse.json(
          { error: 'Failed to fetch puzzles' },
          { status: 500 }
        )
      }

      // Transform data to match expected format
      const transformedPuzzles = puzzles?.map(puzzle => ({
        id: puzzle.id,
        title: puzzle.title,
        piece_count: puzzle.piece_count,
        theme: puzzle.theme,
        material: puzzle.material,
        description: puzzle.description,
        image_url: puzzle.image_url,
        approval_status: puzzle.approval_status,
        created_at: puzzle.created_at,
        updated_at: puzzle.updated_at,
        brand_name: puzzle.brand?.name || 'Unknown Brand',
        uploader_email: puzzle.uploader?.email || '',
        uploader_first_name: puzzle.uploader?.username || 'Unknown',
        uploader_last_name: '',
        review_count: 0,
        avg_rating: 0
      })) || []

      return NextResponse.json(transformedPuzzles)
    }

  } catch (error) {
    console.error('Admin puzzles API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}