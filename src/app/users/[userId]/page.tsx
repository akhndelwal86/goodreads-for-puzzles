'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FollowButton } from '@/components/shared/follow-button'
import { FollowProvider } from '@/contexts/follow-context'
import UserActivityFeed from '@/components/profile/user-activity-feed'
import CompletedPuzzlesGallery from '@/components/profile/completed-puzzles-gallery'
import { CalendarDays, MapPin, Users, Star, Trophy, Puzzle } from 'lucide-react'
import type { User } from '@/types/database'

interface UserStats {
  puzzles_owned?: number
  puzzles_completed: number
  reviews_count: number
  avg_rating: number
  avg_solve_time_hours: number
  favorite_brand: string
  total_pieces: number
}

interface FollowUser {
  id: string
  created_at: string
  follower?: User
  following?: User
}

interface ProfileData {
  user: User
  stats: UserStats
  recent_activity: any[]
  completed_puzzles: any[]
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [followers, setFollowers] = useState<FollowUser[]>([])
  const [following, setFollowing] = useState<FollowUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Validate userId
        if (!userId || typeof userId !== 'string') {
          setError('Invalid user ID')
          return
        }
        
        // Fetch profile data
        const profileResponse = await fetch(`/api/users/${userId}/profile`)
        if (!profileResponse.ok) {
          if (profileResponse.status === 404) {
            setError('User not found')
          } else {
            setError(`Failed to load profile (${profileResponse.status})`)
          }
          return
        }

        const data = await profileResponse.json()
        
        // Validate response data
        if (!data || !data.user) {
          setError('Invalid profile data received')
          return
        }
        
        setProfileData(data)

