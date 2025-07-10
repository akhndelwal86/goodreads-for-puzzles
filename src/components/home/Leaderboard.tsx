'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Award, Medal, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface LeaderboardUser {
  id: string
  rank: number
  name: string
  username: string
  avatar: string
  puzzlesSolved: number
  badge?: 'gold' | 'silver' | 'bronze'
}

export function Leaderboard() {
  const leaders: LeaderboardUser[] = [
    {
      id: '1',
      rank: 1,
      name: 'Alex Chen',
      username: 'alexchen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      puzzlesSolved: 156,
      badge: 'gold'
    },
    {
      id: '2',
      rank: 2,
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face',
      puzzlesSolved: 134,
      badge: 'silver'
    },
    {
      id: '3',
      rank: 3,
      name: 'Mike Rodriguez',
      username: 'mikerod',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      puzzlesSolved: 98,
      badge: 'bronze'
    },
    {
      id: '4',
      rank: 4,
      name: 'Emma Wilson',
      username: 'emmaw',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      puzzlesSolved: 87
    },
    {
      id: '5',
      rank: 5,
      name: 'David Kim',
      username: 'davidk',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      puzzlesSolved: 76
    }
  ]

  const getRankIcon = (rank: number, badge?: string) => {
    if (badge === 'gold') {
      return <Trophy className="w-4 h-4 text-yellow-500" />
    }
    if (badge === 'silver') {
      return <Award className="w-4 h-4 text-gray-400" />
    }
    if (badge === 'bronze') {
      return <Medal className="w-4 h-4 text-amber-600" />
    }
    return (
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
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

  return (
    <Card className="glass-card border-white/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <Trophy className="w-3 h-3 text-white" />
            </div>
            <CardTitle className="text-base font-medium text-slate-800">This Month's Leaders</CardTitle>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-1">Most puzzles solved this month</p>
      </CardHeader>
      
      <CardContent className="space-y-2.5">
        {leaders.map((user, index) => (
          <div 
            key={user.id}
            className={`flex items-center space-x-2.5 p-2 rounded-xl transition-all duration-200 hover:bg-slate-50/50 group ${
              user.badge ? 'bg-gradient-to-r from-white/80 to-slate-50/50 border border-white/60' : ''
            }`}
          >
            {/* Rank/Badge */}
            <div className="flex-shrink-0">
              {getRankIcon(user.rank, user.badge)}
            </div>

            {/* Avatar */}
            <Avatar className={`w-7 h-7 border shadow-sm ${
              user.badge ? `border-${user.badge === 'gold' ? 'yellow' : user.badge === 'silver' ? 'gray' : 'amber'}-400` : 'border-white'
            }`}>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className={`bg-gradient-to-br ${getBadgeGradient(user.badge)} text-white font-medium text-xs`}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="font-medium text-sm text-slate-900 truncate">{user.name}</h4>
                {user.badge && (
                  <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getBadgeGradient(user.badge)} text-white`}>
                    {user.badge === 'gold' ? '🥇' : user.badge === 'silver' ? '🥈' : '🥉'}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500">@{user.username}</p>
            </div>

            {/* Puzzle Count */}
            <div className="text-right">
              <div className="text-sm font-medium text-violet-600">{user.puzzlesSolved}</div>
              <div className="text-xs text-slate-500">puzzles</div>
            </div>
          </div>
        ))}

        {/* View Community Feed Link */}
        <Link 
          href="/community"
          className="flex items-center justify-center space-x-1.5 w-full p-2 mt-3 text-xs font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-all duration-200 group"
        >
          <span>View Community Feed</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  )
}
