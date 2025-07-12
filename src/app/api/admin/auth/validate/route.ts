import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, getAdminSessionFromCookies } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = getAdminSessionFromCookies(request)
    console.log('Session validation - token present:', !!sessionToken)

    if (!sessionToken) {
      console.log('No session token found in cookies')
      return NextResponse.json(
        { valid: false, error: 'No session token' },
        { status: 401 }
      )
    }

    // Validate session
    const authResult = await adminAuth.validateSession(sessionToken)
    console.log('Session validation result:', { isValid: authResult.isValid, error: authResult.error })

    if (!authResult.isValid) {
      // Clear invalid cookie
      const response = NextResponse.json(
        { valid: false, error: authResult.error },
        { status: 401 }
      )
      
      response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/'
      })
      
      return response
    }

    return NextResponse.json({
      valid: true,
      session: {
        adminUsername: authResult.session?.adminUsername,
        expiresAt: authResult.session?.expiresAt,
        lastAccessedAt: authResult.session?.lastAccessedAt
      }
    })

  } catch (error) {
    console.error('Admin session validation API error:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}