'use client'

import { useQuery } from '@tanstack/react-query'
import { Users, Puzzle, MessageCircle, Calendar, Clock } from 'lucide-react'
import { queryKeys } from '@/lib/react-query'

interface HomepageStats {
  totalPuzzles: number
  totalUsers: number
  totalReviews: number
  solvedToday: number
  activeNow: number
}

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  isLoading?: boolean
}

function StatItem({ icon: Icon, label, value, isLoading }: StatItemProps) {

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center group">
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 bg-violet-50 rounded-xl group-hover:bg-violet-100 transition-colors duration-300">
          <Icon className="w-6 h-6 text-violet-600" />
        </div>
        
        <div className="space-y-1">
          {isLoading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mx-auto" />
          ) : (
            <div className="text-2xl font-bold text-gray-900">
              {value.toLocaleString()}
            </div>
          )}
          
          <div className="text-sm font-normal text-gray-600">
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}

// Fetch function for React Query
async function fetchHomepageStats(): Promise<HomepageStats> {
  const response = await fetch('/api/homepage-stats')
  if (!response.ok) {
    throw new Error('Failed to fetch homepage stats')
  }
  return response.json()
}

export function StatsStrip() {
  const { 
    data: stats, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: queryKeys.homepageStats,
    queryFn: fetchHomepageStats,
    // Use fallback data if the query fails
    placeholderData: {
      totalPuzzles: 17,
      totalUsers: 9,
      totalReviews: 10,
      solvedToday: 3,
      activeNow: 0
    },
    // Stats don't change very often, so we can cache them longer
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })


  return (
    <section className="pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <StatItem
            icon={Puzzle}
            label="Puzzles"
            value={stats?.totalPuzzles || 0}
            isLoading={isLoading}
          />
          <StatItem
            icon={Users}
            label="Community"
            value={stats?.totalUsers || 0}
            isLoading={isLoading}
          />
          <StatItem
            icon={MessageCircle}
            label="Reviews"
            value={stats?.totalReviews || 0}
            isLoading={isLoading}
          />
          <StatItem
            icon={Calendar}
            label="Solved Today"
            value={stats?.solvedToday || 0}
            isLoading={isLoading}
          />
          <StatItem
            icon={Clock}
            label="Active Now"
            value={stats?.activeNow || 0}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  )
}
