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

    const { adminUsername, sessionId } = authResult
    const { id, status, adminNotes, resolutionNotes, assignedTo, duplicateOf } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get current bug report for logging
    const { data: bugReport, error: fetchError } = await supabase
      .from('bug_reports')
      .select('title, status')
      .eq('id', id)
      .single()

    if (fetchError || !bugReport) {
      return NextResponse.json(
        { error: 'Bug report not found' },
        { status: 404 }
      )
    }

    // Update the bug report
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (adminNotes) updateData.admin_notes = adminNotes
    if (resolutionNotes) updateData.resolution_notes = resolutionNotes
    if (assignedTo) updateData.assigned_to = assignedTo
    if (duplicateOf) updateData.duplicate_of = duplicateOf

    // Set confirmed_at timestamp for confirmation
    if (status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString()
    }

    // Set resolved_at timestamp for resolution
    if (['fixed', 'duplicate', 'cannot-reproduce', 'wont-fix'].includes(status)) {
      updateData.resolved_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('bug_reports')
      .update(updateData)
      .eq('id', id)

    if (updateError) {
      console.error('Error updating bug report:', updateError)
      return NextResponse.json(
        { error: 'Failed to update bug report' },
        { status: 500 }
      )
    }

    // Log admin activity
    await adminAuth.logActivity(
      sessionId,
      adminUsername,
      'update_bug_report',
      'bug_report',
      id,
      {
        title: bugReport.title,
        previous_status: bugReport.status,
        new_status: status,
        admin_notes: adminNotes,
        resolution_notes: resolutionNotes,
        assigned_to: assignedTo,
        duplicate_of: duplicateOf
      }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Bug report updated successfully' 
    })

  } catch (error) {
    console.error('Bug report update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}