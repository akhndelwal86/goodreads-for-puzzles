'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LogIn, UserPlus, X } from 'lucide-react'
import Link from 'next/link'

interface SignInPromptProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
  redirectTo?: string
  title?: string
  description?: string
}

export function SignInPrompt({
  isOpen,
  onClose,
  feature = "this feature",
  redirectTo,
  title,
  description
}: SignInPromptProps) {
  const router = useRouter()

  const handleSignIn = () => {
    const signInUrl = redirectTo 
      ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
      : '/sign-in'
    router.push(signInUrl)
  }

  const handleSignUp = () => {
    const signUpUrl = redirectTo 
      ? `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`
      : '/sign-up'
    router.push(signUpUrl)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5 text-violet-600" />
            {title || "Sign in required"}
          </DialogTitle>
          <DialogDescription>
            {description || `You need to sign in to ${feature}. Join thousands of puzzle enthusiasts on Puzzlr!`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Button 
            onClick={handleSignIn}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          
          <Button 
            onClick={handleSignUp}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>

          <div className="text-center">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Maybe later
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center mt-4">
          Free to join • Connect with puzzle lovers worldwide
        </div>
      </DialogContent>
    </Dialog>
  )
}