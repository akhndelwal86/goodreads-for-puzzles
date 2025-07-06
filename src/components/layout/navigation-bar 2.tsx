"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { Sheet, SheetTrigger, SheetContent } from '../ui/sheet';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Discover', href: '/' },
  { name: 'My Puzzles', href: '/my-puzzles' },
  { name: 'Profile', href: '/profile' },
];

export default function NavigationBar() {
  const pathname = usePathname();
  return (
    <nav className="glass-card sticky top-0 z-50 w-full flex items-center justify-between px-4 py-2 shadow-glass backdrop-blur-xl bg-white/80 border-b border-white/20">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        {/* Sparkles Icon (SVG) */}
        <span className="inline-block animate-pulse">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sparkle-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <path d="M16 2l2.5 7.5L26 10l-6 4.5L22 22l-6-4.5L10 22l2-7.5L6 10l7.5-0.5L16 2z" fill="url(#sparkle-gradient)" />
          </svg>
        </span>
        <span className="text-xl font-bold gradient-text select-none">PuzzleHub</span>
      </div>

      {/* Center: Main Nav */}
      <div className="hidden md:flex gap-2 items-center">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`px-3 py-2 rounded-xl font-medium transition-colors duration-200 hover:bg-primary/10 ${pathname === item.href ? 'gradient-text' : 'text-gray-700'}`}
          >
            {item.name}
          </Link>
        ))}
        {/* AI Discovery Highlight */}
        <Link
          href="/ai-discovery"
          className="relative flex items-center px-3 py-2 rounded-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 text-white shadow-md hover:scale-105 transition-transform"
        >
          <span className="mr-2 animate-pulse">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ai-gradient" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34d399" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="10" cy="10" r="8" fill="url(#ai-gradient)" />
              <circle cx="10" cy="10" r="3" fill="#fff" fillOpacity="0.7" />
            </svg>
          </span>
          Discovery with AI
          {/* Animated dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-300 rounded-full animate-ping" />
        </Link>
      </div>

      {/* Right: Log Puzzle + User */}
      <div className="flex items-center gap-2">
        <Button className="hidden sm:inline-flex bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md hover:scale-105 transition-transform font-semibold px-4 py-2 rounded-xl">
          Log Puzzle
        </Button>
        {/* User Avatar + Name (placeholder) */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8" />
          <span className="hidden sm:inline font-medium text-gray-800">Username</span>
        </div>
        {/* Mobile: Hamburger menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-none bg-transparent">
                <span className="sr-only">Open menu</span>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-8 bg-white/90 backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium py-2 px-4 rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/ai-discovery"
                  className="flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-semibold shadow-md"
                >
                  <span className="animate-pulse">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="ai-gradient-mobile" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#34d399" />
                          <stop offset="1" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                      <circle cx="10" cy="10" r="8" fill="url(#ai-gradient-mobile)" />
                      <circle cx="10" cy="10" r="3" fill="#fff" fillOpacity="0.7" />
                    </svg>
                  </span>
                  Discovery with AI
                </Link>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md">
                  Log Puzzle
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 