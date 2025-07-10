'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Filter, Star, Trophy, MessageSquare, UserCheck, Heart, Activity as ActivityIcon, CheckCircle, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Activity {
  id: string
  type: 'review' | 'solved' | 'puzzle_log' | 'add_to_list' | 'status_change'
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
    rating?: number
    solveTime?: string
    progress?: number
  }
  media_urls?: string[]
}

type ActivityType = 'review' | 'solved' | 'puzzle_log' | 'add_to_list' | 'status_change'

interface ActivityFilter {
  id: ActivityType
  label: string
  icon: React.ComponentType<{ className?: string }>
  enabled: boolean
}

export function MyActivityTab() {
  const { user } = useUser()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activityFilters, setActivityFilters] = useState<ActivityFilter[]>([
    { id: 'review', label: 'Reviews', icon: Star, enabled: true },
    { id: 'solved', label: 'Completions', icon: Trophy, enabled: true },
    { id: 'puzzle_log', label: 'Progress', icon: ActivityIcon, enabled: true },
    { id: 'add_to_list', label: 'Added to Library', icon: Heart, enabled: true },
    { id: 'status_change', label: 'Status Changes', icon: RefreshCw, enabled: true },
  ])

  const fetchActivities = async (isRefresh = false) => {
    if (!user) return

    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch(`/api/users/${user.id}/activity?limit=50`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch activity')
      }

      const data = await response.json()
      setActivities(data.activities || [])
    } catch (err) {
      console.error('Error fetching activity:', err)
      setError('Failed to load your activity')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [user])

  const handleFilterChange = (filterId: ActivityType, enabled: boolean) => {
    setActivityFilters(prev => 
      prev.map(filter => 
        filter.id === filterId ? { ...filter, enabled } : filter
      )
    )
  }

  const filteredActivities = activities.filter(activity => {
    const enabledFilters = activityFilters.filter(f => f.enabled).map(f => f.id)
    return enabledFilters.length === 0 || enabledFilters.includes(activity.type)
  })

  const hasActiveFilters = activityFilters.some(f => !f.enabled)
  const activeFilterCount = activityFilters.filter(f => !f.enabled).length

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'review':
        return <Star className="w-4 h-4 text-amber-500" />
      case 'solved':
        return <Trophy className="w-4 h-4 text-emerald-500" />
      case 'puzzle_log':
        return <ActivityIcon className="w-4 h-4 text-blue-500" />
      case 'add_to_list':
        return <Heart className="w-4 h-4 text-rose-500" />
      case 'status_change':
        return <RefreshCw className="w-4 h-4 text-slate-500" />
      default:
        return <ActivityIcon className="w-4 h-4 text-slate-500" />
    }
  }

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case 'review':
        return 'wrote a review for'
      case 'solved':
        return 'completed'
      case 'puzzle_log':
        return 'updated progress on'
      case 'add_to_list':
        return 'added to library'
      case 'status_change':
        return 'changed status of'
      default:
        return 'interacted with'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-700">My Activity</h2>
        </div>
        <div className="glass-card border-white/30 rounded-2xl p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-700">My Activity</h2>
        </div>
        <div className="glass-card border-white/30 rounded-2xl p-6">
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={() => fetchActivities()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-700">My Activity</h2>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} filtered
            </Badge>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 hover:bg-white/50 transition-all duration-200 ${
                  hasActiveFilters ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Activity Types</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActivityFilters(prev => prev.map(f => ({ ...f, enabled: true })))
                    }}
                    className="text-xs h-6 px-2"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="space-y-2">
                  {activityFilters.map((filter) => {
                    const Icon = filter.icon
                    return (
                      <div key={filter.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={filter.id}
                          checked={filter.enabled}
                          onCheckedChange={(checked) => 
                            handleFilterChange(filter.id, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={filter.id}
                          className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{filter.label}</span>
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchActivities(true)}
            disabled={isRefreshing}
            className="text-violet-600 hover:text-violet-700"
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass-card border-white/30 rounded-2xl p-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <ActivityIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">No Activity Yet</h3>
            <p className="text-slate-600 mb-6">
              {hasActiveFilters 
                ? 'No activities match your current filters.'
                : 'Start rating puzzles or updating your progress to see activity here.'
              }
            </p>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={() => setActivityFilters(prev => prev.map(f => ({ ...f, enabled: true })))}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-2 md:space-x-3 p-3 md:p-4 bg-white/30 rounded-xl hover:bg-white/50 transition-all duration-200"
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 mb-1">
                        You {getActivityDescription(activity)}{' '}
                        {activity.puzzle ? (
                          <Link 
                            href={`/puzzles/${activity.puzzle.id}`}
                            className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
                          >
                            {activity.puzzle.title}
                          </Link>
                        ) : (
                          <span className="font-medium">a puzzle</span>
                        )}
                      </p>
                      {activity.content && (
                        <p className="text-sm text-slate-600 mb-2">{activity.content}</p>
                      )}
                      {/* Progress Bar */}
                      {activity.metadata?.progress && activity.metadata.progress > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                            <span>Progress</span>
                            <span>{activity.metadata.progress}% complete</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-violet-500 to-violet-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${Math.min(activity.metadata.progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Other Metadata */}
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
                      
                      {/* Progress Photos */}
                      {activity.media_urls && activity.media_urls.length > 0 && (
                        <div className="mt-3">
                          {activity.media_urls.length === 1 ? (
                            <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                              <img
                                src={activity.media_urls[0]}
                                alt="Progress photo"
                                className="w-full max-h-36 md:max-h-48 object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                              {activity.media_urls.slice(0, 4).map((imageUrl, index) => (
                                <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                  <img
                                    src={imageUrl}
                                    alt={`Progress photo ${index + 1}`}
                                    className="w-full h-24 md:h-32 object-cover hover:scale-105 transition-transform duration-200"
                                  />
                                  {index === 3 && activity.media_urls && activity.media_urls.length > 4 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold text-sm">
                                      +{activity.media_urls.length - 4}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-4">
                      {activity.timestamp}
                    </span>
                  </div>
                  {activity.puzzle && (
                    <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
                      <span>{activity.puzzle.brand}</span>
                      <span>•</span>
                      <span>{activity.puzzle.pieceCount} pieces</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}