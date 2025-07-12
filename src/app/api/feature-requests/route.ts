import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { logger } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'category', 'description', 'problem', 'solution', 'userType', 'priority']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate category
    const validCategories = [
      'puzzle-tracking', 'social-features', 'discovery', 'collections',
      'mobile-app', 'notifications', 'other'
    ]
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate priority
    const validPriorities = ['nice-to-have', 'helpful', 'important', 'critical']
    if (!validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Insert feature request
    const { data, error } = await supabase
      .from('feature_requests')
      .insert({
        title: body.title,
        category: body.category,
        description: body.description,
        problem: body.problem,
        solution: body.solution,
        alternative_solutions: body.alternativeSolutions || null,
        user_type: body.userType,
        priority: body.priority,
        additional_context: body.additionalContext || null,
        user_email: body.userEmail || null,
        willing_to_test: body.willingToTest || false,
        status: 'submitted'
      })
      .select()
      .single()

    if (error) {
      logger.error('Failed to create feature request:', error)
      return NextResponse.json(
        { error: 'Failed to submit feature request' },
        { status: 500 }
      )
    }

    // Generate a friendly ID for the user
    const friendlyId = `FEAT-${data.id.substring(0, 8).toUpperCase()}`

    logger.info('Feature request submitted:', { id: data.id, title: body.title })

    return NextResponse.json({
      success: true,
      id: data.id,
      friendlyId,
      message: 'Feature request submitted successfully'
    })

  } catch (error) {
    logger.error('Error in feature requests API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServiceClient()

    let query = supabase
      .from('feature_requests_with_stats')
      .select('*')
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) query = query.eq('status', status)
    if (category) query = query.eq('category', category)
    if (priority) query = query.eq('priority', priority)

    const { data, error } = await query

    if (error) {
      logger.error('Failed to fetch feature requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feature requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        limit,
        offset,
        total: data.length
      }
    })

  } catch (error) {
    logger.error('Error in feature requests GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}