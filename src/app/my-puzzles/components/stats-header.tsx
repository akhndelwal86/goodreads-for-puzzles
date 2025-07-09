'use client'

import type { UserPuzzleStats, UserPuzzle } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Clock, Calendar, Award, BarChart3, Timer, Flame, BookOpen } from 'lucide-react'

interface StatsHeaderProps {
  user: {
    firstName?: string | null
    username?: string | null
  }
  stats: UserPuzzleStats | null
  activeTab: 'overview' | 'records'
  onTabChange: (tab: 'overview' | 'records') => void
  puzzles: UserPuzzle[]
}

export function StatsHeader({ user, stats, activeTab, onTabChange, puzzles }: StatsHeaderProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours === 0 && minutes === 0) return '0m'
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  // Calculate weekly streak
  const calculateWeeklyStreak = () => {
    if (!puzzles.length) return 0
    
    const completedPuzzles = puzzles
      .filter(p => p.status === 'completed' && p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    
    if (!completedPuzzles.length) return 0

    const weeksWithPuzzles = new Set<string>()
    completedPuzzles.forEach(puzzle => {
      const date = new Date(puzzle.completedAt!)
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      const weekKey = startOfWeek.toISOString().split('T')[0]
      weeksWithPuzzles.add(weekKey)
    })

    const sortedWeeks = Array.from(weeksWithPuzzles).sort().reverse()
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < sortedWeeks.length; i++) {
      const weekStart = new Date(sortedWeeks[i])
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      const weeksAgo = Math.floor((today.getTime() - weekEnd.getTime()) / (7 * 24 * 60 * 60 * 1000))
      
      if (i === 0 && weeksAgo <= 1) {
        streak++
      } else if (i > 0) {
        const prevWeek = new Date(sortedWeeks[i - 1])
        const currentWeek = new Date(sortedWeeks[i])
        const weekDiff = Math.floor((prevWeek.getTime() - currentWeek.getTime()) / (7 * 24 * 60 * 60 * 1000))
        
        if (weekDiff === 1) {
          streak++
        } else {
          break
        }
      } else {
        break
      }
    }
    
    return streak
  }

  // Calculate total owned puzzles
  const getTotalOwned = () => {
    return puzzles.filter(p => 
      p.status === 'library' || 
      p.status === 'in-progress' || 
      p.status === 'completed'
    ).length
  }

  // Get best times by piece count
  const getBestTimes = () => {
    const pieceCounts = [250, 500, 750, 1000, 1500, 2000]
    const bestTimes: Record<number, number | null> = {}
    
    pieceCounts.forEach(count => {
      const relevantPuzzles = puzzles.filter(p => 
        p.status === 'completed' && 
        p.timeSpent && 
        p.timeSpent > 0 &&
        Math.abs(p.pieces - count) <= 50 // Allow some tolerance
      )
      
      if (relevantPuzzles.length > 0) {
        bestTimes[count] = Math.min(...relevantPuzzles.map(p => p.timeSpent!))
      } else {
        bestTimes[count] = null
      }
    })
    
    return bestTimes
  }

  const tabs = [
    { 
      id: 'overview' as const, 
      label: 'Overview', 
      icon: BarChart3,
      color: 'text-violet-500'
    },
    { 
      id: 'records' as const, 
      label: 'Records', 
      icon: Timer,
      color: 'text-emerald-500'
    }
  ]

  const renderOverviewStats = () => {
    const overviewStats = [
      {
        icon: Trophy,
        label: 'Total Solved',
        value: stats?.totalCompleted || 0,
        color: 'text-emerald-500'
      },
      {
        icon: Calendar,
        label: 'This Month',
        value: stats?.thisMonthCompleted || 0,
        color: 'text-violet-500'
      },
      {
        icon: Flame,
        label: 'Week Streak',
        value: calculateWeeklyStreak(),
        color: 'text-amber-500'
      },
      {
        icon: BookOpen,
        label: 'Total Owned',
        value: getTotalOwned(),
        color: 'text-rose-500'
      }
    ]

    return (
      <div className="grid grid-cols-2 gap-3">
        {overviewStats.map((item, index) => (
          <div key={index} className="text-center p-2 rounded-lg hover:bg-slate-50/50 transition-all duration-200">
            <div className="flex items-center justify-center mb-1">
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="text-lg font-bold text-slate-900">
              {item.value.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">{item.label}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderRecordsStats = () => {
    const bestTimes = getBestTimes()
    const pieceCounts = [250, 500, 750, 1000, 1500, 2000]
    
    return (
      <div className="space-y-2">
        {pieceCounts.map((count, index) => (
          <div key={count} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/50 transition-all duration-200">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-[8px] font-medium">{count}</span>
              </div>
              <span className="text-xs font-medium text-slate-700">{count}pc</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                {bestTimes[count] ? formatTime(bestTimes[count]!) : '-'}
              </div>
              {bestTimes[count] && (
                <div className="text-xs text-slate-500">best time</div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="glass-card border-white/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-800">My Stats</CardTitle>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <tab.icon className={`w-3 h-3 ${activeTab === tab.id ? 'text-violet-600' : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {activeTab === 'overview' ? renderOverviewStats() : renderRecordsStats()}
      </CardContent>
    </Card>
  )
} 