        // Fetch followers and following (non-blocking)
        try {
          const [followersResponse, followingResponse] = await Promise.all([
            fetch(`/api/users/${userId}/followers?limit=10`),
            fetch(`/api/users/${userId}/following?limit=10`)
          ])

          if (followersResponse.ok) {
            const followersData = await followersResponse.json()
            setFollowers(Array.isArray(followersData.followers) ? followersData.followers : [])
          }

          if (followingResponse.ok) {
            const followingData = await followingResponse.json()
            setFollowing(Array.isArray(followingData.following) ? followingData.following : [])
          }
        } catch (followErr) {
          console.warn('Failed to load followers/following:', followErr)
          // Don't fail the whole page for this
        }

      } catch (err) {
        setError('Failed to load user profile')
        console.error('Error fetching profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchProfile()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">User Not Found</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  const { user, stats } = profileData

  // Safe access with defaults
  const safeUser: Partial<User> = user || {}
  const safeStats: Partial<UserStats> = stats || {}
  const displayName = safeUser.username || safeUser.email?.split('@')[0] || 'Unknown User'
  const avatarUrl = safeUser.avatar_url || ''
  const userBio = safeUser.bio || null
  const joinDate = safeUser.created_at ? new Date(safeUser.created_at).toLocaleDateString() : 'Unknown'
  const followersCount = safeUser.followers_count || 0
  const followingCount = safeUser.following_count || 0

  return (
    <FollowProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-600 border-b border-violet-200/50 shadow-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <Avatar className="w-32 h-32 border-4 border-white/50 shadow-2xl ring-4 ring-white/20 hover:scale-105 transition-all duration-300">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-2xl font-medium">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-white truncate drop-shadow-lg">
                      {displayName}
                    </h1>
                    {userBio && (
                      <p className="text-white/90 mt-2 max-w-2xl text-base drop-shadow">{userBio}</p>
                    )}
                    <div className="flex items-center space-x-6 mt-4 text-white/80">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="w-5 h-5" />
                        <span className="text-sm">Joined {joinDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span className="text-sm">{followersCount} followers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{followingCount} following</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Follow Button */}
                  <div className="mt-4 sm:mt-0">
                    {safeUser.clerk_id && (
                      <FollowButton userId={safeUser.clerk_id} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Puzzle Stats */}
                <Card className="glass-card border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="text-slate-900">Puzzle Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {safeStats.puzzles_owned !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Owned</span>
                        <span className="font-medium text-sm">{safeStats.puzzles_owned || 0}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Completed</span>
                      <span className="font-medium text-sm">{safeStats.puzzles_completed || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Reviews</span>
                      <span className="font-medium text-sm">{safeStats.reviews_count || 0}</span>
                    </div>
                    {safeStats.avg_rating && safeStats.avg_rating > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Avg Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          <span className="font-medium text-sm">{safeStats.avg_rating.toFixed(1)}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Pieces</span>
                      <span className="font-medium text-sm">{(safeStats.total_pieces || 0).toLocaleString()}</span>
                    </div>
                    {safeStats.favorite_brand && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Favorite Brand</span>
                        <Badge variant="secondary">{safeStats.favorite_brand}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="glass-card border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Puzzle className="w-5 h-5 text-violet-500" />
                      <span className="text-slate-900">Achievements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {(safeStats.puzzles_completed || 0) >= 10 && (
                        <div className="text-center p-3 glass-badge bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border border-amber-200/50 hover:scale-105 transition-transform cursor-pointer">
                          <div className="text-xl mb-1">🧩</div>
                          <div className="text-xs text-amber-700">Puzzle Pro</div>
                        </div>
                      )}
                      {(safeStats.reviews_count || 0) >= 5 && (
                        <div className="text-center p-3 glass-badge bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg border border-blue-200/50 hover:scale-105 transition-transform cursor-pointer">
                          <div className="text-xl mb-1">⭐</div>
                          <div className="text-xs text-blue-700">Reviewer</div>
                        </div>
                      )}
                      {followersCount >= 10 && (
                        <div className="text-center p-3 glass-badge bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border border-green-200/50 hover:scale-105 transition-transform cursor-pointer">
                          <div className="text-xl mb-1">👥</div>
                          <div className="text-xs text-green-700">Popular</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="grid w-full grid-cols-3 glass-card border-white/40 h-12">
                  <TabsTrigger 
                    value="activity" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    Recent Activity
                  </TabsTrigger>
                  <TabsTrigger 
                    value="puzzles"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    Completed Puzzles
                  </TabsTrigger>
                  <TabsTrigger 
                    value="social"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                  >
                    Social
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="mt-6">
                  <UserActivityFeed userId={userId} limit={15} />
                </TabsContent>

                <TabsContent value="puzzles" className="mt-6">
                  <CompletedPuzzlesGallery userId={userId} initialLimit={12} />
                </TabsContent>

                <TabsContent value="social" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="glass-card border-white/40 hover:shadow-2xl transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-rose-500" />
                          <span className="text-slate-900">Followers ({followersCount})</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(followers) && followers.length > 0 ? (
                          <div className="space-y-3">
                            {followers.map((follow) => {
                              const followerUser = follow.follower
                              if (!followerUser) return null
                              
                              return (
                                <div key={follow.id} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <Link href={`/users/${followerUser.clerk_id}`}>
                                      <Avatar className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform">
                                        <AvatarImage src={followerUser.avatar_url || ''} alt={followerUser.username || 'User'} />
                                        <AvatarFallback>
                                          {(followerUser.username || followerUser.email || 'U')?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    </Link>
                                    <div>
                                      <Link 
                                        href={`/users/${followerUser.clerk_id}`}
                                        className="text-sm text-slate-900 hover:text-violet-600 transition-colors"
                                      >
                                        {followerUser.username || followerUser.email?.split('@')[0] || 'User'}
                                      </Link>
                                      <p className="text-sm text-slate-500">
                                        {followerUser.followers_count} followers
                                      </p>
                                    </div>
                                  </div>
                                  <FollowButton userId={followerUser.clerk_id} size="sm" />
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-slate-500 text-center py-4">
                            No followers yet
                          </p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-card border-white/40 hover:shadow-2xl transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-emerald-500" />
                          <span className="text-slate-900">Following ({followingCount})</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(following) && following.length > 0 ? (
                          <div className="space-y-3">
                            {following.map((follow) => {
                              const followingUser = follow.following
                              if (!followingUser) return null
                              
                              return (
                                <div key={follow.id} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <Link href={`/users/${followingUser.clerk_id}`}>
                                      <Avatar className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform">
                                        <AvatarImage src={followingUser.avatar_url || ''} alt={followingUser.username || 'User'} />
                                        <AvatarFallback>
                                          {(followingUser.username || followingUser.email || 'U')?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                    </Link>
                                    <div>
                                      <Link 
                                        href={`/users/${followingUser.clerk_id}`}
                                        className="text-sm text-slate-900 hover:text-violet-600 transition-colors"
                                      >
                                        {followingUser.username || followingUser.email?.split('@')[0] || 'User'}
                                      </Link>
                                      <p className="text-sm text-slate-500">
                                        {followingUser.followers_count} followers
                                      </p>
                                    </div>
                                  </div>
                                  <FollowButton userId={followingUser.clerk_id} size="sm" />
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-slate-500 text-center py-4">
                            Not following anyone yet
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </FollowProvider>
  )
}