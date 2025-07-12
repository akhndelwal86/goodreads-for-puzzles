import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminContext } from '@/lib/admin-middleware'
import { createServiceClient } from '@/lib/supabase'
import { adminAuth } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const authResult = requireAdminAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { adminUsername, sessionId } = getAdminContext(request)
    const { puzzleId, rejectionReason, adminNotes } = await request.json()

    if (!puzzleId || !rejectionReason) {
      return NextResponse.json(
        { error: 'Puzzle ID and rejection reason are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get puzzle details for logging
    const { data: puzzle, error: puzzleError } = await supabase
      .from('puzzles')
      .select('title, approval_status')
      .eq('id', puzzleId)
      .single()

    if (puzzleError || !puzzle) {
      return NextResponse.json(
        { error: 'Puzzle not found' },
        { status: 404 }
      )
    }

    if (puzzle.approval_status !== 'pending') {
      return NextResponse.json(
        { error: 'Puzzle is not pending approval' },
        { status: 400 }
      )
    }

    // Update puzzle approval status using the database function
    const { data, error } = await supabase
      .rpc('update_puzzle_approval_status', {
        p_puzzle_id: puzzleId,
        p_admin_username: adminUsername,
        p_new_status: 'rejected',
        p_rejection_reason: rejectionReason,
        p_admin_notes: adminNotes
      })

    if (error) {
      console.error('Error rejecting puzzle:', error)
      return NextResponse.json(
        { error: 'Failed to reject puzzle' },
        { status: 500 }
      )
    }

    // Log admin activity
    await adminAuth.logActivity(
      sessionId,
      adminUsername,
      'reject_puzzle',
      'puzzle',
      puzzleId,
      {
        puzzle_title: puzzle.title,
        rejection_reason: rejectionReason,
        admin_notes: adminNotes
      }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Puzzle rejected successfully' 
    })

  } catch (error) {
    console.error('Puzzle rejection API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}