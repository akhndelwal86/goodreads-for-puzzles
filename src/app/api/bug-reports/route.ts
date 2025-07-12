import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { logger } from '@/lib/utils'

// Priority scoring based on severity and frequency
function calculatePriorityScore(severity: string, frequency: string): number {
  const severityScores = { critical: 100, high: 75, medium: 50, low: 25 }
  const frequencyScores = {
    'Always (100% of the time)': 100,
    'Very Often (75% of the time)': 75,
    'Sometimes (50% of the time)': 50,
    'Rarely (25% of the time)': 25,
    'Once (happened only once)': 10
  }
  
  const severityScore = severityScores[severity as keyof typeof severityScores] || 25
  const frequencyScore = frequencyScores[frequency as keyof typeof frequencyScores] || 10
  
  // Weighted formula: severity is more important than frequency
  return Math.round((severityScore * 0.7) + (frequencyScore * 0.3))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'stepsToReproduce', 'expectedBehavior', 
      'actualBehavior', 'device', 'browser', 'operatingSystem', 
      'puzzlrPage', 'frequency', 'severity'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate device
    const validDevices = ['desktop', 'mobile', 'tablet']
    if (!validDevices.includes(body.device)) {
      return NextResponse.json(
        { error: 'Invalid device type' },
        { status: 400 }
      )
    }

    // Validate severity
    const validSeverities = ['low', 'medium', 'high', 'critical']
    if (!validSeverities.includes(body.severity)) {
      return NextResponse.json(
        { error: 'Invalid severity level' },
        { status: 400 }
      )
    }

    // Validate frequency
    const validFrequencies = [
      'Always (100% of the time)',
      'Very Often (75% of the time)',
      'Sometimes (50% of the time)',
      'Rarely (25% of the time)',
      'Once (happened only once)'
    ]
    if (!validFrequencies.includes(body.frequency)) {
      return NextResponse.json(
        { error: 'Invalid frequency option' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Calculate priority score
    const priorityScore = calculatePriorityScore(body.severity, body.frequency)

    // Insert bug report
    const { data, error } = await supabase
      .from('bug_reports')
      .insert({
        title: body.title,
        description: body.description,
        steps_to_reproduce: body.stepsToReproduce,
        expected_behavior: body.expectedBehavior,
        actual_behavior: body.actualBehavior,
        device: body.device,
        browser: body.browser,
        operating_system: body.operatingSystem,
        puzzlr_page: body.puzzlrPage,
        frequency: body.frequency,
        severity: body.severity,
        user_email: body.userEmail || null,
        priority_score: priorityScore,
        status: 'submitted'
      })
      .select()
      .single()

    if (error) {
      logger.error('Failed to create bug report:', error)
      return NextResponse.json(
        { error: 'Failed to submit bug report' },
        { status: 500 }
      )
    }

    // Generate a friendly ID for the user
    const friendlyId = `BUG-${data.id.substring(0, 8).toUpperCase()}`

    logger.info('Bug report submitted:', { 
      id: data.id, 
      title: body.title, 
      severity: body.severity,
      priorityScore 
    })

    return NextResponse.json({
      success: true,
      id: data.id,
      friendlyId,
      priorityScore,
      message: 'Bug report submitted successfully'
    })

  } catch (error) {
    logger.error('Error in bug reports API:', error)
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
    const severity = searchParams.get('severity')
    const device = searchParams.get('device')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServiceClient()

    let query = supabase
      .from('bug_reports')
      .select('*')
      .order('priority_score', { ascending: false })
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) query = query.eq('status', status)
    if (severity) query = query.eq('severity', severity)
    if (device) query = query.eq('device', device)

    const { data, error } = await query

    if (error) {
      logger.error('Failed to fetch bug reports:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bug reports' },
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
    logger.error('Error in bug reports GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}