import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, getAdminSessionFromCookies } from '@/lib/admin-auth'

/**
 * Admin middleware to protect admin routes
 * This should be called in the main middleware.ts for admin routes
 */
export async function adminMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl

  // Skip middleware for admin auth endpoints
  if (pathname.startsWith('/api/admin/auth/')) {
    return null // Continue to the route
  }

  // Skip middleware for admin login page
  if (pathname === '/admin' || pathname === '/admin/login') {
    return null // Continue to the route
  }

  // Skip middleware for static assets
  if (pathname.includes('._next') || pathname.includes('/favicon.ico')) {
    return null
  }

  // Check if this is an admin route that needs protection
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const sessionToken = getAdminSessionFromCookies(request)

    if (!sessionToken) {
      // No session token - redirect to login for pages, return 401 for API
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { error: 'Admin authentication required' },
          { status: 401 }
        )
      } else {
        // Redirect to admin login page
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // Validate session
    const authResult = await adminAuth.validateSession(sessionToken)

    if (!authResult.isValid) {
      // Invalid session - clear cookie and redirect/return error
      const response = pathname.startsWith('/api/admin')
        ? NextResponse.json(
            { error: 'Invalid or expired admin session' },
            { status: 401 }
          )
        : NextResponse.redirect(new URL('/admin/login', request.url))

      // Clear the invalid session cookie
      response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/admin'
      })

      return response
    }

    // Valid session - add admin context to headers for the route
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-username', authResult.session?.adminUsername || '')
    requestHeaders.set('x-admin-session-id', authResult.session?.id || '')

    // Continue to the protected route with admin context
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  }

  // Not an admin route - continue normally
  return null
}

/**
 * Helper to extract admin context from request headers (for use in API routes)
 */
export function getAdminContext(request: NextRequest): {
  adminUsername: string | null
  sessionId: string | null
} {
  return {
    adminUsername: request.headers.get('x-admin-username') || null,
    sessionId: request.headers.get('x-admin-session-id') || null
  }
}

/**
 * Helper to require admin authentication in API routes
 */
export function requireAdminAuth(request: NextRequest): {
  adminUsername: string
  sessionId: string
} | NextResponse {
  const context = getAdminContext(request)

  if (!context.adminUsername || !context.sessionId) {
    return NextResponse.json(
      { error: 'Admin authentication required' },
      { status: 401 }
    )
  }

  return {
    adminUsername: context.adminUsername,
    sessionId: context.sessionId
  }
}