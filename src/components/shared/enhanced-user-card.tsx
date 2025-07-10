'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FollowButton } from '@/components/shared/follow-button'
import { 
  Calendar, 
  Trophy, 
  Star, 
  Clock, 
  MessageSquare,
  Puzzle,
  Users
} from 'lucide-react'

interface UserStats {
  puzzles_completed: number
  total_pieces: number
  avg_solve_time_hours: number
  avg_user_rating: number
  reviews_count: number
  avg_review_rating: number
}

interface RecentActivity {
  type: string
  text: string
  created_at: string
  puzzle_title?: string
  review_rating?: number
}

interface EnhancedUser {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  followers_count: number
  following_count: number
  joined: string
  stats: UserStats
  recent_activity: RecentActivity[]
}

interface EnhancedUserCardProps {
  user: EnhancedUser
  className?: string
}

export function EnhancedUserCard({ user, className = '' }: EnhancedUserCardProps) {
  const formatActivity = (activity: RecentActivity) => {
    const timeAgo = getTimeAgo(activity.created_at)
    
    switch (activity.type) {
      case 'review':
        return `Reviewed ${activity.puzzle_title || 'a puzzle'}${activity.review_rating ? ` - ${activity.review_rating} stars` : ''} • ${timeAgo}`
      case 'solved':
        return `Completed ${activity.puzzle_title || 'a puzzle'} • ${timeAgo}`
      case 'add_to_list':
        return `Added ${activity.puzzle_title || 'a puzzle'} to list • ${timeAgo}`
      case 'puzzle_upload':
        return `Uploaded ${activity.puzzle_title || 'a new puzzle'} • ${timeAgo}`
      default:
        return activity.text ? `${activity.text} • ${timeAgo}` : `Recent activity • ${timeAgo}`
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`
    
    return `${Math.floor(diffInDays / 30)}mo ago`
  }

  const joinedDate = new Date(user.joined).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })

  return (
    <Card className={`glass-card hover:shadow-xl transition-all duration-300 hover:border-violet-200/50 hover:-translate-y-2 ${className}`}>
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <Link href={`/users/${user.id}`}>
              <Avatar className="w-16 h-16 cursor-pointer hover:scale-105 transition-transform ring-2 ring-white/50 shadow-xl">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-lg font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex-1 min-w-0">
              <Link 
                href={`/users/${user.id}`}
                className="font-bold text-lg text-slate-900 hover:text-violet-600 transition-colors truncate block"
              >
                {user.name}
              </Link>
              {user.bio && (
                <p className="text-slate-600 mt-1 text-sm line-clamp-2 leading-relaxed">
                  {user.bio}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{user.followers_count} followers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
          
          <FollowButton userId={user.id} size="sm" iconOnly />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Puzzle className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-800">{user.stats.puzzles_completed}</span>
            </div>
            <p className="text-xs text-blue-600 font-medium">Completed</p>
          </div>
          
          {user.stats.reviews_count > 0 && (
            <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-800">{user.stats.reviews_count}</span>
              </div>
              <p className="text-xs text-amber-600 font-medium">Reviews</p>
            </div>
          )}
          
          {user.stats.avg_user_rating > 0 && (
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-green-600 fill-current" />
                <span className="font-bold text-green-800">{user.stats.avg_user_rating}</span>
              </div>
              <p className="text-xs text-green-600 font-medium">Avg Rating</p>
            </div>
          )}
          
          {user.stats.avg_solve_time_hours > 0 && (
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-purple-800">{user.stats.avg_solve_time_hours}h</span>
              </div>
              <p className="text-xs text-purple-600 font-medium">Avg Time</p>
            </div>
          )}
        </div>

        {/* Achievement Badges */}
        {(user.stats.puzzles_completed >= 10 || user.stats.reviews_count >= 5 || user.followers_count >= 10) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {user.stats.puzzles_completed >= 10 && (
              <Badge variant="secondary" className="text-xs glass-badge bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
                🧩 Puzzle Pro
              </Badge>
            )}
            {user.stats.reviews_count >= 5 && (
              <Badge variant="secondary" className="text-xs glass-badge bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200">
                ⭐ Reviewer
              </Badge>
            )}
            {user.followers_count >= 10 && (
              <Badge variant="secondary" className="text-xs glass-badge bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                👥 Popular
              </Badge>
            )}
            {user.stats.puzzles_completed >= 50 && (
              <Badge variant="secondary" className="text-xs glass-badge bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200">
                🏆 Expert
              </Badge>
            )}
          </div>
        )}

        {/* Recent Activity */}
        {user.recent_activity && user.recent_activity.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-slate-500" />
              <span>Recent Activity</span>
            </h4>
            <div className="space-y-2">
              {user.recent_activity.slice(0, 2).map((activity, index) => (
                <div key={index} className="text-sm text-slate-600 flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">{formatActivity(activity)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for No Activity */}
        {(!user.recent_activity || user.recent_activity.length === 0) && user.stats.puzzles_completed === 0 && (
          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500 italic text-center py-2">
              New to the community - no activity yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}