import { Button } from '@/components/ui/button'
import { Search, Upload, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-violet-50 via-white to-emerald-50 pt-20 pb-8 px-4 overflow-hidden">
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
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800 bg-clip-text text-transparent leading-tight">
          Discover, Log & Share Your Puzzle Journey
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
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
            <Link href="/puzzles/add" className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Log Your Puzzle
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 