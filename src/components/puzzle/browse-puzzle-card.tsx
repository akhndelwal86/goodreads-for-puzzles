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
  Users
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
      // If there's an error, assume puzzle is untracked
      setPuzzleStatus({ hasLog: false })
    }
  }

  // Parse time input into seconds
  const parseTimeInput = (timeStr: string): number => {
    if (!timeStr.trim()) return 0
    
    // Remove extra spaces and convert to lowercase
    const cleanStr = timeStr.toLowerCase().replace(/\s+/g, ' ').trim()
    
    // Initialize total seconds
    let totalSeconds = 0
    
    // Match different time formats
    const hourMatch = cleanStr.match(/(\d*\.?\d+)\s*h/)
    const minuteMatch = cleanStr.match(/(\d+)\s*m/)
    
    if (hourMatch) {
      totalSeconds += parseFloat(hourMatch[1]) * 3600
    }
    
    if (minuteMatch) {
      totalSeconds += parseInt(minuteMatch[1]) * 60
    }
    
    // If no specific format found, try to parse as just minutes
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

  // Get difficulty level and color
  const getDifficultyInfo = (pieceCount: number) => {
    if (pieceCount <= 300) return { level: 'Beginner', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    if (pieceCount <= 500) return { level: 'Easy', color: 'bg-green-50 text-green-700 border-green-200' }
    if (pieceCount <= 1000) return { level: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' }
    if (pieceCount <= 2000) return { level: 'Hard', color: 'bg-orange-50 text-orange-700 border-orange-200' }
    return { level: 'Expert', color: 'bg-red-50 text-red-700 border-red-200' }
  }

  // Get status display info for button text only
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

  // List view layout
  if (viewMode === 'list') {
    return (
      <>
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
          <div className="flex">
            {/* Image Container - Cleaner with only difficulty badge */}
            <div className="relative w-48 h-36 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              {puzzle.imageUrl ? (
                <Image
                  src={puzzle.imageUrl}
                  alt={puzzle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="192px"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Clock className="w-12 h-12" />
                </div>
              )}
              
              {/* Only Difficulty Badge - positioned better */}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className={`${difficulty.color} text-xs font-medium border shadow-sm`}>
                  {difficulty.level}
                </Badge>
              </div>
            </div>

            {/* Content - Improved spacing and typography */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                {/* Title and Brand */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 mb-1">
                    {puzzle.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {puzzle.brand?.name || 'Unknown Brand'}
                  </p>
                </div>

                {/* Description */}
                {puzzle.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {puzzle.description}
                  </p>
                )}

                {/* Stats Row - Better spacing */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {puzzle.pieceCount.toLocaleString()}
                    </span>
                    <span className="text-gray-600">pieces</span>
                  </div>
                  {/* Rating */}
                  {puzzle.avgRating && puzzle.reviewCount && puzzle.reviewCount > 0 ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {puzzle.avgRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">
                        ({puzzle.reviewCount} review{puzzle.reviewCount !== 1 ? 's' : ''})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">No reviews yet</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{Math.floor(Math.random() * 200) + 50} solves</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5">
                {/* Add to List Dropdown */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant={puzzleStatus.hasLog ? "secondary" : "default"} 
                        size="sm" 
                        className="min-w-[140px] h-9"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Clock className="w-3 h-3 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : puzzleStatus.hasLog && statusInfo ? (
                          <>
                            <statusInfo.icon className="w-3 h-3 mr-2" />
                            {statusInfo.label}
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 mr-2" />
                            Add to List
                          </>
                        )}
                        <ChevronDown className="w-3 h-3 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
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
                ) : (
                  <Button asChild variant="outline" size="sm" className="min-w-[120px] h-9">
                    <Link href={`/puzzles/${puzzle.id}`}>
                      <Eye className="w-3 h-3 mr-2" />
                      View Details
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completion Time Modal */}
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

  // Grid view layout (default) - Cleaner design
  return (
    <>
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
        {/* Image Container - Clean with only difficulty badge */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {puzzle.imageUrl ? (
            <Image
              src={puzzle.imageUrl}
              alt={puzzle.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Clock className="w-12 h-12" />
            </div>
          )}
          
          {/* Only Difficulty Badge - better positioned */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className={`${difficulty.color} text-xs font-medium border shadow-sm`}>
              {difficulty.level}
            </Badge>
          </div>
        </div>

        {/* Content - Improved layout */}
        <div className="p-4">
          {/* Title and Brand */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
              {puzzle.title}
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              {puzzle.brand?.name || 'Unknown Brand'}
            </p>
          </div>

          {/* Piece Count - More prominent */}
          <div className="mb-3">
            <span className="text-sm font-semibold text-gray-900">
              {puzzle.pieceCount.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600 ml-1">pieces</span>
          </div>

          {/* Stats Row - Better spacing */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {/* Rating */}
              {puzzle.avgRating && puzzle.reviewCount && puzzle.reviewCount > 0 ? (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">
                    {puzzle.avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({puzzle.reviewCount} review{puzzle.reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <Star className="w-4 h-4" />
                  <span className="text-xs">No reviews</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              <span className="font-medium">{Math.floor(Math.random() * 200) + 50} solves</span>
            </div>
          </div>

          {/* Action Button - Full width for better UX */}
          <div className="w-full">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={puzzleStatus.hasLog ? "secondary" : "default"} 
                    size="sm" 
                    className="w-full h-8"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Clock className="w-3 h-3 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : puzzleStatus.hasLog && statusInfo ? (
                      <>
                        <statusInfo.icon className="w-3 h-3 mr-2" />
                        {statusInfo.label}
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 mr-2" />
                        Add to List
                      </>
                    )}
                    <ChevronDown className="w-3 h-3 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
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
            ) : (
              <Button asChild variant="outline" size="sm" className="w-full h-8">
                <Link href={`/puzzles/${puzzle.id}`}>
                  <Eye className="w-3 h-3 mr-2" />
                  View Details
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Time Modal */}
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