import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes are protected (require authentication)
const isProtectedRoute = createRouteMatcher([
  '/my-puzzles(.*)',
  '/log(.*)',
  '/profile(.*)',
  '/dashboard(.*)',
  '/settings(.*)',
  '/lists/create(.*)',
  '/lists/edit(.*)'
])

// Define which routes are public (accessible to unauthenticated users)
const isPublicRoute = createRouteMatcher([
  '/',
  '/discover(.*)',
  '/community(.*)',
  '/chat(.*)',
  '/puzzles/(.*)',
  '/brands/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // If the route is protected and user is not authenticated, redirect to sign-in
  if (isProtectedRoute(req)) {
    try {
      await auth.protect()
    } catch (error) {
      console.error('Authentication error:', error)
      // Handle authentication failure explicitly
      return Response.redirect(new URL('/sign-in', req.url))
    }
  }
})

export const config = {
  // Match all routes except static files and API routes that don't need auth
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
} 