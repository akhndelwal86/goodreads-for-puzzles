'use client'

import { ReactNode, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { SignInPrompt } from './sign-in-prompt'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  feature?: string
  redirectTo?: string
  mode?: 'redirect' | 'modal' | 'replace'
  showPrompt?: boolean
  className?: string
}

export function AuthGuard({
  children,
  fallback,
  feature = "access this feature",
  redirectTo,
  mode = 'modal',
  showPrompt = true,
  className
}: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useUser()
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className={className}>
        <div className="animate-pulse bg-gray-200 rounded h-8 w-32"></div>
      </div>
    )
  }

  // User is signed in, show the protected content
  if (isSignedIn) {
    return <>{children}</>
  }

  // User is not signed in, handle based on mode
  if (mode === 'replace' && fallback) {
    return <>{fallback}</>
  }

  // Default: show a sign-in prompt
  const handleAuthRequired = () => {
    if (mode === 'modal') {
      setShowSignInPrompt(true)
    } else if (mode === 'redirect') {
      const signInUrl = redirectTo 
        ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
        : '/sign-in'
      window.location.href = signInUrl
    }
  }

  return (
    <div className={className}>
      {showPrompt && (
        <div 
          onClick={handleAuthRequired}
          className="cursor-pointer"
        >
          {fallback || (
            <div className="flex items-center justify-center p-4 border-2 border-dashed border-violet-200 rounded-lg bg-violet-50/50 hover:bg-violet-100/50 transition-colors">
              <div className="text-center">
                <p className="text-sm font-medium text-violet-700 mb-1">
                  Sign in to {feature}
                </p>
                <p className="text-xs text-violet-600">
                  Click to join thousands of puzzle enthusiasts
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <SignInPrompt
        isOpen={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        feature={feature}
        redirectTo={redirectTo}
      />
    </div>
  )
}

// Higher-order component version for easier wrapping
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  const WrappedComponent = (props: P) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  )
  
  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for checking auth and showing prompts
export function useAuthPrompt() {
  const { isSignedIn, isLoaded } = useUser()
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)

  const requireAuth = (feature?: string, redirectTo?: string) => {
    if (!isLoaded) return false
    
    if (isSignedIn) return true
    
    setShowSignInPrompt(true)
    return false
  }

  const SignInPromptComponent = (props: Partial<Parameters<typeof SignInPrompt>[0]>) => (
    <SignInPrompt
      isOpen={showSignInPrompt}
      onClose={() => setShowSignInPrompt(false)}
      {...props}
    />
  )

  return {
    isSignedIn: isSignedIn && isLoaded,
    isLoaded,
    requireAuth,
    SignInPrompt: SignInPromptComponent
  }
}