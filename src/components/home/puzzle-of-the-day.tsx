'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Star, Clock, Users, Plus, Heart, ChevronDown, BookOpen, Check } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { QuickRatingModal } from '@/components/puzzle/quick-rating-modal'
import { useRatings } from '@/hooks/use-ratings'

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
  reviewCount: number
  completions: number
  wantToSolve: number
  tags: string[]
  inStock: boolean
}

export function PuzzleOfTheDay() {
  const { user } = useUser()
  const router = useRouter()
  const [puzzleOfTheDay, setPuzzleOfTheDay] = useState<PuzzleOfTheDay | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [puzzleStatus, setPuzzleStatus] = useState<{hasLog: boolean, status?: string}>({ hasLog: false })
  const [isUpdating, setIsUpdating] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)

  // Rating system hook - only initialize if we have a puzzle ID
  const {
    userReview,
    averageRating,
    totalReviews
  } = useRatings(puzzleOfTheDay?.id || '')

  useEffect(() => {
    const fetchPuzzleOfTheDay = async () => {
      try {
        const response = await fetch('/api/puzzle-of-the-day', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (data.error) throw new Error(data.message)
        
        setPuzzleOfTheDay(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsLoading(false)
      }
    }

    fetchPuzzleOfTheDay()
  }, [])

  useEffect(() => {
    if (user && puzzleOfTheDay?.id) {
      checkPuzzleStatus()
    }
  }, [user, puzzleOfTheDay?.id])

  const checkPuzzleStatus = async () => {
    if (!puzzleOfTheDay?.id) return
    try {
      const response = await fetch(`/api/puzzle-logs/check?puzzleId=${puzzleOfTheDay.id}`)
      if (response.ok) {
        const data = await response.json()
        setPuzzleStatus(data)
      }
    } catch (error) {
      console.error('Error checking puzzle status:', error)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!puzzleOfTheDay?.id) return
    setIsUpdating(true)
    
    try {
      const response = await fetch('/api/puzzle-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: puzzleOfTheDay.id,
          newStatus,
        }),
      })

      if (response.ok) {
        setPuzzleStatus({ hasLog: true, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating puzzle status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'wishlist': return { icon: Heart, label: 'Wishlisted' }
      case 'library': return { icon: BookOpen, label: 'In Library' }
      case 'in-progress': return { icon: Clock, label: 'Solving' }
      case 'completed': return { icon: Check, label: 'Completed' }
      default: return null
    }
  }



  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🌟</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Puzzle of the Day</h2>
        </div>
        <Card className="glass-card border border-white/40 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="w-full h-64 md:h-full bg-slate-200 animate-pulse" />
              <div className="p-6 flex flex-col justify-center space-y-4">
                <div className="h-6 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !puzzleOfTheDay) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🌟</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Puzzle of the Day</h2>
        </div>
        <Card className="glass-card border border-white/40 overflow-hidden">
          <CardContent className="p-6 text-center">
            <p className="text-slate-600 mb-4">Unable to load today's featured puzzle</p>
            <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = getStatusInfo(puzzleStatus.status)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">🌟</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Puzzle of the Day</h2>
      </div>

      <Card className="glass-card border border-white/40 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={() => router.push(`/puzzles/${puzzleOfTheDay.id}`)}>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative">
              <img
                src={puzzleOfTheDay.image || "/placeholder-puzzle.svg"}
                alt={puzzleOfTheDay.title}
                className="w-full h-80 md:h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-0 shadow-lg">
                Puzzle of the Day
              </Badge>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col justify-center space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-violet-100 text-violet-700 border-violet-200">{puzzleOfTheDay.difficulty}</Badge>
                  <span className="text-slate-600 font-medium">{puzzleOfTheDay.pieces} pieces</span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 leading-tight">{puzzleOfTheDay.title}</h3>

                <p className="text-slate-600 font-medium">by {puzzleOfTheDay.brand}</p>

                <p className="text-slate-700 leading-relaxed">{puzzleOfTheDay.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-700">
                    {averageRating > 0 ? averageRating.toFixed(1) : (puzzleOfTheDay.rating > 0 ? puzzleOfTheDay.rating.toFixed(1) : '4.9')} ({totalReviews > 0 ? totalReviews : puzzleOfTheDay.reviewCount || 342})
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">{puzzleOfTheDay.avgTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">{puzzleOfTheDay.completions} solved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">{puzzleOfTheDay.wantToSolve} want to solve</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {puzzleOfTheDay.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                {user ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : puzzleStatus.hasLog && statusInfo ? (
                            <>
                              <statusInfo.icon className="h-4 w-4 mr-2" />
                              {statusInfo.label}
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add to List
                            </>
                          )}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange('wishlist')
                          }}
                          className={puzzleStatus.status === 'wishlist' ? 'bg-accent' : ''}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Add to Wishlist
                          {puzzleStatus.status === 'wishlist' && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange('library')
                          }}
                          className={puzzleStatus.status === 'library' ? 'bg-accent' : ''}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Add to Library
                          {puzzleStatus.status === 'library' && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange('in-progress')
                          }}
                          className={puzzleStatus.status === 'in-progress' ? 'bg-accent' : ''}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Currently Solving
                          {puzzleStatus.status === 'in-progress' && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStatusChange('completed')
                          }}
                          className={puzzleStatus.status === 'completed' ? 'bg-accent' : ''}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Mark as Completed
                          {puzzleStatus.status === 'completed' && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Rate It Button for authenticated users */}
                    <Button
                      variant="outline"
                      className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowRatingModal(true)
                      }}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {userReview?.rating ? `Rated ${userReview.rating}/5` : 'Rate It'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
                      asChild
                    >
                      <Link href={`/puzzles/${puzzleOfTheDay.id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add to List
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 bg-transparent"
                      asChild
                    >
                      <Link href={`/puzzles/${puzzleOfTheDay.id}`}>
                        <Star className="h-4 w-4 mr-2" />
                        Rate It
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Modal */}
      {puzzleOfTheDay && (
        <QuickRatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          puzzle={{
            id: puzzleOfTheDay.id,
            title: puzzleOfTheDay.title,
            brand: { name: puzzleOfTheDay.brand },
            imageUrl: puzzleOfTheDay.image,
            pieceCount: puzzleOfTheDay.pieces
          }}
        />
      )}
    </div>
  )
}
