import { createClient } from '@supabase/supabase-js'
import { logger } from './utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create service role client that bypasses RLS (for server-side operations only)
export const createServiceClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(supabaseUrl, serviceKey)
}

// Storage helpers
export const getImageUrl = (path: string) => {
  if (!path) return null
  if (path.startsWith('http')) return path // External URLs
  return supabase.storage.from('puzzle-media').getPublicUrl(path).data.publicUrl
}

export const uploadImage = async (file: File, folder: string = 'puzzles') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('puzzle-media')
    .upload(fileName, file)
  
  if (error) throw error
  return data.path
}

// Database helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', user.id)
    .single()
  
  return profile
}

export const getPuzzleWithAggregates = async (puzzleId: string) => {
  const { data, error } = await supabase
    .from('puzzles')
    .select(`
      *,
      brand:brands(*),
      tags:puzzle_tags(tag:tags(*)),
      puzzle_aggregates(*)
    `)
    .eq('id', puzzleId)
    .eq('approval_status', 'approved')
    .single()

  if (error) throw error

  return {
    ...data,
    tags: data.tags?.map((pt: { tag: unknown }) => pt.tag).filter(Boolean) || []
  }
}
// ============================
// SMART LISTS DATABASE FUNCTIONS (CORRECTED)
// ============================

export type SmartListPuzzle = {
  id: string
  title: string
  brand: string
  pieces: number
  image: string
  metric?: string
}

