import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Create service client that bypasses RLS
    const serviceClient = createServiceClient()

    // Update all want-to-do status to wishlist
    const { data: updatedLogs, error: updateError } = await serviceClient
      .from('puzzle_logs')
      .update({ status: 'wishlist' })
      .eq('status', 'want-to-do')
      .select('id, status')

    if (updateError) {
      console.error('❌ Error updating puzzle logs:', updateError)
      return NextResponse.json({ error: 'Failed to migrate status values' }, { status: 500 })
    }

    console.log('✅ Successfully migrated', updatedLogs?.length || 0, 'puzzle logs from want-to-do to wishlist')

    // Get current status breakdown
    const { data: statusCounts, error: countError } = await serviceClient
      .from('puzzle_logs')
      .select('status')

    if (countError) {
      console.error('❌ Error getting status counts:', countError)
      return NextResponse.json({ 
        success: true, 
        migratedCount: updatedLogs?.length || 0,
        message: 'Migration completed but could not get status breakdown'
      })
    }

    const statusBreakdown = (statusCounts || []).reduce((acc: Record<string, number>, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      migratedCount: updatedLogs?.length || 0,
      statusBreakdown,
      message: `Successfully migrated ${updatedLogs?.length || 0} puzzle logs from want-to-do to wishlist`
    })

  } catch (error) {
    console.error('❌ Error in status migration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 