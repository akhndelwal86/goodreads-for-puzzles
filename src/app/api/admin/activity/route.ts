import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-middleware'
import { adminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    const authResult = requireAdminAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Get limit from query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // Fetch recent admin activity
    const activity = await adminAuth.getRecentActivity(limit)

    return NextResponse.json(activity)

  } catch (error) {
    console.error('Admin activity API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity log' },
      { status: 500 }
    )
  }
}