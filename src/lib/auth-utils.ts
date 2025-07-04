import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

// Client-side user sync utility (calls server-side endpoint)
export function useUserSync() {
  const { user, isLoaded } = useUser()
  const [syncStatus, setSyncStatus] = useState<'pending' | 'syncing' | 'synced' | 'error'>('pending')
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    if (!isLoaded || !user) {
      setSyncStatus('pending')
      return
    }

    const syncUser = async () => {
      setSyncStatus('syncing')
      console.log('🔄 Starting user sync for Clerk ID:', user.id)
      
      try {
        // Call server-side sync endpoint
        const response = await fetch('/api/user-sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData: {
              emailAddresses: user.emailAddresses,
              primaryEmailAddress: user.primaryEmailAddress,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl,
            }
          })
        })

        const result = await response.json()

        if (response.ok) {
          console.log(`✅ User sync successful (${result.action}):`, result.user.id)
          setSyncStatus('synced')
        } else {
          console.error('❌ User sync failed:', result)
          setSyncStatus('error')
        }
      } catch (error) {
        console.error('❌ Unexpected error during user sync:', error)
        setSyncStatus('error')
      }
    }

    syncUser()
  }, [user, isLoaded])

  return { user, isLoaded, syncStatus }
} 