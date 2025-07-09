'use client'

import type { UserPuzzleStats, UserPuzzle } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Calendar, Flame, BookOpen } from 'lucide-react'

interface OverviewWidgetProps {
  stats: UserPuzzleStats | null
  puzzles: UserPuzzle[]
}

export function OverviewWidget({ stats, puzzles }: OverviewWidgetProps) {
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
    <Card className="glass-card border-white/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-800">Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {overviewStats.map((item, index) => (
          <div key={index} className="text-center p-2 rounded-lg hover:bg-slate-50/50 transition-all duration-200">
            <div className="flex items-center justify-center mb-1">
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="text-base font-bold text-slate-900">
              {item.value.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">{item.label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}