'use client'

import { useEffect, useState } from 'react'
import { 
  getMostCompletedPuzzles, 
  getTrendingPuzzles, 
  getRecentlyAddedPuzzles,
  getHighestRatedPuzzles,
  type SmartListPuzzle 
} from '@/lib/supabase'

interface UseQueryResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
}

function useAsyncData<T>(fn: () => Promise<T>, deps: any[] = []): UseQueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    fn()
      .then((result) => {
        if (isMounted) setData(result)
      })
      .catch((err) => {
        if (isMounted) setError(err)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, deps)

  return { data, isLoading, error }
}

export function useMostCompleted(limit = 3): UseQueryResult<SmartListPuzzle[]> {
  return useAsyncData(() => getMostCompletedPuzzles(limit), [limit])
}

export function useTrending(limit = 3): UseQueryResult<SmartListPuzzle[]> {
  return useAsyncData(() => getTrendingPuzzles(limit), [limit])
}

export function useRecentlyAdded(limit = 3): UseQueryResult<SmartListPuzzle[]> {
  return useAsyncData(() => getRecentlyAddedPuzzles(limit), [limit])
}

export function useTopRated(limit = 3): UseQueryResult<SmartListPuzzle[]> {
  return useAsyncData(() => getHighestRatedPuzzles(limit), [limit])
}

export function useSmartLists() {
  const trending = useTrending(3)
  const mostCompleted = useMostCompleted(3)
  const recentlyAdded = useRecentlyAdded(3)
  const topRated = useTopRated(3)

  return {
    trending,
    mostCompleted,
    recentlyAdded,
    topRated,
    isLoading: trending.isLoading || mostCompleted.isLoading || recentlyAdded.isLoading || topRated.isLoading,
    error: trending.error || mostCompleted.error || recentlyAdded.error || topRated.error
  }
} 
