'use client'

import { useRouter } from 'next/navigation'
import { HeroSection } from '@/components/home/hero-section'
import { StatsStrip } from '@/components/home/stats-strip'
import { PuzzleOfTheDay } from '@/components/home/puzzle-of-the-day'
import { SmartListsSection } from '@/components/home/smart-lists-section'

import { CategoryBrowser } from '@/components/home/category-browser'
import dynamic from 'next/dynamic'
import { useUserSync } from '@/lib/auth-utils'
import { FollowProvider } from '@/contexts/follow-context'
import { Suspense } from 'react'
import { ActivityFeedSkeleton, LeaderboardSkeleton } from '@/components/ui/loading-skeleton'

// Dynamically import heavy components below the fold
const CommunityActivityFeed = dynamic(() => import('@/components/home/ActivityFeed'), {
  loading: () => <ActivityFeedSkeleton />,
  ssr: false, // These components don't need SSR since they're below the fold
})

const Leaderboard = dynamic(() => import('@/components/home/Leaderboard').then(mod => ({ default: mod.Leaderboard })), {
  loading: () => <LeaderboardSkeleton />,
  ssr: false,
})

const PopularBrandsCarousel = dynamic(() => import('@/components/home/popular-brands-carousel').then(mod => ({ default: mod.PopularBrandsCarousel })), {
  loading: () => <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />,
  ssr: true, // Keep SSR for better SEO
})

export default function HomePage() {
  const router = useRouter()
  
  // Sync user with Supabase when they sign in
  useUserSync()

  const handlePuzzleClick = (puzzleId: string) => {
    router.push(`/puzzles/${puzzleId}`)
  }

  const handleViewAll = (listType: 'trending' | 'most-completed' | 'recently-added' | 'top-rated') => {
    // TODO: Navigate to dedicated list page
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
