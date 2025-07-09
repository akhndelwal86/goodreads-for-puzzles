'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageSquare, Star, Trophy } from 'lucide-react'

interface Stats {
  members: number
  discussions: number
  reviews: number
  challenges: number
}

export function SidebarStats() {
  const [stats, setStats] = useState<Stats>({
    members: 0,
    discussions: 0,
    reviews: 0,
    challenges: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/community/stats')
        if (response.ok) {
          const data = await response.json()
          setStats({
            members: data.stats?.activeMembers || data.stats?.members || 0,
            discussions: data.stats?.discussions || 0,
            reviews: data.stats?.reviews || 0,
            challenges: data.stats?.challenges || 0
          })
        }
      } catch (error) {
        console.error('Error fetching community stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    {
      icon: Users,
      label: 'Members',
      value: stats.members,
      color: 'text-violet-500'
    },
    {
      icon: MessageSquare,
      label: 'Discussions',
      value: stats.discussions,
      color: 'text-emerald-500'
    },
    {
      icon: Star,
      label: 'Reviews',
      value: stats.reviews,
      color: 'text-amber-500'
    },
    {
      icon: Trophy,
      label: 'Completed',
      value: stats.challenges,
      color: 'text-rose-500'
    }
  ]

  if (isLoading) {
    return (
      <Card className="glass-card border-white/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-800">Community Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="w-8 h-8 bg-slate-200 rounded-full mx-auto mb-1 animate-pulse" />
              <div className="h-3 bg-slate-200 rounded animate-pulse mb-1" />
              <div className="h-2 bg-slate-200 rounded animate-pulse w-12 mx-auto" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-white/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-800">Community Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-1">
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="text-lg font-bold text-slate-900">
              {item.value.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">{item.label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}