'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { FollowButton } from '@/components/shared/follow-button'
import { 
  Calendar, 
  Library,
  Users,
  CheckCircle,
  MessageSquare
} from 'lucide-react'

interface UserStats {
  puzzles_owned: number
  puzzles_completed: number
  total_pieces: number
  avg_solve_time_hours: number
  reviews_count: number
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

interface UserListItemProps {
  user: EnhancedUser
  className?: string
}

export function UserListItem({ user, className = '' }: UserListItemProps) {
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

  const getTopAchievement = () => {
    if (user.stats.puzzles_completed >= 50) return { emoji: '🏆', label: 'Expert' }
    if (user.followers_count >= 10) return { emoji: '👥', label: 'Popular' }
    if (user.stats.puzzles_completed >= 10) return { emoji: '🧩', label: 'Puzzle Pro' }
    if (user.stats.reviews_count >= 5) return { emoji: '⭐', label: 'Reviewer' }
    return null
  }

  const achievement = getTopAchievement()
  const latestActivity = user.recent_activity?.[0]

  return (
    <div className={`glass-card hover:shadow-lg transition-all duration-300 hover:border-violet-200/50 hover:-translate-y-1 ${className}`}>
      <div className="p-4">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <Link href={`/users/${user.id}`}>
            <Avatar className="w-14 h-14 cursor-pointer hover:scale-105 transition-transform ring-2 ring-white/50 shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/users/${user.id}`}
                  className="font-semibold text-lg text-slate-900 hover:text-violet-600 transition-colors truncate block"
                >
                  {user.name}
                </Link>
                {user.bio && (
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mt-1">
                    {user.bio}
                  </p>
                )}
                
                {/* User Meta */}
                <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{user.followers_count} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinedDate}</span>
                  </div>
                </div>
              </div>

              <FollowButton userId={user.id} size="default" iconOnly />
            </div>
          </div>

          {/* Stats & Activity */}
          <div className="hidden md:flex flex-col items-end space-y-3">
            {/* Stats */}
            <div className="flex items-center space-x-6">
              <Link 
                href={`/users/${user.id}`}
                className="text-center hover:scale-105 transition-transform"
                title={`View ${user.name}'s puzzle collection`}
              >
                <div className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                  <Library className="w-4 h-4" />
                  <span className="font-semibold">{user.stats.puzzles_owned || 0}</span>
                </div>
                <p className="text-xs text-slate-500">Owned</p>
              </Link>
              
              <Link 
                href={`/users/${user.id}`}
                className="text-center hover:scale-105 transition-transform"
                title={`View ${user.name}'s completed puzzles`}
              >
                <div className="flex items-center space-x-1 text-green-600 hover:text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">{user.stats.puzzles_completed}</span>
                </div>
                <p className="text-xs text-slate-500">Completed</p>
              </Link>
              
              {user.stats.reviews_count > 0 && (
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-amber-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-semibold">{user.stats.reviews_count}</span>
                  </div>
                  <p className="text-xs text-slate-500">Reviews</p>
                </div>
              )}
            </div>

            {/* Achievement Badge */}
            {achievement && (
              <Badge variant="secondary" className="text-xs glass-badge bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200">
                {achievement.emoji} {achievement.label}
              </Badge>
            )}
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-3 text-sm">
              <Link 
                href={`/users/${user.id}`}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                title={`View ${user.name}'s puzzle collection`}
              >
                <Library className="w-3 h-3" />
                <span className="font-medium">{user.stats.puzzles_owned || 0}</span>
              </Link>
              <Link 
                href={`/users/${user.id}`}
                className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors"
                title={`View ${user.name}'s completed puzzles`}
              >
                <CheckCircle className="w-3 h-3" />
                <span className="font-medium">{user.stats.puzzles_completed}</span>
              </Link>
            </div>
            
            {achievement && (
              <Badge variant="secondary" className="text-xs glass-badge bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200">
                {achievement.emoji}
              </Badge>
            )}
          </div>
        </div>

        {/* Latest Activity */}
        {latestActivity && (
          <div className="border-t border-slate-100 pt-3 mt-3">
            <div className="text-sm text-slate-600 flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
              <span className="leading-relaxed">
                <span className="font-medium">Latest Activity:</span>{' '}
                {latestActivity.type === 'review' 
                  ? `Reviewed ${latestActivity.puzzle_title || 'a puzzle'} • ${getTimeAgo(latestActivity.created_at)}`
                  : `Completed ${latestActivity.puzzle_title || 'a puzzle'} • ${getTimeAgo(latestActivity.created_at)}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Empty State for New Users */}
        {(!user.recent_activity || user.recent_activity.length === 0) && user.stats.puzzles_completed === 0 && (
          <div className="border-t border-slate-100 pt-3 mt-3">
            <p className="text-sm text-slate-500 italic">
              New to the community - no activity yet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}