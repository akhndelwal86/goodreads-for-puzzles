'use client'

import { HeroSection } from '@/components/home/hero-section'
import { StatsRow } from '@/components/home/stats-row'
import { FeaturedPuzzles } from '@/components/home/featured-puzzles'
import { BrandCarousel } from '@/components/brands/brand-carousel'
import { Collections } from '@/components/home/collections'
import { SmartListsSection } from '@/components/home/smart-lists-section'
import { PuzzleOfTheDay } from '@/components/home/puzzle-of-the-day'
import { ActivityFeed } from '@/components/home/activity-feed'
import { PopularCategories } from '@/components/home/popular-categories'
import { useUserSync } from '@/lib/auth-utils'
import type { Puzzle } from '@/types/database'

export default function HomePage() {
  // Sync user with Supabase when they sign in
  useUserSync()
  
  // Mock data to test without database dependency for other components
  const featuredPuzzles: Puzzle[] = []

  const handlePuzzleClick = (puzzleId: string) => {
    // TODO: Navigate to puzzle detail page
    console.log('Navigate to puzzle:', puzzleId)
  }

  const handleViewAll = (listType: 'trending' | 'most-completed' | 'recently-added') => {
    // TODO: Navigate to dedicated list page
    console.log('View all:', listType)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section - Main landing area */}
      <HeroSection />
      
      {/* Stats Row - Key platform metrics */}
      <div className="py-16 bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">
          <StatsRow />
        </div>
      </div>

      {/* Puzzle of the Day - Daily featured puzzle */}
      <PuzzleOfTheDay />

      {/* Smart Lists - Trending, Most Completed, Recently Added (New Modular Version) */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SmartListsSection 
            onPuzzleClick={handlePuzzleClick}
            onViewAll={handleViewAll}
          />
        </div>
      </div>

      {/* Featured Puzzles - Database-driven puzzle grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FeaturedPuzzles />
        </div>
      </div>

      {/* Popular Categories - Browse by interest with filters */}
      <PopularCategories />

      {/* Brand Carousel - Brand browsing experience */}
      <BrandCarousel />

      {/* Activity Feed - Community activity preview */}
      <ActivityFeed />

      {/* Collections - Curated puzzle collections */}
      <Collections />
    </main>
  )
}
