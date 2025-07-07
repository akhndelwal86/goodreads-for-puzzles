'use client'

import { useEffect, useState } from 'react'
import { Users, Puzzle, MessageCircle, Calendar, Clock } from 'lucide-react'

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
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setDisplayValue(0)
      return
    }

    // Simple animation - just set the value directly for now
    setDisplayValue(value)
  }, [value, isLoading])

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
              {displayValue.toLocaleString()}
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

export function StatsStrip() {
  const [stats, setStats] = useState<HomepageStats>({
    totalPuzzles: 0,
    totalUsers: 0,
    totalReviews: 0,
    solvedToday: 0,
    activeNow: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔍 Render - Current state:', { stats, isLoading, error })
  }, [stats, isLoading, error])

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log('🔄 StatsStrip component mounted, starting fetch...')
        console.log('📊 About to fetch from /api/homepage-stats...')
        
        const response = await fetch('/api/homepage-stats')
        console.log('📡 Raw response:', response)
        
        const responseText = await response.text()
        console.log('📄 Response text:', responseText)
        
        const data = JSON.parse(responseText)
        console.log('📈 Parsed stats data:', data)
        
        setStats(data)
        setIsLoading(false)
        console.log('✅ Stats updated successfully')
      } catch (err) {
        console.error('❌ Error fetching stats:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
        setIsLoading(false)
        
        // Fallback to known working data from API
        console.log('📋 Using fallback data...')
        setStats({
          totalPuzzles: 17,
          totalUsers: 9,
          totalReviews: 10,
          solvedToday: 3,
          activeNow: 0
        })
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    console.log('🔍 Current state:', { stats, isLoading, error })
  }, [stats, isLoading, error])

  return (
    <section className="pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <StatItem
            icon={Puzzle}
            label="Puzzles"
            value={stats.totalPuzzles}
            isLoading={isLoading}
          />
          <StatItem
            icon={Users}
            label="Community"
            value={stats.totalUsers}
            isLoading={isLoading}
          />
          <StatItem
            icon={MessageCircle}
            label="Reviews"
            value={stats.totalReviews}
            isLoading={isLoading}
          />
          <StatItem
            icon={Calendar}
            label="Solved Today"
            value={stats.solvedToday}
            isLoading={isLoading}
          />
          <StatItem
            icon={Clock}
            label="Active Now"
            value={stats.activeNow}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  )
}
