import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'

// Client-side user sync utility (temporary solution)
export function useUserSync() {
  const { user, isLoaded } = useUser()
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    if (!isLoaded || !user) return

    const syncUser = async () => {
      try {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id)
          .single()

        if (!existingUser) {
          // Create user if doesn't exist
          const { error } = await supabase
            .from('users')
            .insert({
              clerk_id: user.id,
              email: user.emailAddresses[0]?.emailAddress || '',
              username: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
              avatar_url: user.imageUrl || null,
            })

          if (error) {
            console.error('Error creating user:', error)
          } else {
            console.log('User created successfully')
          }
        }
      } catch (error) {
        console.error('Error syncing user:', error)
      }
    }

    syncUser()
  }, [user, isLoaded])

  return { user, isLoaded }
} 