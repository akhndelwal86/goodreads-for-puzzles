'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LikeButtonProps {
  activityId: string
  activityType: string
  initialLikeCount: number
  initialIsLiked?: boolean
  onLikeChange?: (isLiked: boolean, newCount: number) => void
}

export function LikeButton({ 
  activityId, 
  activityType, 
  initialLikeCount, 
  initialIsLiked = false,
  onLikeChange 
}: LikeButtonProps) {
  const { user } = useUser()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch current like status when component mounts
  useEffect(() => {
    if (user && activityId) {
      fetchLikeStatus()
    }
  }, [user, activityId])

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(
        `/api/activities/${activityId}/like?activityType=${activityType}`
      )
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
        setLikeCount(data.likeCount)
      }
    } catch (error) {
      console.error('Error fetching like status:', error)
    }
  }

  const handleLike = async () => {
    if (!user || isLoading) return

    console.log('🔍 LikeButton Debug - Starting like action:', { 
      activityId, 
      activityType, 
      user: user.id,
      currentLiked: isLiked,
      currentCount: likeCount 
    })

    // Optimistic update
    const newIsLiked = !isLiked
    const newCount = newIsLiked ? likeCount + 1 : likeCount - 1
    
    setIsLiked(newIsLiked)
    setLikeCount(newCount)
    setIsLoading(true)

    // Notify parent component
    onLikeChange?.(newIsLiked, newCount)

    try {
      console.log('🔍 LikeButton Debug - Making API request to:', `/api/activities/${activityId}/like`)
      console.log('🔍 LikeButton Debug - Request body:', { activityType })
      
      const response = await fetch(`/api/activities/${activityId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activityType })
      })

      console.log('🔍 LikeButton Debug - Response status:', response.status, response.statusText)
      
      const responseData = await response.json()
      console.log('🔍 LikeButton Debug - Response data:', responseData)

      if (response.ok) {
        console.log('✅ LikeButton Debug - Success! Updating UI with:', responseData)
        // Update with server response
        setIsLiked(responseData.isLiked)
        setLikeCount(responseData.likeCount)
        onLikeChange?.(responseData.isLiked, responseData.likeCount)
      } else {
        console.error('❌ LikeButton Debug - API error response:', responseData)
        // Revert optimistic update on error
        setIsLiked(!newIsLiked)
        setLikeCount(likeCount)
        onLikeChange?.(isLiked, likeCount)
        console.error('Failed to toggle like')
      }
    } catch (error) {
      console.error('❌ LikeButton Debug - Fetch error:', error)
      // Revert optimistic update on error
      setIsLiked(!newIsLiked)
      setLikeCount(likeCount)
      onLikeChange?.(isLiked, likeCount)
      console.error('Error toggling like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={!user || isLoading}
      className={`h-8 px-3 text-slate-600 transition-colors ${
        isLiked 
          ? 'text-rose-600 hover:text-rose-700' 
          : 'hover:text-rose-600'
      }`}
    >
      <Heart
        className={`w-4 h-4 mr-1 transition-all ${
          isLiked ? 'fill-rose-600 text-rose-600' : ''
        }`}
      />
      <span className="text-sm">{likeCount}</span>
    </Button>
  )
}