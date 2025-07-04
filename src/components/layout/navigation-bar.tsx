'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()

  const publicMenuItems = [
    { href: '/discover', label: 'Discover' },
    { href: '/chat', label: 'Ask Puzzlee' },
    { href: '/community', label: 'Community' },
  ]

  const privateMenuItems = [
    { href: '/discover', label: 'Discover' },
    { href: '/my-puzzles', label: 'My Puzzles' },
    { href: '/chat', label: 'Ask Puzzlee' },
    { href: '/community', label: 'Community' },
  ]

  const menuItems = isSignedIn ? privateMenuItems : publicMenuItems

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-white rounded-sm opacity-90" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              PuzzleBase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Authentication Section */}
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link href="/log">Log Puzzle</Link>
                </Button>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <Button 
                    variant="outline" 
                    className="text-violet-600 border-violet-600 hover:bg-violet-50 font-medium"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button 
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isSignedIn && (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-violet-600"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-white/20 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-violet-600 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              {isSignedIn ? (
                <div className="px-3 py-2">
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg"
                  >
                    <Link href="/log" onClick={() => setIsMobileMenuOpen(false)}>
                      Log Puzzle
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <SignInButton mode="modal">
                    <Button 
                      variant="outline" 
                      className="w-full text-violet-600 border-violet-600 hover:bg-violet-50 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 