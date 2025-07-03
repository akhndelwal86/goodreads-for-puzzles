import { PuzzleGrid } from '@/components/puzzle/puzzle-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Search, Upload, Sparkles } from 'lucide-react'
import Link from 'next/link'

async function getFeaturedPuzzles() {
  try {
    const { data: puzzles, error } = await supabase
      .from('puzzles')
      .select(`
        *,
        brand:brands(*),
        tags:puzzle_tags(tag:tags(*))
      `)
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching puzzles:', error)
      return []
    }

    // Transform the tags structure
    return puzzles?.map(puzzle => ({
      ...puzzle,
      tags: puzzle.tags?.map((pt: any) => pt.tag).filter(Boolean) || []
    })) || []
  } catch (error) {
    console.error('Database error:', error)
    return []
  }
}

async function getBrands() {
  try {
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .order('name')
      .limit(5)

    if (error) throw error
    return brands || []
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export default async function HomePage() {
  const [featuredPuzzles, brands] = await Promise.all([
    getFeaturedPuzzles(),
    getBrands()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧩</span>
              <h1 className="text-2xl font-bold text-gray-900">PuzzleTracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            What puzzle are you looking for today?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Discover, track, and share your jigsaw puzzle journey with fellow enthusiasts
          </p>
          
          {/* AI Chat Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Describe your perfect puzzle... (e.g., 'mid-sized architecture puzzle, not too hard')"
              />
            </div>
          </div>
          
          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button size="lg" className="flex-1 text-lg py-6">
              <Search className="h-5 w-5 mr-2" />
              Find Your Next Puzzle
            </Button>
            <Button size="lg" variant="outline" className="flex-1 text-lg py-6">
              <Upload className="h-5 w-5 mr-2" />
              Log Your Puzzle
            </Button>
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Brand</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm">{brand.name}</h4>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Puzzles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Featured Puzzles</h3>
          <Button variant="outline">View All</Button>
        </div>
        
        {featuredPuzzles.length > 0 ? (
          <PuzzleGrid puzzles={featuredPuzzles} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <span className="text-4xl mb-4 block">🧩</span>
              <h4 className="text-lg font-semibold mb-2">No puzzles found</h4>
              <p className="text-gray-600">Check back soon for featured puzzles!</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Smart Lists Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Discover Collections</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔥</span>
                Most Popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Puzzles loved by the community
              </p>
              <Button variant="outline" size="sm">Browse Collection</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⭐</span>
                Editor's Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Hand-selected quality puzzles
              </p>
              <Button variant="outline" size="sm">Browse Collection</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>✨</span>
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                What puzzlers are solving today
              </p>
              <Button variant="outline" size="sm">Browse Collection</Button>
            </CardContent>
          </Card>
        </div>
      </section>
s
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🧩</span>
            <h3 className="text-xl font-bold">PuzzleTracker</h3>
          </div>
          <p className="text-gray-400">
            The social platform for jigsaw puzzle enthusiasts
          </p>
        </div>
      </footer>
    </div>
  )
}