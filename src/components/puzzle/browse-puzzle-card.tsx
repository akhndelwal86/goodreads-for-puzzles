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
import { useRouter } from 'next/navigation'
import { QuickRatingModal } from '@/components/puzzle/quick-rating-modal'

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
  const [showRatingModal, setShowRatingModal] = useState(false)
  
  // Debug: Log when modal state changes
  useEffect(() => {
    console.log('Rating modal state changed:', showRatingModal, 'for puzzle:', puzzle.id)
  }, [showRatingModal, puzzle.id])
  const router = useRouter()

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
    if (pieceCount <= 300) return { level: 'Easy', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    if (pieceCount <= 1000) return { level: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' }
    if (pieceCount <= 2000) return { level: 'Hard', color: 'bg-rose-100 text-rose-700 border-rose-200' }
    return { level: 'Expert', color: 'bg-violet-100 text-violet-700 border-violet-200' }
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
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
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
                    <h3 className="font-medium text-slate-800 text-base line-clamp-2 mb-1">
                      {puzzle.title}
                    </h3>

                    {/* Brand Name */}
                    <p className="text-slate-600 text-sm mb-2">
                      {puzzle.brand?.name || 'Unknown Brand'}
                    </p>

                    {/* Piece Count and Rating Stats */}
                    <div className="flex items-center gap-6 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <span className="font-normal text-slate-800">
                          {puzzle.pieceCount.toLocaleString()}
                        </span>
                        <span className="text-slate-500">pieces</span>
                      </div>
                      {puzzle.avgRating && puzzle.reviewCount && puzzle.reviewCount > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                          <span className="font-normal text-slate-800">
                            {puzzle.avgRating.toFixed(1)}
                          </span>
                          <span className="text-slate-500">
                            ({puzzle.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500">
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
                          className="flex-1 h-9 text-xs font-normal border border-violet-200 text-violet-700 bg-white/80 backdrop-blur-sm hover:bg-violet-50 hover:border-violet-300 transition-all duration-300"
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
                      className="flex-1 h-9 text-xs font-normal bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-glass hover:shadow-glass-lg hover:scale-105 transition-all duration-300 border-0"
                      onClick={() => setShowRatingModal(true)}
                    >
                      <Star className="w-3 h-3 mr-1.5" />
                      Rate It
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" className="w-full h-9 text-xs font-normal border border-violet-200 text-violet-700 bg-white/80 backdrop-blur-sm hover:bg-violet-50 hover:border-violet-300">
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

      {/* Rating Modal */}
      <QuickRatingModal
        isOpen={showRatingModal}
        onClose={() => {
          console.log('Closing rating modal for puzzle:', puzzle.id)
          setShowRatingModal(false)
        }}
        puzzle={{
          id: puzzle.id,
          title: puzzle.title,
          brand: { name: puzzle.brand?.name || 'Unknown Brand' },
          imageUrl: puzzle.imageUrl,
          pieceCount: puzzle.pieceCount
        }}
      />
    </>
  )
}

  // ✨ REDESIGNED GRID VIEW - Matching Reference Image Exactly
  return (
    <>
      <div className="w-full max-w-sm glass-card hover-lift border border-white/40 rounded-xl group cursor-pointer" onClick={() => router.push(`/puzzles/${puzzle.id}`)}>
        <div className="p-5">
          {/* Image Container - Fixed Height with Enhanced Hover Effects */}
          <div className="relative overflow-hidden rounded-xl mb-4">
            {puzzle.imageUrl ? (
              <>
                <Image
                  src={puzzle.imageUrl}
                  alt={puzzle.title}
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="flex items-center justify-center h-48 bg-gray-100 rounded-xl">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            )}
            
            {/* Heart Wishlist Button - Enhanced Styling */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleStatusChange('wishlist')
              }}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm ${
                puzzleStatus.status === 'wishlist'
                  ? 'bg-pink-500 hover:bg-pink-600'
                  : 'bg-white/90 hover:bg-white'
              }`}
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  puzzleStatus.status === 'wishlist'
                    ? 'text-white fill-current'
                    : 'text-slate-600'
                }`}
              />
            </button>
          </div>

          {/* Content Section */}
          <div className="space-y-3">
            {/* Title with Hover Effect */}
            <h3 className="font-medium text-lg text-slate-800 line-clamp-1 group-hover:text-violet-700 transition-colors">
              {puzzle.title}
            </h3>

            {/* Brand Name */}
            <p className="text-sm text-slate-600 font-normal">
              {puzzle.brand?.name || 'Unknown Brand'}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {puzzle.avgRating && puzzle.reviewCount && puzzle.reviewCount > 0 ? (
                <>
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-normal text-slate-800">
                    {puzzle.avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({puzzle.reviewCount})
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1 text-slate-500">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">No reviews</span>
                </div>
              )}
            </div>

            {/* Piece Count & Difficulty Row */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-800 font-normal">
                {puzzle.pieceCount.toLocaleString()} pieces
              </span>
              <Badge className={`${difficulty.color} border text-xs font-normal`}>
                {difficulty.level}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {user ? (
                <>
                  {/* Add to List Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline"
                        className="flex-1 h-8 text-xs font-normal border border-violet-200 text-violet-700 bg-white hover:bg-violet-50 hover:border-violet-300 transition-all duration-300"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Clock className="w-3 h-3 mr-1 animate-spin" />
                            <span className="truncate">Updating...</span>
                          </>
                        ) : puzzleStatus.hasLog && statusInfo ? (
                          <>
                            <statusInfo.icon className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{statusInfo.label}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Add to List</span>
                          </>
                        )}
                        <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 glass-card border-white/40 rounded-xl">
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

                  {/* Rate It Button */}
                  <Button 
                    className="flex-1 h-8 text-xs font-normal bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowRatingModal(true)
                    }}
                  >
                    <Star className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Rate It</span>
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" className="w-full h-8 text-xs font-normal border border-violet-200 text-violet-700 bg-white hover:bg-violet-50 hover:border-violet-300">
                  <Link href={`/puzzles/${puzzle.id}`}>
                    <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">View Details</span>
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

      {/* Rating Modal */}
      <QuickRatingModal
        isOpen={showRatingModal}
        onClose={() => {
          console.log('Closing rating modal for puzzle:', puzzle.id)
          setShowRatingModal(false)
        }}
        puzzle={{
          id: puzzle.id,
          title: puzzle.title,
          brand: { name: puzzle.brand?.name || 'Unknown Brand' },
          imageUrl: puzzle.imageUrl,
          pieceCount: puzzle.pieceCount
        }}
      />
    </>
  )
} 