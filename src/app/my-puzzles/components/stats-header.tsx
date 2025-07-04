'use client'

import type { UserPuzzleStats } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'

interface StatsHeaderProps {
  user: {
    firstName?: string | null
    username?: string | null
  }
  stats: UserPuzzleStats | null
}

export function StatsHeader({ user, stats }: StatsHeaderProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    if (hours === 0) return '0 hours'
    if (hours === 1) return '1 hour'
    return `${hours} hours`
  }

  return (
    <div className="mb-8">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.firstName || user.username || 'Puzzler'}! 👋
        </h1>
        <p className="text-gray-600 text-lg">Your Puzzle Journey</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              🧩 {stats?.totalCompleted || 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-violet-600 mb-1">
              ⏱️ {formatTime(stats?.totalTimeSpent || 0)}
            </div>
            <div className="text-sm text-gray-600">Total Time</div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              🏆 {stats?.thisMonthCompleted || 0}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-purple-600 mb-1">
              ⭐ {stats?.favoriteBrand || 'None'}
            </div>
            <div className="text-sm text-gray-600">Favorite Brand</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 