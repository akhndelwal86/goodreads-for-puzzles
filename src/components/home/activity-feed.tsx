'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, MessageCircle, Star, CheckCircle, UserPlus, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface ActivityItem {
  id: string
  type: 'review' | 'completion' | 'follow' | 'like' | 'post'
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
  media_urls?: string[]
  stats?: {
    hours: number
    likes: number
    comments: number
  }
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real activity data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activity?limit=6&sort=trending')
        const data = await response.json()
        
        if (data.activities && data.activities.length > 0) {
          setActivities(data.activities)
        } else {
          // Fallback to mock data when no real activities exist
          setActivities(getMockActivities())
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
        // Fallback to mock data on error
        setActivities(getMockActivities())
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  // Mock data fallback
  const getMockActivities = (): ActivityItem[] => [
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
      content: 'Absolutely stunning puzzle! The colors are vibrant and the pieces fit perfectly. Took me about 9 hours over a weekend.',
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
      timestamp: '5h ago'
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
    }
  ]

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <Star className="w-3 h-3 text-amber-500" />
      case 'completion':
        return <CheckCircle className="w-3 h-3 text-emerald-500" />
      case 'follow':
        return <UserPlus className="w-3 h-3 text-blue-500" />
      case 'post':
        return <MessageSquare className="w-3 h-3 text-violet-500" />
      default:
        return <Heart className="w-3 h-3 text-rose-500" />
    }
  }

  const renderActivity = (activity: ActivityItem) => {
    if (activity.type === 'review' && activity.puzzle) {
      return (
        <div key={activity.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
          <div className="flex items-start space-x-2 md:space-x-3">
            <Avatar className="w-6 h-6 md:w-7 md:h-7 border border-white shadow-sm flex-shrink-0">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                {renderActivityIcon(activity.type)}
                <span className="font-medium text-sm text-slate-900">{activity.user.name}</span>
                <span className="text-slate-500 text-xs">reviewed</span>
                <span className="font-medium text-sm text-violet-600">"{activity.puzzle.title}"</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{activity.timestamp}</p>
              
              {/* Puzzle Info */}
              <div className="bg-slate-50/50 rounded-lg p-2 md:p-2.5 mb-2">
                <div className="flex items-center space-x-2 md:space-x-2.5">
                  <img 
                    src={activity.puzzle.image} 
                    alt={activity.puzzle.title}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-slate-900 truncate">{activity.puzzle.title}</h4>
                    <p className="text-xs text-slate-600 truncate">{activity.puzzle.brand} • {activity.puzzle.pieceCount} pieces</p>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        activity.puzzle.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                        activity.puzzle.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {activity.puzzle.difficulty}
                      </span>
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                      <span className="text-xs text-slate-600">{activity.puzzle.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-2">
                <div className="flex items-center space-x-1.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                  ))}
                  <span className="text-xs text-slate-700">Solved in {activity.stats?.hours} hours</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{activity.content}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 md:space-x-3">
                <Button variant="ghost" size="sm" className="h-6 px-1.5 md:px-2 text-slate-600 hover:text-rose-600 text-xs">
                  <Heart className="w-3 h-3 mr-0.5 md:mr-1" />
                  <span className="hidden sm:inline">Like</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-1.5 md:px-2 text-slate-600 hover:text-blue-600 text-xs">
                  <MessageCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                  <span className="hidden sm:inline">Comment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activity.type === 'completion' && activity.puzzle) {
      return (
        <div key={activity.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
          <div className="flex items-start space-x-2 md:space-x-3">
            <Avatar className="w-6 h-6 md:w-7 md:h-7 border border-white shadow-sm flex-shrink-0">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-medium text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                {renderActivityIcon(activity.type)}
                <span className="font-medium text-sm text-slate-900">{activity.user.name}</span>
                <span className="text-slate-500 text-xs">completed</span>
                <span className="font-medium text-sm text-emerald-600">"{activity.puzzle.title}"</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{activity.timestamp}</p>
              
              <div className="bg-slate-50/50 rounded-lg p-2 md:p-2.5 mb-2">
                <div className="flex items-center space-x-2 md:space-x-2.5">
                  <img 
                    src={activity.puzzle.image} 
                    alt={activity.puzzle.title}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-slate-900 truncate">{activity.puzzle.title}</h4>
                    <p className="text-xs text-slate-600 truncate">{activity.puzzle.brand} • {activity.puzzle.pieceCount} pieces</p>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium mt-0.5 ${
                      activity.puzzle.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {activity.puzzle.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 md:space-x-3">
                <Button variant="ghost" size="sm" className="h-6 px-1.5 md:px-2 text-slate-600 hover:text-rose-600 text-xs">
                  <Heart className="w-3 h-3 mr-0.5 md:mr-1" />
                  <span className="hidden sm:inline">Like</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-1.5 md:px-2 text-slate-600 hover:text-blue-600 text-xs">
                  <MessageCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                  <span className="hidden sm:inline">Comment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activity.type === 'follow') {
      return (
        <div key={activity.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
          <div className="flex items-start space-x-2 md:space-x-3">
            <Avatar className="w-6 h-6 md:w-7 md:h-7 border border-white shadow-sm flex-shrink-0">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                {renderActivityIcon(activity.type)}
                <span className="font-medium text-sm text-slate-900">{activity.user.name}</span>
                <span className="text-slate-500 text-xs">{activity.content}</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{activity.timestamp}</p>

              <div className="flex items-center space-x-2 md:space-x-3">
                <Button variant="ghost" size="sm" className="h-6 px-1.5 md:px-2 text-slate-600 hover:text-rose-600 text-xs">
                  <Heart className="w-3 h-3 mr-0.5 md:mr-1" />
                  <span className="hidden sm:inline">Like</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-1.5 md:px-2 text-slate-600 hover:text-blue-600 text-xs">
                  <MessageCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                  <span className="hidden sm:inline">Comment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activity.type === 'post') {
      return (
        <div key={activity.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
          <div className="flex items-start space-x-2 md:space-x-3">
            <Avatar className="w-6 h-6 md:w-7 md:h-7 border border-white shadow-sm flex-shrink-0">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                {renderActivityIcon(activity.type)}
                <span className="font-medium text-sm text-slate-900">{activity.user.name}</span>
                <span className="text-slate-500 text-xs">posted an update</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{activity.timestamp}</p>
              
              {/* Post Content */}
              {activity.content && (
                <div className="mb-2">
                  <p className="text-sm text-slate-700 leading-relaxed">{activity.content}</p>
                </div>
              )}

              {/* Image Gallery */}
              {activity.media_urls && activity.media_urls.length > 0 && (
                <div className="mb-2">
                  <div className={`grid gap-1 md:gap-1.5 ${
                    activity.media_urls.length === 1 ? 'grid-cols-1' :
                    'grid-cols-2'
                  }`}>
                    {activity.media_urls.slice(0, 2).map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Post image ${index + 1}`}
                          className={`w-full object-cover rounded border border-slate-200 ${
                            activity.media_urls!.length === 1 ? 'h-28 md:h-32' : 'h-16 md:h-20'
                          }`}
                        />
                        {activity.media_urls!.length > 2 && index === 1 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                            <span className="text-white text-xs font-medium">
                              +{activity.media_urls!.length - 2} more
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 md:space-x-3">
                <Button variant="ghost" size="sm" className="h-6 px-1.5 md:px-2 text-slate-600 hover:text-rose-600 text-xs">
                  <Heart className="w-3 h-3 mr-0.5 md:mr-1" />
                  <span className="hidden sm:inline">Like</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-1.5 md:px-2 text-slate-600 hover:text-blue-600 text-xs">
                  <MessageCircle className="w-3 h-3 mr-0.5 md:mr-1" />
                  <span className="hidden sm:inline">Comment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Card className="glass-card border-white/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-base font-medium text-slate-800">Trending Activity</CardTitle>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
              🔥 Hot
            </span>
          </div>
          <Link href="/community" className="text-xs font-medium text-violet-600 hover:text-violet-700">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-slate-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          activities.map(renderActivity)
        )}
      </CardContent>
    </Card>
  )
}
