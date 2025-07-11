import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return static themes for now since we don't have the collection_themes table yet
    const themes = [
      {
        id: '1',
        name: 'art',
        display_name: 'Art & Paintings',
        description: 'Classic and modern artwork reproductions',
        icon_name: 'Palette',
        color_class: 'text-purple-600',
        collection_count: 2 // Van Gogh Masterpieces + other art collections
      },
      {
        id: '2',
        name: 'nature',
        display_name: 'Nature & Landscapes',
        description: 'Beautiful natural scenes and landscapes',
        icon_name: 'Mountain',
        color_class: 'text-green-600',
        collection_count: 1 // National Parks Collection
      },
      {
        id: '3',
        name: 'animals',
        display_name: 'Animals & Wildlife',
        description: 'Cute and wild animals from around the world',
        icon_name: 'Cat',
        color_class: 'text-orange-600',
        collection_count: 1 // Wildlife Safari
      },
      {
        id: '4',
        name: 'fantasy',
        display_name: 'Fantasy & Sci-Fi',
        description: 'Magical and futuristic themed puzzles',
        icon_name: 'Sparkles',
        color_class: 'text-violet-600',
        collection_count: 1 // Fantasy Realms
      },
      {
        id: '5',
        name: 'vintage',
        display_name: 'Vintage & Retro',
        description: 'Classic puzzles from bygone eras',
        icon_name: 'Clock',
        color_class: 'text-amber-600',
        collection_count: 2 // Ravensburger Classics + White Mountain
      },
      {
        id: '6',
        name: 'travel',
        display_name: 'Travel & Places',
        description: 'Famous destinations and travel spots',
        icon_name: 'MapPin',
        color_class: 'text-red-600',
        collection_count: 0
      },
      {
        id: '7',
        name: 'food',
        display_name: 'Food & Cuisine',
        description: 'Delicious food and culinary themes',
        icon_name: 'Coffee',
        color_class: 'text-yellow-600',
        collection_count: 0
      },
      {
        id: '8',
        name: 'seasonal',
        display_name: 'Seasonal & Holidays',
        description: 'Holiday and seasonal themed puzzles',
        icon_name: 'Snowflake',
        color_class: 'text-cyan-600',
        collection_count: 0
      }
    ]

    return NextResponse.json({
      success: true,
      themes
    })

  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}