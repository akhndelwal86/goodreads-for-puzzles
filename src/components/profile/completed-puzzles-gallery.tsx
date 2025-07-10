'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, RefreshCw, Star, Clock, Puzzle, Trophy, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface CompletedPuzzle {
  id: string
  puzzle: {
    id: string
    title: string
    image: string
    pieceCount: number
    theme: string
    difficulty: string
    brand: {
      id: string
      name: string
    }
  }
  completion: {
    completedAt: string
    solveTimeHours: number | null
    userRating: number | null
    difficultyRating: number | null
    notes: string | null
    progressPhotos: string[]
  }
  stats: {
    solveTime: string | null
    rating: number
    difficulty: string
  }
}

interface CompletedPuzzlesResponse {
  puzzles: CompletedPuzzle[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  summary: {
    totalCompleted: number
    avgSolveTimeHours: number
    avgRating: number
    totalPieces: number
  }
}

interface CompletedPuzzlesGalleryProps {
  userId: string
  initialLimit?: number
}

export default function CompletedPuzzlesGallery({ userId, initialLimit = 12 }: CompletedPuzzlesGalleryProps) {
  const [data, setData] = useState<CompletedPuzzlesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPuzzles = async (offset = 0, isRefresh = false, isLoadMore = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else if (isLoadMore) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }
    setError(null)
    
    try {
      const response = await fetch(`/api/users/${userId}/completed-puzzles?limit=${initialLimit}&offset=${offset}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found')
        } else {
          setError('Failed to load completed puzzles')
        }
        return
      }

      const newData: CompletedPuzzlesResponse = await response.json()
      
      if (isLoadMore && data) {
        // Append new puzzles to existing ones
        setData({
          ...newData,
          puzzles: [...data.puzzles, ...newData.puzzles]
        })
      } else {
        setData(newData)
      }
      
    } catch (err) {
      console.error('Error fetching completed puzzles:', err)
      setError('Failed to load completed puzzles')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchPuzzles()
    }
  }, [userId])

  const handleRefresh = () => {
    fetchPuzzles(0, true)
  }

  const handleLoadMore = () => {
    if (data?.pagination.hasMore) {
      fetchPuzzles(data.puzzles.length, false, true)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'hard': return 'bg-rose-100 text-rose-700 border-rose-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  if (error) {
    return (
      <Card className="glass-card border-white/40">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-slate-600 text-center mb-4">{error}</p>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="border-violet-200 text-violet-600 hover:bg-violet-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="glass-card border-white/40">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            <p className="text-slate-600">Loading completed puzzles...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.puzzles.length === 0) {
    return (
      <Card className="glass-card border-white/40">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4 opacity-50">🏆</div>
          <h3 className="text-base font-medium text-slate-900 mb-2">No Completed Puzzles</h3>
          <p className="text-slate-600 text-center max-w-md">
            This user hasn't completed any puzzles yet. Once they finish their first puzzle, it will appear here!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/40 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-xl font-semibold text-slate-900">{data.summary.totalCompleted}</span>
            </div>
            <p className="text-sm text-slate-600">Completed</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/40 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Puzzle className="w-5 h-5 text-violet-500" />
              <span className="text-xl font-semibold text-slate-900">{data.summary.totalPieces.toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-600">Total Pieces</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/40 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span className="text-xl font-semibold text-slate-900">
                {data.summary.avgSolveTimeHours > 0 ? `${data.summary.avgSolveTimeHours}h` : '-'}
              </span>
            </div>
            <p className="text-sm text-slate-600">Avg Time</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/40 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-xl font-semibold text-slate-900">
                {data.summary.avgRating > 0 ? data.summary.avgRating.toFixed(1) : '-'}
              </span>
            </div>
            <p className="text-sm text-slate-600">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium text-slate-900">Completed Puzzles</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Puzzles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.puzzles.map((item, index) => (
          <Card 
            key={item.id} 
            className="glass-card border-white/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-0">
              {/* Puzzle Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={item.puzzle.image} 
                  alt={item.puzzle.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={`${getDifficultyColor(item.puzzle.difficulty)} border`}>
                    {item.puzzle.difficulty}
                  </Badge>
                </div>
                {item.completion.userRating && (
                  <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-white text-sm">{item.completion.userRating}</span>
                  </div>
                )}
              </div>

              {/* Puzzle Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-slate-900 line-clamp-1 group-hover:text-violet-600 transition-colors">
                    {item.puzzle.title}
                  </h4>
                  <p className="text-sm text-slate-600">
                    {item.puzzle.brand.name} • {item.puzzle.pieceCount} pieces
                  </p>
                </div>

                {/* Completion Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span>{item.stats.solveTime || 'No time'}</span>
                  </div>
                  <span className="text-slate-500">
                    {formatDate(item.completion.completedAt)}
                  </span>
                </div>

                {/* Notes Preview */}
                {item.completion.notes && (
                  <p className="text-sm text-slate-600 line-clamp-2 italic">
                    "{item.completion.notes}"
                  </p>
                )}

                {/* Progress Photos Count */}
                {item.completion.progressPhotos.length > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-violet-600">
                    <div className="w-3 h-3 bg-violet-100 rounded-full" />
                    <span>{item.completion.progressPhotos.length} photos</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {data.pagination.hasMore && (
        <div className="text-center pt-6">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="border-violet-200 text-violet-600 hover:bg-violet-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Load More Puzzles
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}