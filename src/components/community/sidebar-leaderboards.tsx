'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Award, Medal, Star, Zap, Calendar } from 'lucide-react'

interface LeaderboardUser {
  id: string
  rank: number
  name: string
  username: string
  avatar: string
  puzzlesSolved: number
  reviewCount?: number
  avgRating?: number
  avgTimeFormatted?: string
  fastestTimeFormatted?: string
  badge?: 'gold' | 'silver' | 'bronze'
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[]
  title: string
  period: string
}

type LeaderboardType = 'monthly-solved' | 'top-reviewers' | 'speed-champions'

export function SidebarLeaderboards() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('monthly-solved')
  const [data, setData] = useState<Record<LeaderboardType, LeaderboardData | null>>({
    'monthly-solved': null,
    'top-reviewers': null,
    'speed-champions': null
  })
  const [isLoading, setIsLoading] = useState(true)

  const tabs = [
    { 
      id: 'monthly-solved' as LeaderboardType, 
      label: 'Monthly', 
      icon: Calendar,
      color: 'text-emerald-500'
    },
    { 
      id: 'top-reviewers' as LeaderboardType, 
      label: 'Reviewers', 
      icon: Star,
      color: 'text-amber-500'
    },
    { 
      id: 'speed-champions' as LeaderboardType, 
      label: 'Speed', 
      icon: Zap,
      color: 'text-violet-500'
    }
  ]

  useEffect(() => {
    const fetchLeaderboard = async (type: LeaderboardType) => {
      try {
        const response = await fetch(`/api/leaderboards/${type}`)
        if (response.ok) {
          const result = await response.json()
          setData(prev => ({ ...prev, [type]: result }))
        }
      } catch (error) {
        console.error(`Error fetching ${type} leaderboard:`, error)
      }
    }

    // Fetch active tab data first
    fetchLeaderboard(activeTab)
    
    // Then fetch other tabs in background
    tabs.forEach(tab => {
      if (tab.id !== activeTab) {
        fetchLeaderboard(tab.id)
      }
    })

    setIsLoading(false)
  }, [activeTab])

  const getRankIcon = (rank: number, badge?: string) => {
    if (badge === 'gold') {
      return <Trophy className="w-3 h-3 text-yellow-500" />
    }
    if (badge === 'silver') {
      return <Award className="w-3 h-3 text-gray-400" />
    }
    if (badge === 'bronze') {
      return <Medal className="w-3 h-3 text-amber-600" />
    }
    return (
      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
        <span className="text-white text-xs font-medium">#{rank}</span>
      </div>
    )
  }

  const getBadgeGradient = (badge?: string) => {
    switch (badge) {
      case 'gold':
        return 'from-yellow-400 to-yellow-600'
      case 'silver':
        return 'from-gray-300 to-gray-500'
      case 'bronze':
        return 'from-amber-400 to-amber-600'
      default:
        return 'from-violet-500 to-purple-600'
    }
  }

  const renderUserStat = (user: LeaderboardUser) => {
    switch (activeTab) {
      case 'monthly-solved':
        return (
          <div className="text-right">
            <div className="text-sm font-medium text-violet-600">{user.puzzlesSolved}</div>
            <div className="text-xs text-slate-500">solved</div>
          </div>
        )
      case 'top-reviewers':
        return (
          <div className="text-right">
            <div className="text-sm font-medium text-amber-600">{user.reviewCount || user.puzzlesSolved}</div>
            <div className="text-xs text-slate-500">reviews</div>
            {user.avgRating && (
              <div className="text-xs text-slate-400">★{user.avgRating}</div>
            )}
          </div>
        )
      case 'speed-champions':
        return (
          <div className="text-right">
            <div className="text-sm font-medium text-violet-600">{user.avgTimeFormatted}</div>
            <div className="text-xs text-slate-500">avg time</div>
          </div>
        )
      default:
        return null
    }
  }

  const currentData = data[activeTab]
  const leaderboard = currentData?.leaderboard?.slice(0, 5) || [] // Show top 5 for sidebar

  return (
    <Card className="glass-card border-white/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-800">Leaderboards</CardTitle>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
      
      <CardContent className="space-y-2">
        {isLoading || !currentData ? (
          // Loading state
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2 p-2 rounded-lg">
              <div className="w-4 h-4 bg-slate-200 rounded-full animate-pulse" />
              <div className="w-6 h-6 bg-slate-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-2 bg-slate-200 rounded animate-pulse w-1/2" />
              </div>
              <div className="w-8 h-4 bg-slate-200 rounded animate-pulse" />
            </div>
          ))
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">No data available yet</p>
          </div>
        ) : (
          leaderboard.map((user, index) => (
            <div 
              key={user.id}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:bg-slate-50/50 ${
                user.badge ? 'bg-gradient-to-r from-white/80 to-slate-50/50' : ''
              }`}
            >
              {/* Rank/Badge */}
              <div className="flex-shrink-0">
                {getRankIcon(user.rank, user.badge)}
              </div>

              {/* Avatar */}
              <Avatar className="w-6 h-6 border shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={`bg-gradient-to-br ${getBadgeGradient(user.badge)} text-white font-medium text-xs`}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <h4 className="font-medium text-xs text-slate-900 truncate">{user.name}</h4>
                  {user.badge && (
                    <div className="text-xs">
                      {user.badge === 'gold' ? '🥇' : user.badge === 'silver' ? '🥈' : '🥉'}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">@{user.username}</p>
              </div>

              {/* Stats */}
              {renderUserStat(user)}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}