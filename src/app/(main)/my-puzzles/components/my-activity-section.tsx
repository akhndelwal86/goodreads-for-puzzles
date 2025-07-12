'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  FileText, 
  Image as ImageIcon,
  ArrowRight,
  Activity,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

interface MyActivity {
  id: string
  type: 'puzzle_log' | 'review' | 'solved' | 'add_to_list' | 'status_change'
  puzzle?: {
    id: string
    title: string
    image: string
    brand: string
    pieceCount: number
  }
  content: string
  timestamp: string
  metadata?: {
    solveTime?: string
    rating?: number
    status?: string
    progress?: number
  }
  media_urls?: string[]
}

interface MyActivitySectionProps {
  limit?: number
  showHeader?: boolean
  className?: string
}

export default function MyActivitySection({ 
  limit = 10, 
  showHeader = true,
  className = ""
}: MyActivitySectionProps) {
  const { user } = useUser()
  const [activities, setActivities] = useState<MyActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyActivity = async (isRefresh = false) => {
    if (!user) return

    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch(`/api/users/${user.id}/activity?limit=${limit}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch activity')
      }

      const data = await response.json()
      setActivities(data.activities || [])
    } catch (err) {
      console.error('Error fetching my activity:', err)
      setError('Failed to load your activity')
      // Show some mock data for now
      setActivities(getMockActivity())
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMyActivity()
  }, [user, limit])

  const handleRefresh = () => {
    fetchMyActivity(true)
  }

  const getMockActivity = (): MyActivity[] => [
    {
      id: '1',
      type: 'puzzle_log',
      puzzle: {
        id: '1',
        title: 'Mountain Landscape',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
        brand: 'Ravensburger',
        pieceCount: 1000
      },
      content: 'Made good progress on this beautiful landscape puzzle',
      timestamp: '2 hours ago',
      metadata: { progress: 65 },
      media_urls: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop']
    },
    {
      id: '2',
      type: 'solved',
      puzzle: {
        id: '2',
        title: 'Ocean Waves',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=80&h=80&fit=crop',
        brand: 'Buffalo Games',
        pieceCount: 750
      },
      content: 'Completed this challenging ocean puzzle!',
      timestamp: '1 day ago',
      metadata: { solveTime: '4h 20m', rating: 5 }
    },
    {
      id: '3',
      type: 'review',
      puzzle: {
        id: '3',
        title: 'City Skyline',
        image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=80&h=80&fit=crop',
        brand: 'Clementoni',
        pieceCount: 1500
      },
      content: 'Wrote a detailed review about the piece quality and fit',
      timestamp: '3 days ago',
      metadata: { rating: 4 }
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'puzzle_log':
        return <Activity className="w-4 h-4 text-blue-500" />
      case 'solved':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'review':
        return <Star className="w-4 h-4 text-amber-500" />
      case 'add_to_list':
        return <FileText className="w-4 h-4 text-violet-500" />
      default:
        return <Activity className="w-4 h-4 text-slate-500" />
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'puzzle_log':
        return 'Progress Update'
      case 'solved':
        return 'Completed'
      case 'review':
        return 'Reviewed'
      case 'add_to_list':
        return 'Added to Library'
      default:
        return 'Activity'
    }
  }

  if (error) {
    return (
      <Card className={`glass-card border-white/40 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-slate-600 text-center mb-4">{error}</p>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="border-violet-200 text-violet-600 hover:bg-violet-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className={`glass-card border-white/40 ${className}`}>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            <p className="text-slate-600">Loading your activity...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className={`glass-card border-white/40 ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <h3 className="text-base font-medium text-slate-900 mb-2">No Recent Activity</h3>
          <p className="text-slate-600 text-center max-w-md">
            Start logging puzzle progress or completing puzzles to see your activity timeline here!
          </p>
          <Button asChild className="mt-4">
            <Link href="/puzzles/browse">
              Discover Puzzles
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`glass-card border-white/40 ${className}`}>
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-violet-500" />
              <span className="text-slate-900">My Activity</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50/50 transition-colors duration-200 border border-slate-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Activity Icon */}
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Activity Header */}
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {getActivityLabel(activity.type)}
                    </Badge>
                    <span className="text-xs text-slate-500">{activity.timestamp}</span>
                  </div>

                  {/* Puzzle Info */}
                  {activity.puzzle && (
                    <div className="flex items-center space-x-3 mb-2">
                      <img 
                        src={activity.puzzle.image} 
                        alt={activity.puzzle.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 truncate">
                          {activity.puzzle.title}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {activity.puzzle.brand} • {activity.puzzle.pieceCount} pieces
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Activity Content */}
                  <p className="text-sm text-slate-700 mb-2">{activity.content}</p>

                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="flex items-center space-x-4 text-xs text-slate-600">
                      {activity.metadata.progress && (
                        <span className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span>{activity.metadata.progress}% complete</span>
                        </span>
                      )}
                      {activity.metadata.solveTime && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{activity.metadata.solveTime}</span>
                        </span>
                      )}
                      {activity.metadata.rating && (
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-500 fill-current" />
                          <span>{activity.metadata.rating}/5</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Media Preview */}
                  {activity.media_urls && activity.media_urls.length > 0 && (
                    <div className="mt-3 flex items-center space-x-2">
                      <ImageIcon className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-600">
                        {activity.media_urls.length} photo{activity.media_urls.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Arrow */}
                {activity.puzzle && (
                  <Link 
                    href={`/puzzles/${activity.puzzle.id}`}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* View All Link */}
        {activities.length >= limit && (
          <div className="text-center pt-4 border-t border-slate-100">
            <Button variant="ghost" asChild className="text-violet-600 hover:text-violet-700">
              <Link href="/community?tab=personal">
                View All Activity
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}