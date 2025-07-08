import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServiceClient()
    
    // Get all approved puzzles with their themes
    const { data: puzzles, error } = await supabase
      .from('puzzles')
      .select('theme')
      .eq('approval_status', 'approved')
      .not('theme', 'is', null)
    
    if (error) {
      console.error('Failed to fetch puzzles:', error)
      return NextResponse.json({ error: 'Failed to fetch puzzles' }, { status: 500 })
    }

    // Count puzzles by category/theme
    const categoryCounts: Record<string, number> = {}
    
    puzzles?.forEach(puzzle => {
      if (puzzle.theme) {
        const theme = puzzle.theme.toLowerCase()
        
        // Map themes to category IDs
        if (theme.includes('nature') || theme.includes('landscape') || theme.includes('garden') || theme.includes('mountain') || theme.includes('forest') || theme.includes('ocean')) {
          categoryCounts.nature = (categoryCounts.nature || 0) + 1
        }
        if (theme.includes('art') || theme.includes('painting') || theme.includes('museum') || theme.includes('van gogh') || theme.includes('monet')) {
          categoryCounts.art = (categoryCounts.art || 0) + 1
        }
        if (theme.includes('animal') || theme.includes('wildlife') || theme.includes('dog') || theme.includes('cat') || theme.includes('bird') || theme.includes('retriever') || theme.includes('puppy')) {
          categoryCounts.animals = (categoryCounts.animals || 0) + 1
        }
        if (theme.includes('architecture') || theme.includes('building') || theme.includes('castle') || theme.includes('church') || theme.includes('bridge')) {
          categoryCounts.architecture = (categoryCounts.architecture || 0) + 1
        }
        if (theme.includes('vintage') || theme.includes('classic') || theme.includes('retro') || theme.includes('antique') || theme.includes('car') || theme.includes('historic')) {
          categoryCounts.vintage = (categoryCounts.vintage || 0) + 1
        }
        if (theme.includes('fantasy') || theme.includes('fiction') || theme.includes('magic') || theme.includes('dragon') || theme.includes('fairy')) {
          categoryCounts.fantasy = (categoryCounts.fantasy || 0) + 1
        }
        if (theme.includes('city') || theme.includes('cities') || theme.includes('urban') || theme.includes('travel') || theme.includes('destination') || theme.includes('skyline')) {
          categoryCounts.cities = (categoryCounts.cities || 0) + 1
        }
        if (theme.includes('food') || theme.includes('drink') || theme.includes('beverage') || theme.includes('coffee') || theme.includes('wine') || theme.includes('cuisine')) {
          categoryCounts.food = (categoryCounts.food || 0) + 1
        }
      }
    })

    console.log('📊 Category counts:', categoryCounts)
    
    return NextResponse.json({ 
      success: true, 
      categories: categoryCounts,
      total: puzzles?.length || 0
    })

  } catch (error) {
    console.error('Error in GET /api/categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 