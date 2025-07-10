import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Star, CheckCircle, UserPlus, MessageSquare, Loader2 } from 'lucide-react'
import { LikeButton } from '@/components/community/like-button'
import { CommentSection } from '@/components/community/comment-section'
import { FollowButton } from '@/components/shared/follow-button'
import Link from 'next/link'

export interface Activity {
  id: string
  type: 'review' | 'completion' | 'follow' | 'like' | 'post' | 'puzzle_log'
  user: {
    id: string
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
  metadata?: {
    rating?: number
    solveTime?: string
    progress?: number
  }
}

interface CommunityActivityFeedProps {
  activities?: Activity[]
  isLoading?: boolean
  limit?: number
  showHeader?: boolean
  onRefresh?: () => void
}

export default function CommunityActivityFeed({ 
  activities: externalActivities,
  isLoading: externalLoading,
  limit = 10, 
  showHeader = true,
  onRefresh
}: CommunityActivityFeedProps) {
  const [internalActivities, setInternalActivities] = useState<Activity[]>([])
  const [internalLoading, setInternalLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Use external activities if provided, otherwise use internal state
  const activities = externalActivities || internalActivities
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading

  // Only fetch data if no external activities provided
  const fetchActivities = async (isRefresh = false) => {
    if (externalActivities) return // Don't fetch if external data provided

    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setInternalLoading(true)
    }
    
    try {
      const response = await fetch(`/api/activity?limit=${limit}`)
      const data = await response.json()
      
      if (data.activities && data.activities.length > 0) {
        setInternalActivities(data.activities)
      } else {
        // Fallback to mock data when no real activities exist
        setInternalActivities(getMockActivities().slice(0, limit))
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      // Fallback to mock data on error
      setInternalActivities(getMockActivities().slice(0, limit))
    } finally {
      setInternalLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (!externalActivities) {
      fetchActivities()
    }
  }, [limit, externalActivities])

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      fetchActivities(true)
    }
  }

