import { PuzzleGrid } from '@/components/puzzle/puzzle-grid'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Search, Upload, Sparkles, TrendingUp, Users, Clock, Star } from 'lucide-react'
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

    return puzzles || []
  } catch (error) {
    console.error('Unexpected error:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredPuzzles = await getFeaturedPuzzles()

  return (
    <main className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-violet-50 via-white to-emerald-50 py-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/20 via-transparent to-emerald-100/20"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-violet-200/50 rounded-full px-6 py-2 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Puzzle Discovery & Logging
            </span>
          </div>

          {/* Main Hero Content */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800 bg-clip-text text-transparent leading-tight">
            Discover, Log & Share Your Puzzle Journey
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of puzzle enthusiasts discovering their next favorite puzzle, tracking their progress, and sharing their passion
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/discover" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find Your Next Puzzle
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/log" className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Log Your Puzzle
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: TrendingUp, label: "Puzzles Tracked", value: "12,000+", gradient: "from-violet-500 to-purple-600" },
              { icon: Users, label: "Active Puzzlers", value: "5,000+", gradient: "from-emerald-500 to-teal-600" },
              { icon: Star, label: "Reviews Shared", value: "25,000+", gradient: "from-amber-500 to-orange-600" }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Puzzles Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Featured Puzzles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most loved puzzles from our community
            </p>
          </div>
          
          <PuzzleGrid puzzles={featuredPuzzles} />
        </div>
      </section>

      {/* Brand Browsing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-violet-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
              Browse by Brand
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore puzzles from your favorite manufacturers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-200">
                  {String.fromCharCode(65 + i)}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                  Brand {i + 1}
                </h3>
                <p className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 500) + 50} puzzles
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Curated Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked puzzle collections for every mood and skill level
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Beginner Friendly", description: "Perfect puzzles to start your journey", count: "150+ puzzles", gradient: "from-green-500 to-emerald-600" },
              { title: "Expert Challenge", description: "For seasoned puzzle masters", count: "75+ puzzles", gradient: "from-red-500 to-pink-600" },
              { title: "Nature & Landscapes", description: "Beautiful scenes from around the world", count: "200+ puzzles", gradient: "from-blue-500 to-cyan-600" },
              { title: "Art & Culture", description: "Famous paintings and cultural icons", count: "120+ puzzles", gradient: "from-purple-500 to-violet-600" },
              { title: "Animals & Wildlife", description: "Adorable and majestic creatures", count: "180+ puzzles", gradient: "from-amber-500 to-orange-600" },
              { title: "Fantasy & Sci-Fi", description: "Imagination knows no bounds", count: "90+ puzzles", gradient: "from-indigo-500 to-purple-600" }
            ].map((collection) => (
              <div key={collection.title} className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className={`w-12 h-12 bg-gradient-to-r ${collection.gradient} rounded-lg mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {collection.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {collection.description}
                </p>
                <p className={`text-sm font-semibold bg-gradient-to-r ${collection.gradient} bg-clip-text text-transparent`}>
                  {collection.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
