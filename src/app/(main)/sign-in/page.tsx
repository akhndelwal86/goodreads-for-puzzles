'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/my-puzzles"
          appearance={{
            elements: {
              card: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl",
              headerTitle: "text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent",
              headerSubtitle: "text-gray-600",
              formButtonPrimary: "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200",
              footerActionLink: "text-violet-600 hover:text-purple-600"
            }
          }}
        />
      </div>
    </div>
  )
} 