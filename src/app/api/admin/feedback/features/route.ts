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
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServiceClient()

    let query = supabase
      .from('feature_requests')
      .select('*')
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }

    const { data: features, error } = await query

    if (error) {
      console.error('Error fetching feature requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feature requests' },
        { status: 500 }
      )
    }

    return NextResponse.json(features || [])

  } catch (error) {
    console.error('Admin feature requests API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}