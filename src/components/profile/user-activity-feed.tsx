'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'
import CommunityActivityFeed, { Activity } from '@/components/home/ActivityFeed'

interface UserActivityFeedProps {
  userId: string
  limit?: number
}

export default function UserActivityFeed({ userId, limit = 10 }: UserActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${userId}/activity?limit=${limit}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found')
        } else {
          setError('Failed to load activity')
        }
        return
      }

      const data = await response.json()
      setActivities(data.activities || [])
      
    } catch (err) {
      console.error('Error fetching user activities:', err)
      setError('Failed to load activity')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchActivities()
    }
  }, [userId, limit])

  const handleRefresh = () => {
    fetchActivities(true)
  }

  if (error) {
    return (
      <Card className="glass-card border-white/40">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-slate-600 text-center mb-4">{error}</p>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="border-violet-200 text-violet-600 hover:bg-violet-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glass-card border-white/40">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            <p className="text-slate-600">Loading activity...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className="glass-card border-white/40">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4 opacity-50">🧩</div>
          <h3 className="text-base font-medium text-slate-900 mb-2">No Recent Activity</h3>
          <p className="text-slate-600 text-center max-w-md">
            This user hasn't shared any activity yet. Check back later to see their puzzle journey!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium text-slate-900">Recent Activity</h3>
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

      <CommunityActivityFeed 
        activities={activities}
        isLoading={false}
        showHeader={false}
        onRefresh={handleRefresh}
      />
    </div>
  )
}