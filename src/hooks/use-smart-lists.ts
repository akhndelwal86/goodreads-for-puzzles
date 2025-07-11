'use client'

import { useQuery } from '@tanstack/react-query'
import { 
  getMostCompletedPuzzles, 
  getTrendingPuzzles, 
  getRecentlyAddedPuzzles,
  getHighestRatedPuzzles,
  type SmartListPuzzle 
} from '@/lib/supabase'
import { queryKeys } from '@/lib/react-query'

export function useMostCompleted(limit = 3) {
  return useQuery({
    queryKey: [...queryKeys.smartLists, 'most-completed', limit],
    queryFn: () => getMostCompletedPuzzles(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useTrending(limit = 3) {
  return useQuery({
    queryKey: [...queryKeys.smartLists, 'trending', limit],
    queryFn: () => getTrendingPuzzles(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes (trending changes more frequently)
    gcTime: 20 * 60 * 1000, // 20 minutes
  })
}

export function useRecentlyAdded(limit = 3) {
  return useQuery({
    queryKey: [...queryKeys.smartLists, 'recently-added', limit],
    queryFn: () => getRecentlyAddedPuzzles(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 45 * 60 * 1000, // 45 minutes
  })
}

export function useTopRated(limit = 3) {
  return useQuery({
    queryKey: [...queryKeys.smartLists, 'top-rated', limit],
    queryFn: () => getHighestRatedPuzzles(limit),
    staleTime: 20 * 60 * 1000, // 20 minutes (ratings change slowly)
    gcTime: 60 * 60 * 1000, // 60 minutes
  })
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
