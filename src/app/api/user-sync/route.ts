import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { logger } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('🔄 Starting server-side user sync for Clerk ID:', userId)

    const supabase = createServiceClient()
    
    // Check if user exists in Supabase
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .maybeSingle()

    if (checkError) {
      logger.error('❌ Error checking for existing user:', checkError)
      return NextResponse.json({ error: 'Database error', details: checkError }, { status: 500 })
    }

    if (existingUser) {
      logger.info('✅ User already exists in Supabase:', existingUser.id)
      return NextResponse.json({ 
        success: true, 
        user: existingUser, 
        action: 'already_exists' 
      })
    }

    // We need user data from Clerk to create the user
    // Since we can't access the Clerk user object server-side in this context,
    // we'll expect it to be passed in the request body
    const body = await request.json()
    const { userData } = body

    if (!userData || !userData.emailAddresses) {
      return NextResponse.json({ 
        error: 'User data required for sync',
        hint: 'Pass userData from Clerk in request body'
      }, { status: 400 })
    }

    // Create user if doesn't exist
    logger.info('📝 Creating new user in Supabase...')
    const newUserData = {
      clerk_id: userId,
      email: userData.emailAddresses[0]?.emailAddress || userData.primaryEmailAddress?.emailAddress || '',
      username: userData.username || (() => {
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
        return fullName || null
      })(),
      avatar_url: userData.imageUrl || null,
    }
    
    logger.info('👤 User data to insert:', newUserData)

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert(newUserData)
      .select()
      .single()

    if (createError) {
      logger.error('❌ Error creating user in Supabase:', createError)
      return NextResponse.json({ 
        error: 'Failed to create user', 
        details: createError 
      }, { status: 500 })
    }

    logger.success('✅ User created successfully in Supabase:', newUser.id)
    return NextResponse.json({ 
      success: true, 
      user: newUser, 
      action: 'created' 
    })

  } catch (error) {
    logger.error('❌ Unexpected error during user sync:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 