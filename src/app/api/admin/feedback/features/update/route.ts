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
    const { id, status, adminNotes, implementationEffort, targetVersion } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get current feature request for logging
    const { data: featureRequest, error: fetchError } = await supabase
      .from('feature_requests')
      .select('title, status')
      .eq('id', id)
      .single()

    if (fetchError || !featureRequest) {
      return NextResponse.json(
        { error: 'Feature request not found' },
        { status: 404 }
      )
    }

    // Update the feature request
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (adminNotes) updateData.admin_notes = adminNotes
    if (implementationEffort) updateData.implementation_effort = implementationEffort
    if (targetVersion) updateData.target_version = targetVersion

    // Set reviewed_at timestamp for certain status changes
    if (['reviewing', 'planned', 'rejected'].includes(status)) {
      updateData.reviewed_at = new Date().toISOString()
    }

    // Set completed_at timestamp for completion
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('feature_requests')
      .update(updateData)
      .eq('id', id)

    if (updateError) {
      console.error('Error updating feature request:', updateError)
      return NextResponse.json(
        { error: 'Failed to update feature request' },
        { status: 500 }
      )
    }

    // Log admin activity
    await adminAuth.logActivity(
      sessionId,
      adminUsername,
      'update_feature_request',
      'feature_request',
      id,
      {
        title: featureRequest.title,
        previous_status: featureRequest.status,
        new_status: status,
        admin_notes: adminNotes,
        implementation_effort: implementationEffort,
        target_version: targetVersion
      }
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Feature request updated successfully' 
    })

  } catch (error) {
    console.error('Feature request update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}