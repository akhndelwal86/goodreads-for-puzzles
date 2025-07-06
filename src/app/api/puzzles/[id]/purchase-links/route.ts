import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Fetch purchase links for a puzzle
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: 'Invalid puzzle ID format' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // For now, return the puzzle's built-in purchase_link
    // Later we can extend this to a separate purchase_links table
    const { data: puzzle, error } = await supabase
      .from('puzzles')
      .select('purchase_link')
      .eq('id', id)
      .single()

    if (error || !puzzle) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 })
    }

    // Format as array for consistency (future-proofing for multiple links)
    const purchaseLinks = puzzle.purchase_link ? [
      {
        id: 'default',
        url: puzzle.purchase_link,
        retailer: extractRetailerName(puzzle.purchase_link),
        price: null, // We'll add price parsing later
        currency: 'USD',
        added_by: 'system',
        verified: true,
        created_at: new Date().toISOString()
      }
    ] : []

    return NextResponse.json({ purchaseLinks })

  } catch (error) {
    console.error('Error fetching purchase links:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add a new purchase link
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { url, retailer, price, currency = 'USD' } = body

    // Validate required fields
    if (!url || !retailer) {
      return NextResponse.json({ error: 'URL and retailer are required' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get user ID from Clerk ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // For now, update the puzzle's purchase_link field
    // Later we can extend this to a separate purchase_links table
    const { data: puzzle, error: updateError } = await supabase
      .from('puzzles')
      .update({ 
        purchase_link: url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating purchase link:', updateError)
      return NextResponse.json({ error: 'Failed to add purchase link' }, { status: 500 })
    }

    const newLink = {
      id: 'default',
      url,
      retailer,
      price: price ? parseFloat(price) : null,
      currency,
      added_by: userData.id,
      verified: false,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ 
      message: 'Purchase link added successfully',
      purchaseLink: newLink
    })

  } catch (error) {
    console.error('Error adding purchase link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to extract retailer name from URL
function extractRetailerName(url: string): string {
  try {
    const domain = new URL(url).hostname.toLowerCase()
    
    if (domain.includes('amazon')) return 'Amazon'
    if (domain.includes('target')) return 'Target'
    if (domain.includes('walmart')) return 'Walmart'
    if (domain.includes('barnes')) return 'Barnes & Noble'
    if (domain.includes('puzzle')) return 'Puzzle Warehouse'
    if (domain.includes('masterpieces')) return 'MasterPieces'
    if (domain.includes('ravensburger')) return 'Ravensburger'
    
    // Extract main domain name as fallback
    const parts = domain.split('.')
    return parts[parts.length - 2]?.charAt(0).toUpperCase() + parts[parts.length - 2]?.slice(1) || 'Unknown'
  } catch {
    return 'Unknown'
  }
} 