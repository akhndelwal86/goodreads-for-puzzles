'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { 
  Star, 
  ChevronDown, 
  Plus, 
  BookOpen, 
  Clock, 
  Check, 
  Eye,
  Heart,
  Users,
  ShoppingCart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Puzzle {
  id: string
  title: string
  brand?: {
    id: string
    name: string
  }
  imageUrl?: string
  pieceCount: number
  theme?: string
  material?: string
  description?: string
  year?: number
  createdAt: string
  updatedAt: string
  avgRating?: number
  reviewCount?: number
}

interface BrowsePuzzleCardProps {
  puzzle: Puzzle
  viewMode?: 'grid' | 'list'
}

interface PuzzleStatus {
  hasLog: boolean
  status?: string
}

export function BrowsePuzzleCard({ puzzle, viewMode = 'grid' }: BrowsePuzzleCardProps) {
  const { user } = useUser()
  const [puzzleStatus, setPuzzleStatus] = useState<PuzzleStatus>({ hasLog: false })
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completionTime, setCompletionTime] = useState('')

  useEffect(() => {
    if (user) {
      checkPuzzleStatus()
    }
  }, [user, puzzle.id])

  const checkPuzzleStatus = async () => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/puzzle-logs/check?puzzleId=${puzzle.id}`)
      if (response.ok) {
        const data = await response.json()
        setPuzzleStatus({
          hasLog: data.hasLog,
          status: data.status
        })
      }
    } catch (error) {
      console.error('Error checking puzzle status:', error)
      setPuzzleStatus({ hasLog: false })
    }
  }

  const parseTimeInput = (timeStr: string): number => {
    if (!timeStr.trim()) return 0
    
    const cleanStr = timeStr.toLowerCase().replace(/\s+/g, ' ').trim()
    let totalSeconds = 0
    
    const hourMatch = cleanStr.match(/(\d*\.?\d+)\s*h/)
    const minuteMatch = cleanStr.match(/(\d+)\s*m/)
    
    if (hourMatch) {
      totalSeconds += parseFloat(hourMatch[1]) * 3600
    }
    
    if (minuteMatch) {
      totalSeconds += parseInt(minuteMatch[1]) * 60
    }
    
    if (!hourMatch && !minuteMatch) {
      const minutesOnly = parseFloat(cleanStr)
      if (!isNaN(minutesOnly)) {
        totalSeconds = minutesOnly * 60
      }
    }
    
    return Math.round(totalSeconds)
  }

  const handleCompleteConfirm = async () => {
    setIsUpdating(true)
    const timeInSeconds = parseTimeInput(completionTime)
    
    try {
      const response = await fetch('/api/puzzle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puzzleId: puzzle.id,
          newStatus: 'completed',
          completionTime: timeInSeconds > 0 ? timeInSeconds : undefined,
        }),
      })

      if (response.ok) {
        setPuzzleStatus({
          hasLog: true,
          status: 'completed'
        })
        setShowCompletionModal(false)
        setCompletionTime('')
      } else {
        console.error('Failed to mark puzzle as completed')
      }
    } catch (error) {
      console.error('Error marking puzzle as completed:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'completed') {
      setShowCompletionModal(true)
      return
    }

    setIsUpdating(true)
    
    try {
      const response = await fetch('/api/puzzle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puzzleId: puzzle.id,
          newStatus,
        }),
      })

      if (response.ok) {
        setPuzzleStatus({
          hasLog: true,
          status: newStatus
        })
      } else {
        console.error('Failed to update puzzle status')
      }
    } catch (error) {
      console.error('Error updating puzzle status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getDifficultyInfo = (pieceCount: number) => {
    if (pieceCount <= 300) return { level: 'Beginner', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
    if (pieceCount <= 500) return { level: 'Easy', color: 'bg-green-100 text-green-800 border-green-200' }
    if (pieceCount <= 1000) return { level: 'Medium', color: 'bg-amber-100 text-amber-800 border-amber-200' }
    if (pieceCount <= 2000) return { level: 'Hard', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    return { level: 'Expert', color: 'bg-red-100 text-red-800 border-red-200' }
  }

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'wishlist':
        return { icon: Heart, label: 'Wishlisted', color: 'text-pink-600' }
      case 'library':
        return { icon: BookOpen, label: 'In Library', color: 'text-blue-600' }
      case 'in-progress':
        return { icon: Clock, label: 'Solving', color: 'text-amber-600' }
      case 'completed':
        return { icon: Check, label: 'Completed', color: 'text-emerald-600' }
      default:
        return null
    }
  }

  const difficulty = getDifficultyInfo(puzzle.pieceCount)
  const statusInfo = getStatusInfo(puzzleStatus.status)

  // List view - Cleaner horizontal design
  if (viewMode === 'list') {
    return (
      <>
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
          <div className="flex">
            {/* Image Container */}
            <div className="relative w-48 h-36 flex-shrink-0 overflow-hidden bg-gray-50">
              {puzzle.imageUrl ? (
                <Image
                  src={puzzle.imageUrl}
                  alt={puzzle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="192px"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-4">
                    {/* Puzzle Title */}
                    <h3 className="font-medium text-gray-800 text-base line-clamp-2 mb-1">
                      {puzzle.title}
                    </h3>

                    {/* Brand Name */}
                    <p className="text-gray-500 text-sm mb-2">
                      {puzzle.brand?.name || 'Unknown Brand'}
                    </p>

                    {/* Piece Count and Rating Stats */}
                    <div className="flex items-center gap-6 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">
                          {puzzle.pieceCount.toLocaleString()}
                        </span>
                        <span className="text-gray-500">pieces</span>
                      </div>
                      {puzzle.avgRating && puzzle.reviewCount && puzzle.reviewCount > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="font-medium text-gray-700">
                            {puzzle.avgRating.toFixed(1)}
                          </span>
                          <span className="text-gray-500">
                            ({puzzle.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Star className="w-4 h-4" />
                          <span>No reviews</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={`${difficulty.color} border text-xs`}>
                    {difficulty.level}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    {/* Add to List Button - Always Outline Style */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline"
                          className="flex-1 h-9 text-xs font-medium border border-violet-200 text-violet-700 bg-white/80 backdrop-blur-sm hover:bg-violet-50 hover:border-violet-300 transition-all duration-300"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <>
                              <Clock className="w-3 h-3 mr-1.5 animate-spin" />
                              Updating...
                            </>
                          ) : puzzleStatus.hasLog && statusInfo ? (
                            <>
                              <statusInfo.icon className="w-3 h-3 mr-1.5" />
                              {statusInfo.label}
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 mr-1.5" />
                              Add to List
                            </>
                          )}
                          <ChevronDown className="w-3 h-3 ml-1.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48 glass-card border-white/40">
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange('wishlist')}
                          className={puzzleStatus.status === 'wishlist' ? 'bg-accent' : ''}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Add to Wishlist
                          {puzzleStatus.status === 'wishlist' && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange('library')}
                          className={puzzleStatus.status === 'library' ? 'bg-accent' : ''}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Add to Library
                          {puzzleStatus.status === 'library' && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange('in-progress')}
                          className={puzzleStatus.status === 'in-progress' ? 'bg-accent' : ''}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Currently Solving
                          {puzzleStatus.status === 'in-progress' && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange('completed')}
                          className={puzzleStatus.status === 'completed' ? 'bg-accent' : ''}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Mark as Completed
                          {puzzleStatus.status === 'completed' && <Check className="w-4 h-4 ml-auto" />}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/puzzles/${puzzle.id}`} className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Rate It Button - Solid Style */}
                    <Button 
                      asChild
                      className="flex-1 h-9 text-xs font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-glass hover:shadow-glass-lg hover:scale-105 transition-all duration-300 border-0"
                    >
                      <Link href={`/puzzles/${puzzle.id}`}>
                        <Star className="w-3 h-3 mr-1.5" />
                        Rate It
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" className="w-full h-9 text-xs font-medium border border-violet-200 text-violet-700 bg-white/80 backdrop-blur-sm hover:bg-violet-50 hover:border-violet-300">
                    <Link href={`/puzzles/${puzzle.id}`}>
                      <Eye className="w-3 h-3 mr-1.5" />
                      View Details
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completion Modal */}
        <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Puzzle Complete</DialogTitle>
              <DialogDescription>
                How long did it take to complete this puzzle?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="completion-time" className="text-sm font-medium">
                  Completion Time
                </label>
                <Input
                  id="completion-time"
                  type="text"
                  value={completionTime}
                  onChange={(e) => setCompletionTime(e.target.value)}
                  placeholder="e.g., 2h 30m, 90m, or 1.5h"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Enter time in any format (e.g., "2h 30m", "90m", "1.5h"). Leave blank if unknown.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCompletionModal(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCompleteConfirm}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Mark Complete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // ✨ GLASS MORPHISM GRID VIEW - Premium transformation
  return (
    <>
      <div className="group glass-puzzle-card hover-lift">
        {/* Enhanced Image Container with Glass Overlay */}
        <div className="relative aspect-square overflow-hidden">
          {puzzle.imageUrl ? (
            <>
              <Image
                src={puzzle.imageUrl}
                alt={puzzle.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Glass overlay for depth */}
              <div className="glass-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-glass">
                <ShoppingCart className="w-8 h-8 text-slate-400" />
              </div>
            </div>
          )}
          
          {/* Premium Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <div className={`glass-badge ${difficulty.color} backdrop-blur-lg border-white/40 shadow-glass`}>
              {difficulty.level}
            </div>
          </div>

          {/* Enhanced Rating Badge */}
          {puzzle.avgRating && puzzle.reviewCount && puzzle.reviewCount > 0 && (
            <div className="absolute top-3 left-3">
              <div className="bg-amber-500/90 backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-glass border border-amber-400/20">
                <Star className="w-3.5 h-3.5 text-white fill-current" />
                <span className="text-xs font-bold text-white">
                  {puzzle.avgRating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* Status Indicator */}
          {puzzleStatus.hasLog && statusInfo && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-white/90 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1 shadow-glass border border-white/40">
                <statusInfo.icon className={`w-3 h-3 ${statusInfo.color}`} />
                <span className="text-xs font-medium text-slate-700">
                  {statusInfo.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Premium Content Section */}
        <div className="p-4 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-sm">
          {/* Title with gradient accent */}
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-2 leading-tight group-hover:text-violet-700 transition-colors duration-300">
            {puzzle.title}
          </h3>

          {/* Enhanced Brand and Piece Count Row */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-500 text-xs font-medium">
              {puzzle.brand?.name || 'Unknown Brand'}
            </p>
            <div className="flex items-baseline gap-1 bg-violet-50 px-2 py-1 rounded-lg">
              <span className="text-sm font-bold text-violet-700">
                {puzzle.pieceCount?.toLocaleString() || 0}
              </span>
              <span className="text-xs text-violet-500 font-medium">pc</span>
            </div>
          </div>

          {/* Theme and Rating Row with Premium Styling */}
          <div className="flex items-center justify-between mb-4">
            {puzzle.theme ? (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs py-1 px-2 h-auto font-medium">
                {puzzle.theme}
              </Badge>
            ) : (
              <div></div>
            )}
            
            {puzzle.avgRating && puzzle.reviewCount && puzzle.reviewCount > 0 ? (
              <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span className="text-xs font-bold text-amber-700">
                  {puzzle.avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-amber-600">
                  ({puzzle.reviewCount})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                <Star className="w-3 h-3" />
                <span>No reviews</span>
              </div>
            )}
          </div>

          {/* Enhanced Two-Button Layout */}
          <div className="flex gap-2 w-full">
            {user ? (
              <>
                {/* Add to List Button - Always Outline Style */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      className="flex-1 h-9 text-xs font-medium border border-violet-200 text-violet-700 bg-white/80 backdrop-blur-sm hover:bg-violet-50 hover:border-violet-300 transition-all duration-300"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <Clock className="w-3 h-3 mr-1.5 animate-spin" />
                          Updating...
                        </>
                      ) : puzzleStatus.hasLog && statusInfo ? (
                        <>
                          <statusInfo.icon className="w-3 h-3 mr-1.5" />
                          {statusInfo.label}
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 mr-1.5" />
                          Add to List
                        </>
                      )}
                      <ChevronDown className="w-3 h-3 ml-1.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 glass-card border-white/40">
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('wishlist')}
                      className={puzzleStatus.status === 'wishlist' ? 'bg-accent' : ''}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Add to Wishlist
                      {puzzleStatus.status === 'wishlist' && <Check className="w-4 h-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('library')}
                      className={puzzleStatus.status === 'library' ? 'bg-accent' : ''}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Add to Library
                      {puzzleStatus.status === 'library' && <Check className="w-4 h-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('in-progress')}
                      className={puzzleStatus.status === 'in-progress' ? 'bg-accent' : ''}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Currently Solving
                      {puzzleStatus.status === 'in-progress' && <Check className="w-4 h-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('completed')}
                      className={puzzleStatus.status === 'completed' ? 'bg-accent' : ''}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Completed
                      {puzzleStatus.status === 'completed' && <Check className="w-4 h-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/puzzles/${puzzle.id}`} className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Rate It Button - Solid Style */}
                <Button 
                  asChild
                  className="flex-1 h-9 text-xs font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-glass hover:shadow-glass-lg hover:scale-105 transition-all duration-300 border-0"
                >
                  <Link href={`/puzzles/${puzzle.id}`}>
                    <Star className="w-3 h-3 mr-1.5" />
                    Rate It
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" className="w-full h-9 text-xs font-medium border border-violet-200 text-violet-700 bg-white/80 backdrop-blur-sm hover:bg-violet-50 hover:border-violet-300">
                <Link href={`/puzzles/${puzzle.id}`}>
                  <Eye className="w-3 h-3 mr-1.5" />
                  View Details
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Puzzle Complete</DialogTitle>
            <DialogDescription>
              How long did it take to complete this puzzle?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="completion-time" className="text-sm font-medium">
                Completion Time
              </label>
              <Input
                id="completion-time"
                type="text"
                value={completionTime}
                onChange={(e) => setCompletionTime(e.target.value)}
                placeholder="e.g., 2h 30m, 90m, or 1.5h"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Enter time in any format (e.g., "2h 30m", "90m", "1.5h"). Leave blank if unknown.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCompletionModal(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCompleteConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Mark Complete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 