  // Mock data fallback
  const getMockActivities = (): Activity[] => [
    {
      id: '1',
      type: 'review',
      user: {
        id: 'user_2example1',
        name: 'Puzzle Master',
        username: 'puzzlemaster',
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
        id: 'user_2example2',
        name: 'Jigsaw Jenny',
        username: 'jigsawjenny',
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
        id: 'user_2example3',
        name: 'Puzzle Pro',
        username: 'puzzlepro',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      },
      content: 'started following Sarah Johnson',
      timestamp: '1d ago'
    },
    {
      id: '4',
      type: 'review',
      user: {
        id: 'user_2example4',
        name: 'Art Lover',
        username: 'artlover99',
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
        id: 'user_puzzle_master_2024',
        name: 'Sarah Puzzle Master',
        username: 'puzzle_master_sarah',
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
      case 'post':
        return <MessageSquare className="w-4 h-4 text-violet-500" />
      default:
        return <Heart className="w-4 h-4 text-rose-500" />
    }
  }

  const renderActivity = (activity: Activity) => {
  return (
      <div className="bg-white hover:bg-slate-50/50 transition-all duration-300 border-b border-slate-100 last:border-b-0 hover:shadow-sm">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <Link href={`/users/${activity.user.id}`}>
              <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm hover:shadow-md transition-shadow duration-200 hover:scale-105 transform cursor-pointer">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium">
                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex-1 min-w-0">
              {/* User Header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/users/${activity.user.id}`}
                    className="font-semibold text-slate-900 hover:text-violet-600 cursor-pointer transition-colors duration-200"
                  >
                    {activity.user.name}
                  </Link>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 text-sm hover:text-slate-600 transition-colors duration-200">{activity.timestamp}</span>
                </div>
                <FollowButton 
                  userId={activity.user.id} 
                  size="sm"
                  variant="outline"
                  className="text-xs px-2 py-1"
                />
              </div>
              
              {/* Activity Description */}
              <div className="flex items-center space-x-2 mb-3">
                {renderActivityIcon(activity.type)}
                <span className="text-slate-600 text-sm">
                  {activity.type === 'review' ? 'shared a review' : 
                   activity.type === 'completion' ? 'completed a puzzle' : 
                   activity.type === 'post' ? 'shared an update' :
                   activity.type === 'follow' ? activity.content : 'liked a post'}
                </span>
                {activity.puzzle && (
                  <span className="font-medium text-violet-600 hover:text-violet-700 cursor-pointer transition-colors duration-200 hover:underline">
                    "{activity.puzzle.title}"
                  </span>
                )}
              </div>

              {/* Puzzle Info */}
              {activity.puzzle && (
                <div className="bg-slate-50/30 rounded-lg p-3 mb-3 border border-slate-100 hover:bg-slate-50/50 hover:border-slate-200 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={activity.puzzle.image} 
                      alt={activity.puzzle.title}
                      className="w-10 h-10 rounded-md object-cover hover:scale-105 transition-transform duration-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm">{activity.puzzle.title}</h4>
                      <p className="text-xs text-slate-600">{activity.puzzle.brand} • {activity.puzzle.pieceCount} pieces</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          activity.puzzle.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                          activity.puzzle.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {activity.puzzle.difficulty}
                        </span>
                        {activity.type === 'review' && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-xs text-slate-600">{activity.puzzle.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              {activity.content && activity.type !== 'follow' && (
                <div className="mb-3">
                  {activity.type === 'review' && (
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                      ))}
                      {activity.stats?.hours && (
                        <span className="text-xs text-slate-600 ml-2">
                          Solved in {activity.stats.hours} hours
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-slate-700 leading-relaxed text-sm">{activity.content}</p>
                  
                  {/* Progress Bar for puzzle log activities */}
                  {activity.metadata?.progress && activity.metadata.progress > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{activity.metadata.progress}% complete</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${Math.min(activity.metadata.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Metadata Display */}
                  {activity.metadata && (activity.metadata.rating || activity.metadata.solveTime) && (
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-2">
                      {activity.metadata.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span>{activity.metadata.rating}/5</span>
                        </div>
                      )}
                      {activity.metadata.solveTime && (
                        <span>Solved in {activity.metadata.solveTime}</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Image Gallery for Posts and Progress Photos */}
              {(activity.type === 'post' || activity.type === 'completion' || activity.type === 'puzzle_log') && activity.media_urls && activity.media_urls.length > 0 && (
                <div className="mb-4">
                  {activity.media_urls.length === 1 ? (
                    // Single image - responsive with max height
                    <div className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={activity.media_urls[0]}
                        alt={activity.type === 'post' ? 'Post image' : 'Progress photo'}
                        className="w-full max-h-80 object-cover hover:scale-105 transition-transform duration-300"
                        style={{ 
                          aspectRatio: 'auto',
                          minHeight: '200px' 
                        }}
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement
                          const aspectRatio = img.naturalWidth / img.naturalHeight
                          
                          // For very wide images, limit height more
                          if (aspectRatio > 2) {
                            img.style.maxHeight = '240px'
                          }
                          // For very tall images, limit height less
                          else if (aspectRatio < 0.75) {
                            img.style.maxHeight = '400px'
                          }
                        }}
                      />
                    </div>
                  ) : activity.media_urls.length === 2 ? (
                    // Two images - side by side with consistent height
                    <div className="grid grid-cols-2 gap-2">
                      {activity.media_urls.map((imageUrl, index) => (
                        <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          <img
                            src={imageUrl}
                            alt={activity.type === 'post' ? `Post image ${index + 1}` : `Progress photo ${index + 1}`}
                            className="w-full h-52 object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  ) : activity.media_urls.length === 3 ? (
                    // Three images - one large, two small
                    <div className="grid grid-cols-2 gap-2 h-60">
                      <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img
                          src={activity.media_urls[0]}
                          alt="Post image 1"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        {activity.media_urls.slice(1, 3).map((imageUrl, index) => (
                          <div key={index + 1} className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                            <img
                              src={imageUrl}
                              alt={`Post image ${index + 2}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Four or more images - 2x2 grid with overflow indicator
                    <div className="grid grid-cols-2 gap-2">
                      {activity.media_urls.slice(0, 4).map((imageUrl, index) => (
                        <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          <img
                            src={imageUrl}
                            alt={activity.type === 'post' ? `Post image ${index + 1}` : `Progress photo ${index + 1}`}
                            className="w-full h-44 object-cover hover:scale-105 transition-transform duration-200"
                          />
                          {/* Show +N overlay on last image if there are more than 4 images */}
                          {index === 3 && activity.media_urls && activity.media_urls.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold text-lg">
                              +{activity.media_urls.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-6 pt-3 border-t border-slate-100 mt-3">
                <div className="transform hover:scale-105 transition-transform duration-200">
                  <LikeButton 
                    activityId={activity.id}
                    activityType="feed_item"
                    initialLikeCount={activity.stats?.likes || 0}
                  />
                </div>
                <div className="transform hover:scale-105 transition-transform duration-200">
                  <CommentSection
                    activityId={activity.id}
                    activityType="feed_item"
                    initialCommentCount={activity.stats?.comments || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-100 animate-in fade-in-0 duration-500">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 animate-in slide-in-from-bottom-3 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
                  <div className="h-20 bg-slate-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
      ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
          <Button 
            variant="ghost" 
            className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </Button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-100 animate-in fade-in-0 duration-500">
        {activities.map((activity, index) => (
          <div key={activity.id} className="animate-in slide-in-from-bottom-3 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
            {renderActivity(activity)}
          </div>
        ))}
      </div>
    </div>
  )
} 