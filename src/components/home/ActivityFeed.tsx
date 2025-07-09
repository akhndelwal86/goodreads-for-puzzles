import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Star, CheckCircle, UserPlus } from 'lucide-react'

export interface Activity {
  id: string
  type: 'review' | 'completion' | 'follow' | 'like'
  user: {
    name: string
    username: string
    avatar: string
  }
  puzzle?: {
    id: string
    title: string
    brand: string
    image: string
    pieceCount: number
    difficulty: string
    rating: number
  }
  content?: string
  timestamp: string
  stats?: {
    hours: number
    likes: number
    comments: number
  }
}

interface CommunityActivityFeedProps {
  limit?: number
  showHeader?: boolean
}

export default function CommunityActivityFeed({ limit = 10, showHeader = true }: CommunityActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real activity data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/activity?limit=${limit}`)
        const data = await response.json()
        
        if (data.activities && data.activities.length > 0) {
          setActivities(data.activities)
        } else {
          // Fallback to mock data when no real activities exist
          setActivities(getMockActivities().slice(0, limit))
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
        // Fallback to mock data on error
        setActivities(getMockActivities().slice(0, limit))
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [limit])

  // Mock data fallback
  const getMockActivities = (): Activity[] => [
    {
      id: '1',
      type: 'review',
      user: {
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face'
      },
      puzzle: {
        id: '1',
        title: 'Sunset Mountains',
        brand: 'Ravensburger',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
        pieceCount: 1000,
        difficulty: 'Medium',
        rating: 4.8
      },
      content: 'Absolutely stunning puzzle! The colors are vibrant and the pieces fit perfectly. This was such a relaxing weekend project.',
      timestamp: '2h ago',
      stats: {
        hours: 9,
        likes: 12,
        comments: 3
      }
    },
    {
      id: '2',
      type: 'completion',
      user: {
        name: 'Mike Rodriguez',
        username: 'mikerod',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
      },
      puzzle: {
        id: '2',
        title: 'Ocean Waves',
        brand: 'Buffalo Games',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=80&h=80&fit=crop',
        pieceCount: 750,
        difficulty: 'Easy',
        rating: 4.6
      },
      timestamp: '5h ago',
      content: 'Just finished this beautiful ocean scene!'
    },
    {
      id: '3',
      type: 'follow',
      user: {
        name: 'Alex Chen',
        username: 'alexchen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      },
      content: 'started following Sarah Johnson',
      timestamp: '1d ago'
    },
    {
      id: '4',
      type: 'review',
      user: {
        name: 'Emma Wilson',
        username: 'emmaw',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
      },
      puzzle: {
        id: '4',
        title: 'Cherry Blossoms',
        brand: 'Springbok',
        image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=80&h=80&fit=crop',
        pieceCount: 500,
        difficulty: 'Easy',
        rating: 4.5
      },
      content: 'Perfect for beginners! Beautiful colors and not too challenging.',
      timestamp: '1d ago',
      stats: {
        hours: 4,
        likes: 8,
        comments: 2
      }
    },
    {
      id: '5',
      type: 'completion',
      user: {
        name: 'David Park',
        username: 'davidp',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face'
      },
      puzzle: {
        id: '5',
        title: 'Ancient Castle',
        brand: 'Clementoni',
        image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c11a?w=80&h=80&fit=crop',
        pieceCount: 2000,
        difficulty: 'Hard',
        rating: 4.9
      },
      timestamp: '2d ago',
      content: 'My biggest challenge yet - took me 3 weeks but so worth it!'
    }
  ]

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <Star className="w-4 h-4 text-amber-500" />
      case 'completion':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'follow':
        return <UserPlus className="w-4 h-4 text-blue-500" />
      default:
        return <Heart className="w-4 h-4 text-rose-500" />
    }
  }

  const renderActivity = (activity: Activity) => {
    return (
      <Card key={activity.id} className="glass-card border-white/40 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              {/* Activity Header */}
              <div className="flex items-center space-x-2 mb-2">
                {renderActivityIcon(activity.type)}
                <span className="font-semibold text-slate-900">{activity.user.name}</span>
                <span className="text-slate-500 text-sm">
                  {activity.type === 'review' ? 'reviewed' : 
                   activity.type === 'completion' ? 'completed' : 
                   activity.type === 'follow' ? activity.content : 'liked'}
                </span>
                {activity.puzzle && (
                  <span className="font-medium text-violet-600">"{activity.puzzle.title}"</span>
                )}
              </div>
              
              <p className="text-slate-500 text-sm mb-3">{activity.timestamp}</p>

              {/* Puzzle Info */}
              {activity.puzzle && (
                <div className="bg-slate-50/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={activity.puzzle.image} 
                      alt={activity.puzzle.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{activity.puzzle.title}</h4>
                      <p className="text-sm text-slate-600">{activity.puzzle.brand} • {activity.puzzle.pieceCount} pieces</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.puzzle.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                          activity.puzzle.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {activity.puzzle.difficulty}
                        </span>
                        {activity.type === 'review' && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-sm text-slate-600">{activity.puzzle.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              {activity.content && activity.type !== 'follow' && (
                <div className="mb-4">
                  {activity.type === 'review' && (
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                      {activity.stats?.hours && (
                        <span className="text-sm text-slate-600 ml-2">
                          Solved in {activity.stats.hours} hours
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-slate-700 leading-relaxed">{activity.content}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-slate-600 hover:text-rose-600">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{activity.stats?.likes || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-slate-600 hover:text-blue-600">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{activity.stats?.comments || 0}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Community Activity</h2>
          </div>
        )}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="glass-card border-white/40">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
                    <div className="h-20 bg-slate-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Community Activity</h2>
          <Button variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50">
            Refresh
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {activities.map(renderActivity)}
      </div>
    </div>
  )
} 