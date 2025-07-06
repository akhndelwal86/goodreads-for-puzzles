'use client'

import type { UserPuzzleStats } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Clock, Calendar, Award } from 'lucide-react'

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
    <div className="space-y-6">
      {/* Premium Welcome Section */}
      <div className="glass-card border-white/30 rounded-2xl p-8 text-center bg-gradient-to-br from-violet-50/50 to-emerald-50/50">
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-3 leading-tight">
          Welcome back, <span className="gradient-text">{user.firstName || user.username || 'Puzzler'}</span>! 👋
        </h1>
        <p className="text-xl text-slate-600 font-normal">Your Premium Puzzle Journey</p>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card hover-lift border border-white/40 group">
          <div className="p-5 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
              {stats?.totalCompleted || 0}
            </div>
            <div className="text-sm text-slate-500 font-medium">Completed Puzzles</div>
          </div>
        </div>

        <div className="glass-card hover-lift border border-white/40 group">
          <div className="p-5 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-semibold text-slate-800 group-hover:text-violet-600 transition-colors">
              {formatTime(stats?.totalTimeSpent || 0)}
            </div>
            <div className="text-sm text-slate-500 font-medium">Total Time</div>
          </div>
        </div>

        <div className="glass-card hover-lift border border-white/40 group">
          <div className="p-5 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
              {stats?.thisMonthCompleted || 0}
            </div>
            <div className="text-sm text-slate-500 font-medium">This Month</div>
          </div>
        </div>

        <div className="glass-card hover-lift border border-white/40 group">
          <div className="p-5 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-lg font-semibold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
              {stats?.favoriteBrand || 'None'}
            </div>
            <div className="text-sm text-slate-500 font-medium">Favorite Brand</div>
          </div>
        </div>
      </div>
    </div>
  )
} 