'use client'

import { Button } from '@/components/ui/button'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { useFollow } from '@/hooks/use-follow'

interface FollowButtonProps {
  userId: string
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'secondary'
  iconOnly?: boolean
}

export function FollowButton({ 
  userId, 
  className = '', 
  size = 'default',
  variant = 'default',
  iconOnly = false
}: FollowButtonProps) {
  const { isFollowing, isLoading, isSelf, followUser, unfollowUser, error } = useFollow(userId)

  const handleClick = async () => {
    if (isFollowing) {
      await unfollowUser()
    } else {
      await followUser()
    }
  }

  // Don't render button for user's own posts
  if (isSelf) {
    return null
  }

  if (isLoading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        disabled 
        className={`${className} ${iconOnly ? 'w-9 h-9 p-0' : ''}`}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    )
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : variant}
      size={size}
      onClick={handleClick}
      className={`${className} ${iconOnly ? 'w-9 h-9 p-0' : ''}`}
      title={error || (iconOnly ? (isFollowing ? 'Following' : 'Follow') : undefined)}
    >
      {iconOnly ? (
        isFollowing ? (
          <UserCheck className="w-4 h-4" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )
      ) : (
        isFollowing ? (
          <>
            <UserCheck className="w-4 h-4 mr-2" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Follow
          </>
        )
      )}
    </Button>
  )
}