// Get trending puzzles based on recent activity (last 7 days)
export const getTrendingPuzzles = async (limit: number = 3): Promise<SmartListPuzzle[]> => {
  try {
    logger.debug('Fetching trending puzzles...')
    
    // Get activities from the last 7 days (extended range for future dates)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 365) // Handle future dates

    // Count all activities (completions + reviews) in extended range
    const [logsResult, reviewsResult] = await Promise.all([
      supabase
        .from('puzzle_logs')
        .select('puzzle_id, logged_at')
        .gte('logged_at', sevenDaysAgo.toISOString())
        .lte('logged_at', futureDate.toISOString()),
      
      supabase
        .from('reviews')
        .select('puzzle_id, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .lte('created_at', futureDate.toISOString())
    ])

    if (logsResult.error || reviewsResult.error) {
      logger.error('Trending puzzles activity error:', logsResult.error || reviewsResult.error)
      // Fallback to highest rated puzzles
      return getHighestRatedPuzzles(limit)
    }

    // Combine all activities and count them
    const allActivities = [
      ...(logsResult.data || []),
      ...(reviewsResult.data || [])
    ]

    const activityCounts = allActivities.reduce((acc: Record<string, number>, activity) => {
      acc[activity.puzzle_id] = (acc[activity.puzzle_id] || 0) + 1
      return acc
    }, {})


    
    if (Object.keys(activityCounts).length === 0) {
      logger.info('No recent activity, falling back to highest rated puzzles')
      return getHighestRatedPuzzles(limit)
    }

    // Get top trending puzzle IDs
    const topPuzzleIds = Object.entries(activityCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, limit)
      .map(([id]) => id)

    const { data, error } = await supabase
      .from('puzzles')
      .select(`
        id,
        title,
        piece_count,
        image_url,
        brands!inner(name)
      `)
      .eq('approval_status', 'approved')
      .in('id', topPuzzleIds)

    if (error) {
      logger.error('Trending puzzles query error:', error)
      return []
    }

    logger.success(`Retrieved ${data?.length || 0} trending puzzles`)
    return (data || []).map(puzzle => ({
      id: puzzle.id,
      title: puzzle.title,
      brand: (puzzle.brands as any)?.name || 'Unknown',
      pieces: puzzle.piece_count,
      image: puzzle.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      metric: `${activityCounts[puzzle.id]} activities`
    }))
  } catch (error) {
    logger.error('Error fetching trending puzzles:', error)
    return []
  }
}

// Get most completed puzzles by counting puzzle_logs
export const getMostCompletedPuzzles = async (limit: number = 3): Promise<SmartListPuzzle[]> => {
  try {
    logger.debug('Fetching most completed puzzles...')
    
    // Get puzzle logs with puzzle info in one query
    const { data: puzzleData, error: puzzleError } = await supabase
      .from('puzzles')
      .select(`
        id,
        title,
        piece_count,
        image_url,
        brands!inner(name)
      `)
      .eq('approval_status', 'approved')

    if (puzzleError) {
      logger.error('Most completed puzzles error:', puzzleError)
      return getRecentlyAddedPuzzles(limit)
    }

    logger.debug(`Found ${puzzleData?.length || 0} approved puzzles`)

    // Get all puzzle logs
    const { data: logCounts, error: countError } = await supabase
      .from('puzzle_logs')
      .select('puzzle_id')

    if (countError) {
      logger.error('Most completed logs error:', countError)
      return getRecentlyAddedPuzzles(limit)
    }

    logger.debug(`Found ${logCounts?.length || 0} total puzzle logs`)

    // Count completions for each puzzle
    const completionCounts = (logCounts || []).reduce((acc: Record<string, number>, log) => {
      acc[log.puzzle_id] = (acc[log.puzzle_id] || 0) + 1
      return acc
    }, {})

    logger.debug('Completion counts by puzzle:', completionCounts)

    // Create results with completion counts, sort by count
    const puzzlesWithCounts = (puzzleData || []).map(puzzle => ({
      ...puzzle,
      completionCount: completionCounts[puzzle.id] || 0
    }))

    // Sort by completion count (highest first) and take top results
    const sortedPuzzles = puzzlesWithCounts
      .sort((a, b) => b.completionCount - a.completionCount)
      .slice(0, limit)

    if (sortedPuzzles.length === 0) {
      logger.info('No puzzles found, returning recently added')
      return getRecentlyAddedPuzzles(limit)
    }

    return sortedPuzzles.map(puzzle => ({
      id: puzzle.id,
      title: puzzle.title,
      brand: (puzzle.brands as any)?.name || 'Unknown',
      pieces: puzzle.piece_count,
      image: puzzle.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      metric: `${puzzle.completionCount} completed`
    }))
  } catch (error) {
    logger.error('Error fetching most completed puzzles:', error)
    return getRecentlyAddedPuzzles(limit)
  }
}

// Get highest rated puzzles (fallback for trending)
export const getHighestRatedPuzzles = async (limit: number = 3): Promise<SmartListPuzzle[]> => {
  try {
    logger.debug('Fetching highest rated puzzles...')
    
    // Now we can use the puzzle_aggregates table with proper JOIN!
    const { data, error } = await supabase
      .from('puzzles')
      .select(`
        id,
        title,
        piece_count,
        image_url,
        brands!inner(name),
        puzzle_aggregates!inner(avg_rating, review_count)
      `)
      .eq('approval_status', 'approved')
      .not('puzzle_aggregates.avg_rating', 'is', null)
      .order('puzzle_aggregates(avg_rating)', { ascending: false })
      .limit(limit)

    if (error) {
      logger.error('Highest rated puzzles error:', error)
      return getRecentlyAddedPuzzles(limit)
    }

    if (!data || data.length === 0) {
      logger.info('No rated puzzles, falling back to recently added')
      return getRecentlyAddedPuzzles(limit)
    }

    logger.success(`Retrieved ${data.length} highest rated puzzles`)
    return data.map(puzzle => ({
      id: puzzle.id,
      title: puzzle.title,
      brand: (puzzle.brands as any)?.name || 'Unknown',
      pieces: puzzle.piece_count,
      image: puzzle.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      metric: `⭐ ${Number((puzzle.puzzle_aggregates as any)?.avg_rating || 0).toFixed(1)} (${(puzzle.puzzle_aggregates as any)?.review_count || 0} reviews)`
    }))
  } catch (error) {
    logger.error('Error fetching highest rated puzzles:', error)
    return getRecentlyAddedPuzzles(limit)
  }
}

// Get recently added puzzles (last 7 days, fallback to last 3 puzzles)
export const getRecentlyAddedPuzzles = async (limit: number = 3): Promise<SmartListPuzzle[]> => {
  try {
    logger.debug('Fetching recently added puzzles...')
    
    // First try to get puzzles from last 7 days (but with wider range due to future dates)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    // Also try future dates (since your data has future dates)
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 365) // Look up to 1 year in future

    const { data: recentData, error: recentError } = await supabase
      .from('puzzles')
      .select(`
        id,
        title,
        piece_count,
        image_url,
        created_at,
        brands!inner(name)
      `)
      .eq('approval_status', 'approved')
      .gte('created_at', sevenDaysAgo.toISOString())
      .lte('created_at', futureDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    if (recentError) {
      logger.error('Recently added puzzles error:', recentError)
      return []
    }

    // If we have puzzles from this range, return them
    if (recentData && recentData.length > 0) {
      logger.success(`Retrieved ${recentData.length} recently added puzzles`)
      return recentData.map(puzzle => {
        const createdDate = new Date(puzzle.created_at)
        const now = new Date()
        const timeDiff = createdDate.getTime() - now.getTime()
        const daysAgo = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
        
        let metric = ''
        if (timeDiff > 0) {
          // Future date
          const daysInFuture = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
          if (daysInFuture === 0) metric = 'Today'
          else metric = `${daysInFuture} days ahead`
        } else {
          // Past date
          if (daysAgo === 0) metric = 'Today'
          else if (daysAgo === 1) metric = '1 day ago'
          else if (daysAgo < 7) metric = `${daysAgo} days ago`
          else if (daysAgo < 30) metric = `${Math.floor(daysAgo / 7)} week${Math.floor(daysAgo / 7) > 1 ? 's' : ''} ago`
          else metric = `${Math.floor(daysAgo / 30)} month${Math.floor(daysAgo / 30) > 1 ? 's' : ''} ago`
        }

        return {
          id: puzzle.id,
          title: puzzle.title,
          brand: (puzzle.brands as any)?.name || 'Unknown',
          pieces: puzzle.piece_count,
          image: puzzle.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
          metric
        }
      })
    }

    // Fallback: get last 3 puzzles regardless of date
    logger.info('No puzzles in recent range, falling back to last 3 puzzles')
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('puzzles')
      .select(`
        id,
        title,
        piece_count,
        image_url,
        created_at,
        brands!inner(name)
      `)
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (fallbackError) {
      logger.error('Fallback recently added puzzles error:', fallbackError)
      return []
    }

    logger.success(`Retrieved ${fallbackData?.length || 0} fallback puzzles`)
    return (fallbackData || []).map(puzzle => {
      const createdDate = new Date(puzzle.created_at)
      const now = new Date()
      const timeDiff = createdDate.getTime() - now.getTime()
      const daysAgo = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      
      let metric = ''
      if (timeDiff > 0) {
        // Future date
        const daysInFuture = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        if (daysInFuture === 0) metric = 'Today'
        else metric = `${daysInFuture} days ahead`
      } else {
        // Past date
        if (daysAgo === 0) metric = 'Today'
        else if (daysAgo === 1) metric = '1 day ago'
        else if (daysAgo < 7) metric = `${daysAgo} days ago`
        else if (daysAgo < 30) metric = `${Math.floor(daysAgo / 7)} week${Math.floor(daysAgo / 7) > 1 ? 's' : ''} ago`
        else metric = `${Math.floor(daysAgo / 30)} month${Math.floor(daysAgo / 30) > 1 ? 's' : ''} ago`
      }

      return {
        id: puzzle.id,
        title: puzzle.title,
        brand: (puzzle.brands as any)?.name || 'Unknown',
        pieces: puzzle.piece_count,
        image: puzzle.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        metric
      }
    })
  } catch (error) {
    logger.error('Error fetching recently added puzzles:', error)
    return []
  }
}

// Get all smart lists data
export const getSmartListsData = async () => {
  try {
    logger.debug('Fetching all smart lists data...')
    
    const [trending, mostCompleted, recentlyAdded] = await Promise.all([
      getTrendingPuzzles(3),
      getMostCompletedPuzzles(3),
      getRecentlyAddedPuzzles(3)
    ])

    logger.success('Smart lists data fetched successfully:', {
      trending: trending.length,
      mostCompleted: mostCompleted.length,
      recentlyAdded: recentlyAdded.length
    })

    return {
      trending,
      mostCompleted,
      recentlyAdded
    }
  } catch (error) {
    logger.error('Error fetching smart lists data:', error)
    return {
      trending: [],
      mostCompleted: [],
      recentlyAdded: []
    }
  }
}

// ============================
// USER PUZZLES DATABASE FUNCTIONS
// ============================

export type UserPuzzleStatus = 'completed' | 'want-to-do' | 'in-progress' | 'abandoned'

export type UserPuzzle = {
  id: string
  title: string
  brand: string
  pieces: number
  image: string
  status: UserPuzzleStatus
  completedAt?: string
  startedAt?: string
  timeSpent?: number // in seconds
  notes?: string
  rating?: number // 1-5 stars (user's puzzle rating)
  photos?: string[]
  difficulty?: number // 1-5 stars (user's difficulty rating)
  progressPercentage?: number // 0-100 (completion percentage)
  private?: boolean // whether this log is private
  createdAt?: string // when the log was created
  updatedAt?: string // when the log was last updated
}

export type UserPuzzleStats = {
  totalCompleted: number
  totalTimeSpent: number // in seconds
  averageTimePerPuzzle: number
  totalPuzzles: number
  thisMonthCompleted: number
  favoriteBrand: string
}

// Types for creating and updating puzzle logs
export type CreatePuzzleLogRequest = {
  puzzleId: string
  status: UserPuzzleStatus
  startedAt?: string
  completedAt?: string
  timeSpent?: number
  notes?: string
  rating?: number
  difficulty?: number
  photos?: string[]
  progressPercentage?: number
  private?: boolean
}

export type UpdatePuzzleLogRequest = {
  status?: UserPuzzleStatus
  startedAt?: string
  completedAt?: string
  timeSpent?: number
  notes?: string
  rating?: number
  difficulty?: number
  photos?: string[]
  progressPercentage?: number
  private?: boolean
}

// Types for creating new puzzles
export type CreatePuzzleRequest = {
  title: string
  brandId?: string
  pieceCount?: number
  imageUrl?: string
  theme?: string
  material?: string
  description?: string
  year?: number
}

export type Puzzle = {
  id: string
  title: string
  brand?: {
    id: string
    name: string
  }
  imageUrl?: string
  pieceCount?: number
  theme?: string
  material?: string
  description?: string
  year?: number
  createdAt: string
  updatedAt: string
}

// Get user's puzzle collection with status
export const getUserPuzzles = async (userId: string, status?: UserPuzzleStatus): Promise<UserPuzzle[]> => {
  try {
    logger.debug('Fetching user puzzles...', { userId, status })
    
    const results: UserPuzzle[] = []

    // Get puzzles from puzzle_logs (completed and in-progress)
    if (!status || status === 'completed' || status === 'in-progress') {
      let logQuery = supabase
        .from('puzzle_logs')
        .select(`
          *,
          puzzle:puzzles!inner(
            id,
            title,
            piece_count,
            image_url,
            brand:brands(name)
          )
        `)
        .eq('user_id', userId)

      if (status === 'completed') {
        logQuery = logQuery.not('logged_at', 'is', null)
      } else if (status === 'in-progress') {
        logQuery = logQuery.is('logged_at', null)
      }

      const { data: logData, error: logError } = await logQuery.order('logged_at', { ascending: false })

      if (logError) {
        console.error('❌ Error fetching puzzle logs:', logError)
      } else {
        // Group logs by puzzle ID and keep only the most recent log for each puzzle
        const puzzleMap = new Map()
        
        ;(logData || []).forEach(log => {
          const puzzleId = log.puzzle.id
          const existingLog = puzzleMap.get(puzzleId)
          
          // Keep the most recent log (first one due to our ordering)
          if (!existingLog) {
            puzzleMap.set(puzzleId, {
              id: log.puzzle.id,
              title: log.puzzle.title,
              brand: log.puzzle.brand?.name || 'Unknown',
              pieces: log.puzzle.piece_count,
              image: log.puzzle.image_url || '/placeholder-puzzle.svg',
              status: log.logged_at ? 'completed' as UserPuzzleStatus : 'in-progress' as UserPuzzleStatus,
              completedAt: log.logged_at,
              timeSpent: log.solve_time_seconds,
              notes: log.note,
              photos: log.photo_urls || []
            })
          }
        })
        
        results.push(...Array.from(puzzleMap.values()))
      }
    }

    // Get want-to-do puzzles from lists
    if (!status || status === 'want-to-do') {
      console.log('🎯 Fetching want-to-do puzzles for user:', userId)
      
      // Fixed query with correct Supabase JOIN syntax
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('list_items')
        .select(`
          puzzle_id,
          list:lists!inner(
            user_id,
            name
          )
        `)
        .eq('list.user_id', userId)
        .eq('list.name', 'Want to Do Next')

      console.log('🎯 Wishlist query result:', { wishlistData, wishlistError })

      if (wishlistError) {
        console.error('❌ Error fetching wishlist puzzles:', wishlistError)
      } else if (wishlistData && wishlistData.length > 0) {
        // Get puzzle details for the wishlist items
        const puzzleIds = wishlistData.map(item => item.puzzle_id)
        console.log('🎯 Found puzzle IDs in wishlist:', puzzleIds)
        
        const { data: puzzleDetails, error: puzzleError } = await supabase
          .from('puzzles')
          .select(`
            id,
            title,
            piece_count,
            image_url,
            brand:brands(name)
          `)
          .in('id', puzzleIds)

        console.log('🎯 Puzzle details query result:', { puzzleDetails, puzzleError })

        if (puzzleError) {
          console.error('❌ Error fetching puzzle details:', puzzleError)
        } else {
          const wishlistPuzzles = (puzzleDetails || [])
            // Filter out puzzles that are already in puzzle_logs
            .filter(puzzle => !results.some(r => r.id === puzzle.id))
            .map(puzzle => ({
              id: puzzle.id,
              title: puzzle.title,
              brand: (puzzle.brand as any)?.name || 'Unknown',
              pieces: puzzle.piece_count,
              image: puzzle.image_url || '/placeholder-puzzle.svg',
              status: 'want-to-do' as UserPuzzleStatus,
              photos: []
            }))
          
          console.log('🎯 Processed wishlist puzzles:', wishlistPuzzles)
          results.push(...wishlistPuzzles)
        }
      } else {
        console.log('🎯 No wishlist data found')
      }
    }

    // Final deduplication based on puzzle ID (just in case)
    const uniqueResults = results.filter((puzzle, index, self) => 
      index === self.findIndex(p => p.id === puzzle.id)
    )

    console.log(`✅ Retrieved ${uniqueResults.length} user puzzles (status: ${status || 'all'}) - removed ${results.length - uniqueResults.length} duplicates`)
    return uniqueResults
    
  } catch (error) {
    console.error('💥 Error fetching user puzzles:', error)
    return []
  }
}

// Get user's puzzle statistics
export const getUserPuzzleStats = async (userId: string): Promise<UserPuzzleStats> => {
  try {
    console.log('📊 Fetching user puzzle stats...', { userId })
    
    // Get all user's completed puzzles
    const { data: completedLogs, error: logsError } = await supabase
      .from('puzzle_logs')
      .select(`
        *,
        puzzle:puzzles!inner(
          brand:brands(name)
        )
      `)
      .eq('user_id', userId)
      .not('logged_at', 'is', null)

    if (logsError) {
      console.error('❌ Error fetching user stats:', logsError)
      return {
        totalCompleted: 0,
        totalTimeSpent: 0,
        averageTimePerPuzzle: 0,
        totalPuzzles: 0,
        thisMonthCompleted: 0,
        favoriteBrand: 'None'
      }
    }

    const logs = completedLogs || []
    const totalCompleted = logs.length
    const totalTimeSpent = logs.reduce((sum, log) => sum + (log.solve_time_seconds || 0), 0)
    const averageTimePerPuzzle = totalCompleted > 0 ? Math.round(totalTimeSpent / totalCompleted) : 0

    // Calculate this month's completions
    const thisMonth = new Date()
    thisMonth.setDate(1) // First day of current month
    const thisMonthCompleted = logs.filter(log => 
      new Date(log.logged_at) >= thisMonth
    ).length

    // Find favorite brand
    const brandCounts: Record<string, number> = {}
    logs.forEach(log => {
      const brandName = log.puzzle?.brand?.name || 'Unknown'
      brandCounts[brandName] = (brandCounts[brandName] || 0) + 1
    })
    
    const favoriteBrand = Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'

    console.log('✅ User stats calculated:', {
      totalCompleted,
      totalTimeSpent,
      averageTimePerPuzzle,
      thisMonthCompleted,
      favoriteBrand
    })

    return {
      totalCompleted,
      totalTimeSpent,
      averageTimePerPuzzle,
      totalPuzzles: totalCompleted, // For now, same as completed
      thisMonthCompleted,
      favoriteBrand
    }
  } catch (error) {
    console.error('💥 Error calculating user stats:', error)
    return {
      totalCompleted: 0,
      totalTimeSpent: 0,
      averageTimePerPuzzle: 0,
      totalPuzzles: 0,
      thisMonthCompleted: 0,
      favoriteBrand: 'None'
    }
  }
}

// Search user's puzzles
export const searchUserPuzzles = async (
  userId: string, 
  searchTerm: string, 
  brandFilter?: string,
  sortBy: 'recent' | 'title' | 'brand' | 'pieces' = 'recent'
): Promise<UserPuzzle[]> => {
  try {
    console.log('🔍 Searching user puzzles...', { userId, searchTerm, brandFilter, sortBy })
    
    let query = supabase
      .from('puzzle_logs')
      .select(`
        *,
        puzzle:puzzles!inner(
          id,
          title,
          piece_count,
          image_url,
          brand:brands(name)
        )
      `)
      .eq('user_id', userId)

    // Apply search filter
    if (searchTerm) {
      query = query.ilike('puzzle.title', `%${searchTerm}%`)
    }

    // Apply brand filter
    if (brandFilter && brandFilter !== 'all') {
      query = query.eq('puzzle.brand.name', brandFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        query = query.order('logged_at', { ascending: false })
        break
      case 'title':
        query = query.order('puzzle(title)', { ascending: true })
        break
      case 'pieces':
        query = query.order('puzzle(piece_count)', { ascending: false })
        break
      default:
        query = query.order('logged_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Error searching user puzzles:', error)
      return []
    }

    console.log(`✅ Found ${data?.length || 0} matching puzzles`)
    
    return (data || []).map(log => ({
      id: log.puzzle.id,
      title: log.puzzle.title,
      brand: log.puzzle.brand?.name || 'Unknown',
      pieces: log.puzzle.piece_count,
      image: log.puzzle.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      status: log.logged_at ? 'completed' : 'in-progress',
      completedAt: log.logged_at,
      timeSpent: log.solve_time_seconds,
      notes: log.note,
      photos: log.photo_urls || []
    }))
  } catch (error) {
    console.error('💥 Error searching user puzzles:', error)
    return []
  }
}