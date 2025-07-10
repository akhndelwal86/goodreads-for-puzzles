'use client'

import { useState, useEffect } from 'react'
import { Users, MessageSquare, Heart, Star, Clock, Trophy, User, ChevronRight } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import CommunityActivityFeed from '@/components/home/ActivityFeed'
import { PostCreationBox } from '@/components/community/post-creation-box'
import { SidebarStats } from '@/components/community/sidebar-stats'
import { SidebarLeaderboards } from '@/components/community/sidebar-leaderboards'
import { FollowProvider } from '@/contexts/follow-context'

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

export default function CommunityPage() {
  const { user } = useUser()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch activities function
  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activity?limit=8')
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
  }, [])

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
              <PostCreationBox 
                onOptimisticPost={handleNewPost}
                onPostCreated={handlePostCreated}
                onPostError={handlePostError}
              />
            </div>
            
            <div className="animate-in slide-in-from-bottom-5 duration-700 delay-500">
              <CommunityActivityFeed 
                activities={activities}
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
    </FollowProvider>
  )
}
