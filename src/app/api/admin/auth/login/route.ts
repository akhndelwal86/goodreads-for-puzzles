import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, getAdminCookieOptions } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    console.log('Admin login attempt:', { username, hasPassword: !!password })

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get client information
    const ipAddress = adminAuth.getClientIP(request)
    const userAgent = adminAuth.getUserAgent(request)

    // Attempt login
    const loginResult = await adminAuth.login(username, password, ipAddress, userAgent)
    console.log('Login result:', { success: loginResult.success, error: loginResult.error })

    if (!loginResult.success) {
      return NextResponse.json(
        { error: loginResult.error || 'Login failed' },
        { status: 401 }
      )
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      expiresAt: loginResult.expiresAt
    })

    // Set secure HTTP-only cookie
    if (loginResult.sessionToken && loginResult.expiresAt) {
      const cookieOptions = getAdminCookieOptions(loginResult.expiresAt)
      console.log('Setting cookie with options:', cookieOptions)
      response.cookies.set('admin_session', loginResult.sessionToken, cookieOptions)
    }

    console.log('Login successful, returning response')
    return response

  } catch (error) {
    console.error('Admin login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}