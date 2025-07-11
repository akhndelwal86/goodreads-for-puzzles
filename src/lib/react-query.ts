import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes before garbage collection
      gcTime: 10 * 60 * 1000,
      // Retry failed requests up to 2 times
      retry: 2,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (good for real-time updates)
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default (can be overridden per query)
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
})

// Common query keys for consistency
export const queryKeys = {
  // Homepage data
  homepageStats: ['homepage', 'stats'] as const,
  puzzleOfTheDay: ['homepage', 'puzzle-of-the-day'] as const,
  smartLists: ['homepage', 'smart-lists'] as const,
  
  // Puzzle data
  puzzles: ['puzzles'] as const,
  puzzle: (id: string) => ['puzzles', id] as const,
  puzzleReviews: (id: string) => ['puzzles', id, 'reviews'] as const,
  puzzleActivity: (id: string) => ['puzzles', id, 'activity'] as const,
  
  // User data
  userPuzzles: (userId: string) => ['users', userId, 'puzzles'] as const,
  userActivity: (userId: string) => ['users', userId, 'activity'] as const,
  userProfile: (userId: string) => ['users', userId, 'profile'] as const,
  
  // Collections
  collections: ['collections'] as const,
  collection: (id: string) => ['collections', id] as const,
  userCollections: (userId: string) => ['users', userId, 'collections'] as const,
  
  // Community
  activityFeed: ['community', 'activity'] as const,
  leaderboards: ['community', 'leaderboards'] as const,
  
  // Brands and categories
  brands: ['brands'] as const,
  categories: ['categories'] as const,
} as const