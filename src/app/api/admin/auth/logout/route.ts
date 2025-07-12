import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, getAdminSessionFromCookies } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getAdminSessionFromCookies(request)

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      )
    }

    // Logout (invalidate session)
    const logoutSuccess = await adminAuth.logout(sessionToken)

    if (!logoutSuccess) {
      return NextResponse.json(
        { error: 'Logout failed' },
        { status: 500 }
      )
    }

    // Create response and clear cookie
    const response = NextResponse.json({ success: true })
    
    // Clear the admin session cookie
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0), // Expire immediately
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Admin logout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}