import { useState, useEffect } from 'react'
import { useFollowContext } from '@/contexts/follow-context'

interface UseFollowReturn {
  isFollowing: boolean
  isLoading: boolean
  isSelf: boolean
  followUser: () => Promise<void>
  unfollowUser: () => Promise<void>
  error: string | null
}

export function useFollow(userId: string): UseFollowReturn {
  const { followState, updateFollowState } = useFollowContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isSelf, setIsSelf] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get follow state from context, fallback to local state during loading
  const isFollowing = followState[userId] ?? false

  // Check follow status on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/users/${userId}/follow-status`)
        
        if (response.ok) {
          const data = await response.json()
          updateFollowState(userId, data.isFollowing)
          setIsSelf(data.isSelf || false)
        } else {
          console.error('Failed to check follow status')
        }
      } catch (err) {
        console.error('Error checking follow status:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      checkFollowStatus()
    }
  }, [userId])

  const followUser = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
      })

      if (response.ok) {
        updateFollowState(userId, true)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to follow user')
      }
    } catch (err) {
      setError('Failed to follow user')
      console.error('Error following user:', err)
    }
  }

  const unfollowUser = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'DELETE',
      })

      if (response.ok) {
        updateFollowState(userId, false)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to unfollow user')
      }
    } catch (err) {
      setError('Failed to unfollow user')
      console.error('Error unfollowing user:', err)
    }
  }

  return {
    isFollowing,
    isLoading,
    isSelf,
    followUser,
    unfollowUser,
    error
  }
}