import { createServiceClient } from './supabase'

export interface CreateFeedItemOptions {
  userId: string
  type: 'puzzle_log' | 'review' | 'solved' | 'add_to_list' | 'status_change' | 'puzzle_upload'
  puzzleId?: string
  listId?: string
  reviewId?: string
  puzzleLogId?: string
  text?: string
  imageUrl?: string
  mediaUrls?: string[]
}

/**
 * Creates a feed item for user activity
 */
export async function createFeedItem(options: CreateFeedItemOptions) {
  const supabase = createServiceClient()
  
  try {
    const feedItemData = {
      user_id: options.userId,
      type: options.type,
      target_puzzle_id: options.puzzleId || null,
      target_list_id: options.listId || null,
      target_review_id: options.reviewId || null,
      target_puzzle_log_id: options.puzzleLogId || null,
      text: options.text || null,
      image_url: options.imageUrl || null,
      media_urls: options.mediaUrls || [],
      created_at: new Date().toISOString()
    }

    const { data: feedItem, error } = await supabase
      .from('feed_items')
      .insert([feedItemData])
      .select()
      .single()

    if (error) {
      console.error('Error creating feed item:', error)
      return { success: false, error }
    }

    console.log('✅ Created feed item:', feedItem.id, 'type:', options.type, 'created_at:', feedItem.created_at)
    return { success: true, feedItem }

  } catch (error) {
    console.error('Error in createFeedItem:', error)
    return { success: false, error }
  }
}

/**
 * Creates feed items for puzzle log activities
 */
