'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star, Heart, BookmarkPlus, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface PuzzleOfTheDay {
  id: string
  title: string
  brand: string
  pieces: number
  difficulty: string
  image: string
  description: string | null
  avgTime: string
  rating: number
  completions: number
  tags: string[]
  inStock: boolean
}

export function PuzzleOfTheDay() {
  const [puzzleOfTheDay, setPuzzleOfTheDay] = useState<PuzzleOfTheDay | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPuzzleOfTheDay = async () => {
      try {
        const response = await fetch('/api/puzzle-of-the-day', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.message || 'API returned error')
        }
        
        setPuzzleOfTheDay(data)
        setIsLoading(false)
        
      } catch (err) {
        console.error('Error fetching puzzle of the day:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsLoading(false)
      }
    }

    fetchPuzzleOfTheDay()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-emerald-50/40 rounded-3xl p-6 lg:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1.5 rounded-full font-medium text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            Puzzle of the Day
          </div>
          <h2 className="text-xl lg:text-2xl font-medium mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Loading Today's Featured Puzzle...
          </h2>
        </div>
        <div className="glass-card border-white/40 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative aspect-[4/3] lg:aspect-[3/2] bg-slate-200 animate-pulse" />
            <div className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-emerald-50/40 rounded-3xl p-6 lg:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1.5 rounded-full font-medium text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            Puzzle of the Day
          </div>
          <h2 className="text-xl lg:text-2xl font-medium mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Today's Featured Puzzle
          </h2>
        </div>
        <div className="glass-card border-white/40 rounded-2xl overflow-hidden p-6 text-center">
          <p className="text-slate-600 mb-4">Unable to load today's featured puzzle</p>
          <p className="text-xs text-slate-500 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="border-violet-200 text-violet-700 hover:bg-violet-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!puzzleOfTheDay) {
    return (
      <div className="bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-emerald-50/40 rounded-3xl p-6 lg:p-8">
        <div className="text-center">
          <p className="text-slate-600">No puzzle data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-emerald-50/40 rounded-3xl p-6 lg:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1.5 rounded-full font-medium text-sm mb-3">
          <Sparkles className="w-4 h-4" />
          Puzzle of the Day
        </div>
        <h2 className="text-xl lg:text-2xl font-medium mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Today's Featured Puzzle
        </h2>
      </div>

      <div className="glass-card border-white/40 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-[4/3] lg:aspect-[3/2]">
            <Image
              src={puzzleOfTheDay.image}
              alt={puzzleOfTheDay.title}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay Badge with orange accent color */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 text-xs">
                Daily Pick
              </Badge>
            </div>
            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white">
                <Heart className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white">
                <BookmarkPlus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg lg:text-xl font-medium text-slate-800 mb-2">
                {puzzleOfTheDay.title}
              </h3>
              <div className="flex items-center gap-3 text-slate-600 mb-3 text-sm">
                <span className="font-medium">{puzzleOfTheDay.brand}</span>
                <span>•</span>
                <span>{puzzleOfTheDay.pieces} pieces</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs font-medium">
                  {puzzleOfTheDay.difficulty}
                </Badge>
              </div>
              {puzzleOfTheDay.description && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {puzzleOfTheDay.description}
                </p>
              )}
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50/50 rounded-lg p-3 text-center">
                <Clock className="w-4 h-4 text-violet-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800">{puzzleOfTheDay.avgTime}</div>
              </div>
              <div className="bg-slate-50/50 rounded-lg p-3 text-center">
                <Star className="w-4 h-4 text-violet-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800">
                  {puzzleOfTheDay.rating > 0 ? `${puzzleOfTheDay.rating.toFixed(1)}/5` : 'No rating'}
                </div>
              </div>
              <div className="bg-slate-50/50 rounded-lg p-3 text-center">
                <Users className="w-4 h-4 text-violet-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-800">{puzzleOfTheDay.completions.toLocaleString()}</div>
              </div>
            </div>

            {/* Tags */}
            {puzzleOfTheDay.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {puzzleOfTheDay.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-violet-100 text-violet-800 hover:bg-violet-200 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 h-9"
                asChild
              >
                <Link href={`/puzzles/${puzzleOfTheDay.id}`}>
                  View Details
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-violet-200 text-violet-700 hover:bg-violet-50 h-9"
              >
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
