'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Home, Search, BookOpen, User, Plus } from 'lucide-react'

export function NavigationBar() {
  const { user, isLoaded } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/puzzles/browse', label: 'Browse', icon: Search },
    { href: '/my-puzzles', label: 'My Puzzles', icon: BookOpen },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🧩</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              Puzzle Tracker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-violet-600 transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Add Puzzle Button (Desktop) */}
            {isLoaded && user && (
              <Link href="/puzzles/create" className="hidden md:block">
                <Button className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Puzzle
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isLoaded && user ? (
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 text-gray-600 hover:text-violet-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium text-lg">{item.label}</span>
                    </Link>
                  ))}
                  
                  {/* Mobile Add Puzzle Button */}
                  {isLoaded && user && (
                    <Link
                      href="/puzzles/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mt-4"
                    >
                      <Button className="w-full bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Puzzle
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
} 