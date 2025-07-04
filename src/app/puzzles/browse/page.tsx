'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Plus, BookOpen, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Puzzle {
  id: string
  title: string
  brand: string
  piece_count: number
  main_image_url?: string
  description?: string
  difficulty_level?: string
  average_rating?: number
  total_ratings?: number
  created_at: string
}

export default function PuzzleBrowsePage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPuzzles()
  }, [])

  const fetchPuzzles = async () => {
    try {
      const response = await fetch('/api/puzzles')
      if (response.ok) {
        const data = await response.json()
        setPuzzles(data.puzzles || [])
      }
    } catch (error) {
      console.error('Error fetching puzzles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickRating = (puzzleId: string, rating: number) => {
    console.log(`Quick rating: Puzzle ${puzzleId} rated ${rating} stars`)
    // TODO: Implement quick rating API call
  }

  const handleAddToList = (puzzleId: string, listType: 'want-to-solve' | 'wishlist') => {
    console.log(`Add to list: Puzzle ${puzzleId} added to ${listType}`)
    // TODO: Implement add to list functionality
  }

  const handleFullLogging = (puzzleId: string) => {
    console.log(`Full logging: Redirect to log puzzle ${puzzleId}`)
    // TODO: Route to detailed logging flow
  }

  const filteredPuzzles = puzzles.filter(puzzle =>
    puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.brand.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading puzzles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Puzzles</h1>
              <p className="text-slate-600">Discover your next puzzle adventure</p>
            </div>
            <Link href="/puzzles/add">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Puzzle
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search puzzles by name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Puzzles Grid */}
        {filteredPuzzles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No puzzles found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or add a new puzzle to get started.</p>
            <Link href="/puzzles/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add First Puzzle
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPuzzles.map((puzzle) => (
              <PuzzleCard
                key={puzzle.id}
                puzzle={puzzle}
                onQuickRating={handleQuickRating}
                onAddToList={handleAddToList}
                onFullLogging={handleFullLogging}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface PuzzleCardProps {
  puzzle: Puzzle
  onQuickRating: (puzzleId: string, rating: number) => void
  onAddToList: (puzzleId: string, listType: 'want-to-solve' | 'wishlist') => void
  onFullLogging: (puzzleId: string) => void
}

function PuzzleCard({ puzzle, onQuickRating, onAddToList, onFullLogging }: PuzzleCardProps) {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [userRating, setUserRating] = useState(0)

  const handleStarClick = (rating: number) => {
    setUserRating(rating)
    onQuickRating(puzzle.id, rating)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardHeader className="p-4">
        {/* Puzzle Image */}
        <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden">
          {puzzle.main_image_url ? (
            <Image
              src={puzzle.main_image_url}
              alt={puzzle.title}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-slate-400 text-center">
                <Search className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No image</p>
              </div>
            </div>
          )}
        </div>

        {/* Puzzle Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">
              {puzzle.title}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {puzzle.brand}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {puzzle.piece_count} pieces
            </Badge>
          </div>

          {/* Quick Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-0.5 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= (hoveredStar || userRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            {puzzle.total_ratings && (
              <span className="text-xs text-slate-500 ml-1">
                ({puzzle.total_ratings})
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {/* Progressive Engagement Actions */}
        <div className="space-y-2">
          {/* Add to List - Medium Commitment */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddToList(puzzle.id, 'want-to-solve')}
            className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Want to Solve
          </Button>

          {/* Full Logging - High Commitment */}
          <Button
            size="sm"
            onClick={() => onFullLogging(puzzle.id)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Log Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 