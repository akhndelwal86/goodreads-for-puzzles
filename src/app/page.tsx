'use client'

import { useRouter } from 'next/navigation'
import { HeroSection } from '@/components/home/hero-section'
import { StatsStrip } from '@/components/home/stats-strip'
import { PuzzleOfTheDay } from '@/components/home/puzzle-of-the-day'
import { SmartListsSection } from '@/components/home/smart-lists-section'

import { CategoryBrowser } from '@/components/home/category-browser'
import { PopularBrandsCarousel } from '@/components/home/popular-brands-carousel'
import CommunityActivityFeed from '@/components/home/ActivityFeed'
import { Leaderboard } from '@/components/home/Leaderboard'
import { useUserSync } from '@/lib/auth-utils'
import { FollowProvider } from '@/contexts/follow-context'

export default function HomePage() {
  const router = useRouter()
  
  // Sync user with Supabase when they sign in
  useUserSync()

  const handlePuzzleClick = (puzzleId: string) => {
    console.log('Navigating to puzzle:', puzzleId)
    router.push(`/puzzles/${puzzleId}`)
  }

  const handleViewAll = (listType: 'trending' | 'most-completed' | 'recently-added' | 'top-rated') => {
    // TODO: Navigate to dedicated list page
    console.log('View all:', listType)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      {/* Hero Section - Full Width */}
      <HeroSection />
      
      {/* Stats Strip - Full Width */}
      <StatsStrip />

      {/* Sequential Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Puzzle of the Day */}
        <PuzzleOfTheDay />

        {/* Smart Lists */}
        <div className="bg-gradient-to-br from-violet-50/50 via-white to-emerald-50/30 rounded-3xl p-6">
          <SmartListsSection 
            onPuzzleClick={handlePuzzleClick}
            onViewAll={handleViewAll}
          />
        </div>

        {/* Category Browser */}
        <CategoryBrowser />

        {/* Popular Brands Carousel */}
        <PopularBrandsCarousel />

        {/* Activity Feed and Leaderboard Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Trending Activity</h2>
            <FollowProvider>
              <CommunityActivityFeed showHeader={false} limit={4} />
            </FollowProvider>
          </div>
          <Leaderboard />
        </div>

      </div>
    </main>
  )
}
