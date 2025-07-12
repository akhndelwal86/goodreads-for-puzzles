import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes are protected (require authentication)
const isProtectedRoute = createRouteMatcher([
  '/my-puzzles(.*)',
  '/log(.*)',
  '/profile(.*)',
  '/dashboard(.*)',
  '/settings(.*)',
  '/lists/create(.*)',
  '/lists/edit(.*)',
  '/puzzles/add(.*)',
  '/puzzles/create(.*)',
  '/collections/create(.*)'
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
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  // Match all routes except static files and API routes that don't need auth
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
} 