export async function createPuzzleLogFeedItems(
  userId: string,
  puzzleLogId: string,
  puzzleId: string,
  status: string,
  oldStatus?: string,
  progressPercentage?: number,
  solveTimeSeconds?: number,
  mediaUrls?: string[]
) {
  console.log('🎯 createPuzzleLogFeedItems called with:', {
    userId,
    puzzleLogId,
    puzzleId,
    status,
    oldStatus,
    progressPercentage,
    hasMediaUrls: mediaUrls && mediaUrls.length > 0,
    mediaUrlsCount: mediaUrls?.length || 0
  })
  
  const results = []

  // Create different feed items based on status changes
  if (status === 'completed' && oldStatus !== 'completed') {
    // Puzzle completed - create 'solved' feed item
    let text = '🎉 Just finished this puzzle!'
    if (solveTimeSeconds) {
      const hours = Math.floor(solveTimeSeconds / 3600)
      const minutes = Math.floor((solveTimeSeconds % 3600) / 60)
      
      if (hours > 24) {
        const days = Math.floor(hours / 24)
        text = `✨ Completed this challenging puzzle after ${days} days of work!`
      } else if (hours > 8) {
        text = `🏆 Finished this puzzle after a marathon ${hours}h ${minutes}m session!`
      } else if (hours > 2) {
        text = `🧩 Solved this puzzle in ${hours}h ${minutes}m - what a great workout for the brain!`
      } else if (hours > 0) {
        text = `⚡ Quick solve! Completed this puzzle in just ${hours}h ${minutes}m`
      } else if (minutes > 30) {
        text = `🚀 Speed run! Finished this puzzle in ${minutes} minutes`
      } else {
        text = `💨 Lightning fast! Solved in under ${minutes} minutes`
      }
    } else {
      text = '🎯 Another puzzle conquered!'
    }

    const result = await createFeedItem({
      userId,
      type: 'solved',
      puzzleId,
      puzzleLogId,
      text,
      mediaUrls
    })
    results.push(result)
  } else if (status === 'in-progress' && oldStatus !== 'in-progress') {
    // Started working on puzzle
    const startTexts = [
      '🔥 Diving into a new puzzle challenge!',
      '🧩 Time to get puzzling with this one!',
      '⚡ Starting fresh on this puzzle adventure',
      '🎯 Let the puzzle solving begin!',
      '🚀 Embarking on a new jigsaw journey'
    ]
    const text = startTexts[Math.floor(Math.random() * startTexts.length)]
    
    const result = await createFeedItem({
      userId,
      type: 'puzzle_log',
      puzzleId,
      puzzleLogId,
      text,
      mediaUrls
    })
    results.push(result)
  } else if (status === 'library' && oldStatus !== 'library') {
    // Added to library - contextual based on previous status
    let text = ''
    
    if (oldStatus === 'wishlist') {
      const wishlistToLibraryTexts = [
        '📚 Moved this puzzle from wishlist to library',
        '✅ Decided to get this puzzle - moved to library',
        '🎯 Ready to tackle this one - moved to library',
        '💪 This wishlist puzzle is now in my collection!'
      ]
      text = wishlistToLibraryTexts[Math.floor(Math.random() * wishlistToLibraryTexts.length)]
    } else if (oldStatus === 'abandoned') {
      const abandonedToLibraryTexts = [
        '🔄 Giving this puzzle another chance - back to library',
        '💭 Reconsidering this puzzle - moved to library',
        '🎯 This puzzle deserves another shot'
      ]
      text = abandonedToLibraryTexts[Math.floor(Math.random() * abandonedToLibraryTexts.length)]
    } else {
      // New addition to library
      const addTexts = [
        '📚 Added this beauty to the puzzle collection!',
        '⭐ Found a gem worth keeping - added to library',
        '🎯 This one caught my eye - saved for later!',
        '💎 Spotted this treasure and added to the collection',
        '🔖 Bookmarked this puzzle for future solving'
      ]
      text = addTexts[Math.floor(Math.random() * addTexts.length)]
    }
    
    const result = await createFeedItem({
      userId,
      type: 'add_to_list',
      puzzleId,
      puzzleLogId,
      text,
      mediaUrls
    })
    results.push(result)
  } else if (status === 'wishlist' && oldStatus !== 'wishlist') {
    // Added to wishlist - contextual based on previous status
    let text = ''
    
    if (oldStatus === 'library') {
      const libraryToWishlistTexts = [
        '⭐ Moved this puzzle back to the wishlist',
        '💭 Reconsidering this puzzle - back to wishlist',
        '🤔 This puzzle is back on my wishlist for now'
      ]
      text = libraryToWishlistTexts[Math.floor(Math.random() * libraryToWishlistTexts.length)]
    } else if (oldStatus === 'abandoned') {
      const abandonedToWishlistTexts = [
        '💭 Giving this puzzle some thought again',
        '⭐ This puzzle is back on my radar',
        '🤔 Reconsidering this puzzle for my wishlist'
      ]
      text = abandonedToWishlistTexts[Math.floor(Math.random() * abandonedToWishlistTexts.length)]
    } else {
      // New addition to wishlist
      const wishlistTexts = [
        '⭐ Added this puzzle to the wishlist',
        '💭 This puzzle caught my interest!',
        '🤔 Thinking about getting this puzzle',
        '👀 This puzzle is now on my radar',
        '⭐ Bookmarked this puzzle for consideration'
      ]
      text = wishlistTexts[Math.floor(Math.random() * wishlistTexts.length)]
    }
    
    const result = await createFeedItem({
      userId,
      type: 'add_to_list',
      puzzleId,
      puzzleLogId,
      text,
      mediaUrls
    })
    results.push(result)
  } else if (mediaUrls && mediaUrls.length > 0) {
    // Photo/media update - always deserves a feed item regardless of status
    let text = ''
    
    if (status === 'completed') {
      text = `📸 Shared new photos of this completed puzzle!`
    } else if (progressPercentage && progressPercentage > 0) {
      text = `📸 Progress update with photos - ${progressPercentage}% complete!`
    } else {
      text = `📸 Shared new photos of this puzzle`
    }
    
    console.log('📸 Creating feed item for photo update:', text)
    
    const result = await createFeedItem({
      userId,
      type: 'puzzle_log',
      puzzleId,
      puzzleLogId,
      text,
      mediaUrls
    })
    results.push(result)
  } else if (progressPercentage && progressPercentage > 0 && status === 'in-progress') {
    // Progress update - contextual based on progress level
    let text = ''
    
    if (progressPercentage >= 90) {
      text = `🏁 Almost there! ${progressPercentage}% complete - the final stretch!`
    } else if (progressPercentage >= 75) {
      text = `🔥 Making great progress! ${progressPercentage}% done - getting close!`
    } else if (progressPercentage >= 50) {
      text = `⚡ Halfway milestone reached! ${progressPercentage}% complete and going strong`
    } else if (progressPercentage >= 25) {
      text = `🧩 Making steady progress - ${progressPercentage}% complete!`
    } else {
      text = `🚀 Getting started! ${progressPercentage}% complete on this puzzle`
    }
    
    console.log('📈 Creating feed item for progress update:', text)
    
    const result = await createFeedItem({
      userId,
      type: 'puzzle_log',
      puzzleId,
      puzzleLogId,
      text,
      mediaUrls
    })
    results.push(result)
  } else if (oldStatus && oldStatus !== status) {
    // General status change - more engaging descriptions
    const fromStatus = oldStatus.replace(/[-_]/g, ' ')
    const toStatus = status.replace(/[-_]/g, ' ')
    
    let text = ''
    let shouldCreateFeedItem = true
    
    if (status === 'abandoned') {
      if (oldStatus === 'in-progress') {
        text = `⏸️ Taking a break from this puzzle for now`
      } else {
        text = `📦 Decided to set this puzzle aside for now`
      }
    } else if (status === 'wishlist') {
      if (oldStatus === 'library') {
        text = `⭐ Moved this puzzle back to the wishlist`
      } else {
        text = `💭 Added this puzzle to the wishlist`
      }
    } else if (status === 'library') {
      if (oldStatus === 'wishlist') {
        text = `📚 Moved this puzzle from wishlist to library`
      } else if (oldStatus === 'abandoned') {
        text = `🔄 Giving this puzzle consideration again`
      } else {
        text = `📚 Added this puzzle to the library`
      }
    } else if (oldStatus === 'abandoned' && status === 'in-progress') {
      text = `🔄 Giving this puzzle another shot!`
    } else if (oldStatus === 'completed' && status === 'in-progress') {
      text = `🔄 Revisiting this completed puzzle`
    } else if (oldStatus === 'wishlist' && status === 'in-progress') {
      text = `🚀 Starting work on this wishlist puzzle`
    } else if (oldStatus === 'library' && status === 'in-progress') {
      text = `🎯 Beginning work on this puzzle`
    } else {
      // For less common transitions, create a more generic message
      text = `🔄 Updated status: ${fromStatus} → ${toStatus}`
      
      // Don't create feed items for very minor status changes
      if ((oldStatus === 'wishlist' && status === 'library') || 
          (oldStatus === 'library' && status === 'wishlist')) {
        shouldCreateFeedItem = false
      }
    }
    
    if (shouldCreateFeedItem) {
      const result = await createFeedItem({
        userId,
        type: 'status_change',
        puzzleId,
        puzzleLogId,
        text,
        mediaUrls
      })
      results.push(result)
    }
  }

  return results
}