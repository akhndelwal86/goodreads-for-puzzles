'use client'

import { Suspense, useState, useEffect } from 'react'
import { Users, MessageSquare, Heart, Star, Clock, Trophy, User, ChevronRight, Globe, UserCheck, UserCircle, Filter, X } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import CommunityActivityFeed from '@/components/home/ActivityFeed'
import { PostCreationBox } from '@/components/community/post-creation-box'
import { SidebarStats } from '@/components/community/sidebar-stats'
import { SidebarLeaderboards } from '@/components/community/sidebar-leaderboards'
import { FollowProvider } from '@/contexts/follow-context'
import { AuthGuard, useAuthPrompt } from '@/components/auth/auth-guard'

// Activity interface
interface Activity {
  id: string
  type: 'review' | 'completion' | 'follow' | 'like' | 'post'
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
}

type FeedTab = 'all' | 'following' | 'personal'
type ActivityType = 'review' | 'completion' | 'post' | 'follow' | 'like'

interface ActivityFilter {
  id: ActivityType
  label: string
  icon: React.ComponentType<{ className?: string }>
  enabled: boolean
}

function CommunityPageContent() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isSignedIn, requireAuth, SignInPrompt } = useAuthPrompt()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FeedTab>('all')
  const [activityFilters, setActivityFilters] = useState<ActivityFilter[]>([
    { id: 'review', label: 'Reviews', icon: Star, enabled: true },
    { id: 'completion', label: 'Completions', icon: Trophy, enabled: true },
    { id: 'post', label: 'Posts', icon: MessageSquare, enabled: true },
    { id: 'follow', label: 'Follows', icon: UserCheck, enabled: true },
    { id: 'like', label: 'Likes', icon: Heart, enabled: true },
  ])

  // Initialize active tab and filters from URL parameters
  useEffect(() => {
    const tabParam = searchParams.get('tab') as FeedTab
    if (tabParam && ['all', 'following', 'personal'].includes(tabParam)) {
      setActiveTab(tabParam)
    }

    // Initialize filters from URL
    const filtersParam = searchParams.get('filters')
    if (filtersParam) {
      const enabledFilters = filtersParam.split(',') as ActivityType[]
      setActivityFilters(prev => 
        prev.map(filter => ({
          ...filter,
          enabled: enabledFilters.includes(filter.id)
        }))
      )
    }
  }, [searchParams])

  // Fetch activities function
  const fetchActivities = async () => {
    try {
      let endpoint = '/api/activity?limit=8'
      
      // Modify endpoint based on active tab
      switch (activeTab) {
        case 'following':
          endpoint = '/api/activity?limit=8&type=following'
          break
        case 'personal':
          endpoint = '/api/activity?limit=8&type=personal'
          break
        default:
          endpoint = '/api/activity?limit=8&type=all'
      }
      
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [activeTab, user])

  // Optimistic update handler
  const handleNewPost = (optimisticPost: Activity) => {
    console.log('📝 Adding optimistic post:', optimisticPost.id)
    // Add the new post to the beginning of the activities
    setActivities(prev => [optimisticPost, ...prev])
  }

  // Update post after API response
  const handlePostCreated = (realPost: Activity, tempId: string) => {
    console.log('✅ Replacing optimistic post:', tempId, 'with real post:', realPost.id)
    setActivities(prev => 
      prev.map(activity => 
        activity.id === tempId ? realPost : activity
      )
    )
  }

  // Remove post if API fails
  const handlePostError = (tempId: string) => {
    console.log('❌ Removing failed post:', tempId)
    setActivities(prev => 
      prev.filter(activity => activity.id !== tempId)
    )
  }

  // Handle tab change
  const handleTabChange = (tab: FeedTab) => {
    // Check if authentication is required for this tab
    if ((tab === 'following' || tab === 'personal') && !requireAuth(`view your ${tab} feed`, '/community')) {
      return
    }
    
    setActiveTab(tab)
    setIsLoading(true)
    
    // Update URL parameter
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (tab === 'all') {
      newSearchParams.delete('tab')
    } else {
      newSearchParams.set('tab', tab)
    }
    
    const queryString = newSearchParams.toString()
    const newUrl = queryString ? `/community?${queryString}` : '/community'
    router.replace(newUrl, { scroll: false })
  }

  // Handle filter change
  const handleFilterChange = (filterId: ActivityType, enabled: boolean) => {
    setActivityFilters(prev => {
      const updated = prev.map(filter => 
        filter.id === filterId ? { ...filter, enabled } : filter
      )
      
      // Update URL parameters
      const newSearchParams = new URLSearchParams(searchParams.toString())
      const enabledFilters = updated.filter(f => f.enabled).map(f => f.id)
      
      if (enabledFilters.length === updated.length) {
        // All filters enabled, remove from URL
        newSearchParams.delete('filters')
      } else if (enabledFilters.length > 0) {
        newSearchParams.set('filters', enabledFilters.join(','))
      } else {
        // No filters enabled, remove from URL
        newSearchParams.delete('filters')
      }
      
      const queryString = newSearchParams.toString()
      const newUrl = queryString ? `/community?${queryString}` : '/community'
      router.replace(newUrl, { scroll: false })
      
      return updated
    })
  }

  // Filter activities based on enabled filters
  const filteredActivities = activities.filter(activity => {
    const enabledFilters = activityFilters.filter(f => f.enabled).map(f => f.id)
    return enabledFilters.length === 0 || enabledFilters.includes(activity.type as ActivityType)
  })

  // Get count of active filters
  const activeFilterCount = activityFilters.filter(f => !f.enabled).length
  const hasActiveFilters = activeFilterCount > 0

  return (
    <FollowProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 animate-in fade-in-0 duration-500">
            {user && (
              <Avatar className="w-16 h-16 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold text-xl">
                  {(user.fullName || 'U').split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="animate-in slide-in-from-right-5 duration-700 delay-200">
              <h1 className="text-2xl font-bold text-slate-900 mb-1 hover:text-violet-600 transition-colors duration-300">
                {user ? `Hey ${user.firstName || user.fullName?.split(' ')[0]}, what's your puzzle story today?` : 'Share your puzzle journey'}
              </h1>
              <p className="text-slate-600 hover:text-slate-700 transition-colors duration-200">Connect with fellow puzzle enthusiasts and discover amazing new challenges</p>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Community Activity Feed */}
          <div className="lg:col-span-2 animate-in slide-in-from-left-5 duration-700 delay-100">
            {/* Post Creation Box */}
            <div className="animate-in fade-in-0 duration-500 delay-300">
              <AuthGuard 
                feature="create posts and share your puzzle updates"
                redirectTo="/community"
                fallback={
                  <div className="glass-card border border-white/40 rounded-2xl p-6 text-center bg-gradient-to-r from-violet-50 to-purple-50">
                    <div className="mb-4">
                      <MessageSquare className="w-12 h-12 text-violet-600 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Share Your Puzzle Journey
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Join the community to post updates, share completions, and connect with fellow puzzle enthusiasts.
                      </p>
                    </div>
                  </div>
                }
              >
                <PostCreationBox 
                  onOptimisticPost={handleNewPost}
                  onPostCreated={handlePostCreated}
                  onPostError={handlePostError}
                />
              </AuthGuard>
            </div>

            {/* Feed Tabs */}
            <div className="glass-card border border-white/40 rounded-2xl p-1 mb-6 animate-in fade-in-0 duration-500 delay-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Button
                    variant={activeTab === 'all' ? 'default' : 'ghost'}
                    onClick={() => handleTabChange('all')}
                    className={`flex items-center space-x-2 px-4 py-2 transition-all duration-200 ${
                      activeTab === 'all' 
                        ? 'bg-white shadow-sm text-violet-600' 
                        : 'hover:bg-white/50 text-slate-600'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>All Activity</span>
                  </Button>
                  <Button
                    variant={activeTab === 'following' ? 'default' : 'ghost'}
                    onClick={() => handleTabChange('following')}
                    className={`flex items-center space-x-2 px-4 py-2 transition-all duration-200 ${
                      activeTab === 'following' 
                        ? 'bg-white shadow-sm text-violet-600' 
                        : 'hover:bg-white/50 text-slate-600'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </Button>
                  <Button
                    variant={activeTab === 'personal' ? 'default' : 'ghost'}
                    onClick={() => handleTabChange('personal')}
                    className={`flex items-center space-x-2 px-4 py-2 transition-all duration-200 ${
                      activeTab === 'personal' 
                        ? 'bg-white shadow-sm text-violet-600' 
                        : 'hover:bg-white/50 text-slate-600'
                    }`}
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>My Activity</span>
                  </Button>
                </div>

                {/* Activity Type Filters */}
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
                              const newSearchParams = new URLSearchParams(searchParams.toString())
                              newSearchParams.delete('filters')
                              const queryString = newSearchParams.toString()
                              const newUrl = queryString ? `/community?${queryString}` : '/community'
                              router.replace(newUrl, { scroll: false })
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
                </div>
              </div>
            </div>
            
            <div className="animate-in slide-in-from-bottom-5 duration-700 delay-500">
              <CommunityActivityFeed 
                activities={filteredActivities}
                isLoading={isLoading}
                showHeader={true}
                onRefresh={fetchActivities}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-in slide-in-from-right-5 duration-700 delay-200">
            {/* Community Stats */}
            <div className="animate-in fade-in-0 duration-500 delay-400">
              <SidebarStats />
            </div>

            {/* Leaderboards */}
            <div className="animate-in fade-in-0 duration-500 delay-600">
              <SidebarLeaderboards />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Auth Prompt Modal */}
      <SignInPrompt />
    </FollowProvider>
  )
}

export default function CommunityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading community...</p>
        </div>
      </div>
    }>
      <CommunityPageContent />
    </Suspense>
  )
}
