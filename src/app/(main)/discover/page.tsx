'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CompactUserCard } from '@/components/shared/compact-user-card'
import { UserListItem } from '@/components/shared/user-list-item'
import { FollowProvider } from '@/contexts/follow-context'
import { Search, Users, TrendingUp, Star, Trophy, Filter, Loader2, Grid3X3, List, Eye } from 'lucide-react'

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

interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  stat_value: number
  stat_label: string
}

const sortOptions = [
  { value: 'followers', label: 'Most Followed', icon: '👥' },
  { value: 'puzzles', label: 'Most Puzzles Solved', icon: '🧩' },
  { value: 'reviews', label: 'Most Reviews', icon: '⭐' },
  { value: 'speed', label: 'Fastest Solver', icon: '⚡' },
  { value: 'newest', label: 'Newest Members', icon: '🆕' },
  { value: 'active', label: 'Most Active', icon: '🔥' }
]

type ViewMode = 'cards' | 'list'

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<EnhancedUser[]>([])
  const [currentSort, setCurrentSort] = useState('followers')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [topFollowed, setTopFollowed] = useState<LeaderboardUser[]>([])
  const [topSolvers, setTopSolvers] = useState<LeaderboardUser[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Enhanced fetch function for users with sorting and search
  const fetchUsers = useCallback(async (resetPage = false, isLoadMore = false) => {
    const currentPage = resetPage ? 1 : page
    
    if (!isLoadMore) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const params = new URLSearchParams({
        sort: currentSort,
        page: currentPage.toString(),
        limit: '12'
      })

      if (searchQuery.trim().length >= 2) {
        params.append('q', searchQuery.trim())
      }

      const response = await fetch(`/api/users/discover?${params}`)
      if (response.ok) {
        const data = await response.json()
        
        if (resetPage || !isLoadMore) {
          setUsers(data.users || [])
          setPage(1)
        } else {
          setUsers(prev => [...prev, ...(data.users || [])])
        }
        
        setHasMore(data.hasMore || false)
        if (!resetPage && isLoadMore) {
          setPage(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Fetch users error:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [currentSort, searchQuery, page])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(true, false)
    }, searchQuery.length >= 2 || searchQuery.length === 0 ? 300 : 0)

    return () => clearTimeout(timer)
  }, [searchQuery, fetchUsers])

  // Sort change effect
  useEffect(() => {
    fetchUsers(true, false)
  }, [currentSort])

  // Load more function
  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchUsers(false, true)
    }
  }

  // Fetch leaderboards on mount
  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setIsLoading(true)
        
        // For now, use the test users endpoint to get sample data
        const response = await fetch('/api/test-users')
        if (response.ok) {
          const data = await response.json()
          
          // Mock leaderboard data from test users
          const users = data.users || []
          
          const topFollowedData = users
            .slice(0, 5)
            .map((user: any) => ({
              id: user.clerk_id,
              name: user.username || user.email.split('@')[0],
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face',
              stat_value: Math.floor(Math.random() * 100) + 10,
              stat_label: 'followers'
            }))

          const topSolversData = users
            .slice(2, 7)
            .map((user: any) => ({
              id: user.clerk_id,
              name: user.username || user.email.split('@')[0],
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
              stat_value: Math.floor(Math.random() * 500) + 50,
              stat_label: 'puzzles completed'
            }))

          setTopFollowed(topFollowedData)
          setTopSolvers(topSolversData)
        }
      } catch (error) {
        console.error('Error fetching leaderboards:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboards()
  }, [])

  return (
    <FollowProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-600 border-b border-violet-200/50 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Discover Puzzle Enthusiasts
              </h1>
              <p className="text-white/90 max-w-2xl mx-auto text-lg drop-shadow">
                Find and connect with fellow puzzle lovers from around the world
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full">
              {/* Search and Sort Controls */}
              <Card className="glass-card mb-8 shadow-xl border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="w-5 h-5 text-violet-600" />
                      <span className="text-slate-900">Discover Users</span>
                    </div>
                    <Badge variant="outline" className="text-xs glass-badge border-violet-200 text-violet-700">
                      {users.length} users
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-violet-200/50 focus:border-violet-400 focus:ring-violet-400/20"
                      />
                    </div>
                    
                    {/* Sort and View Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      {/* Sort Controls */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4 text-violet-500" />
                          <span className="text-sm font-medium text-slate-700">Sort by:</span>
                        </div>
                        <Select value={currentSort} onValueChange={setCurrentSort}>
                          <SelectTrigger className="w-full sm:w-64 border-violet-200/50 focus:border-violet-400">
                            <SelectValue placeholder="Choose sort option" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center space-x-2">
                                  <span>{option.icon}</span>
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* View Toggle */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-violet-500" />
                          <span className="text-sm font-medium text-slate-700">View:</span>
                        </div>
                        <div className="flex items-center bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg p-1 border border-violet-200/50">
                          <Button
                            variant={viewMode === 'cards' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('cards')}
                            className={`h-8 px-3 ${viewMode === 'cards' ? 'bg-violet-600 hover:bg-violet-700' : 'hover:bg-white/50'}`}
                            title="Card view"
                          >
                            <Grid3X3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-8 px-3 ${viewMode === 'list' ? 'bg-violet-600 hover:bg-violet-700' : 'hover:bg-white/50'}`}
                            title="List view"
                          >
                            <List className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users Display */}
              {isLoading ? (
                <div className={
                  viewMode === 'list' ? 'space-y-4' : 
                  'grid sm:grid-cols-2 md:grid-cols-3 gap-6'
                }>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <Card key={i} className="glass-card animate-pulse">
                      <CardContent className={viewMode === 'list' ? 'p-4' : 'p-6'}>
                        <div className={viewMode === 'list' ? 'flex items-center space-x-4' : 'flex items-start space-x-4 mb-4'}>
                          <div className={viewMode === 'list' ? 'w-14 h-14 bg-slate-200 rounded-full' : 'w-16 h-16 bg-slate-200 rounded-full'}></div>
                          <div className="flex-1">
                            <div className="h-5 bg-slate-200 rounded mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          </div>
                          {viewMode === 'list' && (
                            <div className="hidden md:flex items-center space-x-6">
                              <div className="h-8 w-16 bg-slate-200 rounded"></div>
                              <div className="h-8 w-16 bg-slate-200 rounded"></div>
                            </div>
                          )}
                        </div>
                        {viewMode !== 'list' && (
                          <>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="h-16 bg-slate-200 rounded-lg"></div>
                              <div className="h-16 bg-slate-200 rounded-lg"></div>
                            </div>
                            <div className="h-4 bg-slate-200 rounded mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : users.length > 0 ? (
                <>
                  {viewMode === 'list' ? (
                    <div className="space-y-4 mb-8">
                      {users.map((user) => (
                        <UserListItem key={user.id} user={user} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                      {users.map((user) => (
                        <CompactUserCard key={user.id} user={user} />
                      ))}
                    </div>
                  )}
                  
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center">
                      <Button 
                        onClick={loadMore} 
                        disabled={isLoadingMore}
                        className="glass-button bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        size="lg"
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More Users'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Card className="glass-card">
                  <CardContent className="p-12">
                    <div className="text-center">
                      <Search className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
                      <p className="text-slate-500">
                        {searchQuery ? `No users found for "${searchQuery}"` : 'No users available'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </FollowProvider>
  )
}