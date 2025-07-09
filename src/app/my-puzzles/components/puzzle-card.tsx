'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Clock, CheckCircle, Play, Edit3, Heart, Archive, PlayCircle, XCircle, Star, BookOpen } from 'lucide-react'
import type { UserPuzzle } from '@/lib/supabase'
import { usePuzzleLog } from '@/hooks/use-puzzle-log'
import { AdvancedRatingModal } from '@/components/puzzle'

interface PuzzleCardProps {
  puzzle: UserPuzzle
  onPuzzleClick: (puzzle: UserPuzzle) => void
  onStatusChange?: (puzzleId: string, newStatus: string, completionTime?: number) => void
  onLogProgress?: (puzzle: UserPuzzle) => void
}

export function PuzzleCard({ puzzle, onPuzzleClick, onStatusChange, onLogProgress }: PuzzleCardProps) {
  const { hasLog, loading: logLoading, checkForLog } = usePuzzleLog()
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completionTime, setCompletionTime] = useState('')
  const [showRatingModal, setShowRatingModal] = useState(false)

  // Check for existing log when component mounts
  useEffect(() => {
    checkForLog(puzzle.id)
  }, [puzzle.id, checkForLog])

  const parseTimeInput = (timeStr: string): number => {
    if (!timeStr.trim()) return 0
    
    // Parse formats like "2h 30m", "90m", "1.5h", etc.
    const hourMatch = timeStr.match(/(\d+(?:\.\d+)?)\s*h/i)
    const minuteMatch = timeStr.match(/(\d+)\s*m/i)
    
    let totalMinutes = 0
    
    if (hourMatch) {
      totalMinutes += parseFloat(hourMatch[1]) * 60
    }
    if (minuteMatch) {
      totalMinutes += parseInt(minuteMatch[1])
    }
    
    // If no matches, assume it's just minutes
    if (!hourMatch && !minuteMatch) {
      const num = parseFloat(timeStr)
      if (!isNaN(num)) {
        totalMinutes = num
      }
    }
    
    return Math.round(totalMinutes * 60) // Convert to seconds
  }

  const handleMarkComplete = () => {
    setShowCompletionModal(true)
  }

  const handleConfirmComplete = () => {
    const timeInSeconds = parseTimeInput(completionTime)
    onStatusChange?.(puzzle.id, 'completed', timeInSeconds)
    setShowCompletionModal(false)
    setCompletionTime('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'wishlist': return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'library': return 'bg-blue-100 text-blue-700 border-blue-200'  
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'abandoned': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'wishlist': return <Heart className="w-3 h-3" />
      case 'library': return <Archive className="w-3 h-3" />
      case 'in-progress': return <PlayCircle className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'abandoned': return <XCircle className="w-3 h-3" />
      default: return <Archive className="w-3 h-3" />
    }
  }

  const getActionButtons = () => {
    const baseButtonClass = "h-9 px-4 text-sm font-medium rounded-lg transition-all duration-300"
    
    switch (puzzle.status) {
      case 'wishlist':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onStatusChange?.(puzzle.id, 'library')
            }}
            className={`${baseButtonClass} border-rose-200 text-rose-700 bg-transparent hover:bg-rose-50 hover:border-rose-300 shadow-sm hover:shadow-md`}
          >
            Move to Library
          </Button>
        )
      
      case 'library':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onStatusChange?.(puzzle.id, 'in-progress')
            }}
            className={`${baseButtonClass} border-blue-200 text-blue-700 bg-transparent hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-md`}
          >
            Start Puzzle
          </Button>
        )
      
      case 'in-progress':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onLogProgress?.(puzzle)
              }}
              disabled={logLoading}
              className={`${baseButtonClass} border-amber-200 text-amber-700 bg-transparent hover:bg-amber-50 hover:border-amber-300 flex items-center gap-1.5 shadow-sm hover:shadow-md`}
            >
              {hasLog ? (
                <>
                  <Edit3 className="w-3 h-3" />
                  Edit Log
                </>
              ) : (
                <>
                  <Star className="w-3 h-3" />
                  Log Progress
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                handleMarkComplete()
              }}
              className={`${baseButtonClass} border-emerald-200 text-emerald-700 bg-transparent hover:bg-emerald-50 hover:border-emerald-300 shadow-sm hover:shadow-md`}
            >
              Mark Complete
            </Button>
          </div>
        )
      
      case 'completed':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onLogProgress?.(puzzle)
              }}
              disabled={logLoading}
              className={`${baseButtonClass} border-emerald-200 text-emerald-700 bg-transparent hover:bg-emerald-50 hover:border-emerald-300 flex items-center gap-1.5 shadow-sm hover:shadow-md`}
            >
              {hasLog ? (
                <>
                  <Edit3 className="w-3 h-3" />
                  Edit Log
                </>
              ) : (
                <>
                  <Star className="w-3 h-3" />
                  Log Progress
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                setShowRatingModal(true)
              }}
              className={`${baseButtonClass} border-violet-200 text-violet-700 bg-transparent hover:bg-violet-50 hover:border-violet-300 flex items-center gap-1.5 shadow-sm hover:shadow-md`}
            >
              <Star className="w-3 h-3" />
              Rate It
            </Button>
          </div>
        )
      
      case 'abandoned':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onStatusChange?.(puzzle.id, 'library')
              }}
              className={`${baseButtonClass} border-gray-200 text-gray-700 bg-transparent hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md`}
            >
              Restart
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                setShowRatingModal(true)
              }}
              className={`${baseButtonClass} border-violet-200 text-violet-700 bg-transparent hover:bg-violet-50 hover:border-violet-300 flex items-center gap-1.5 shadow-sm hover:shadow-md`}
            >
              <Star className="w-3 h-3" />
              Rate It
            </Button>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="glass-card hover-lift border border-white/40 rounded-xl group cursor-pointer" onClick={() => onPuzzleClick(puzzle)}>
      <div className="p-5">
        <div className="space-y-4">
          {/* Premium Image Container */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
            {puzzle.image ? (
              <>
              <Image
                src={puzzle.image}
                alt={puzzle.title}
                fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <BookOpen className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Premium Content Section */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-lg text-slate-800 line-clamp-2 hover:text-violet-700 transition-colors flex-1">
                {puzzle.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(puzzle.status)} text-xs font-normal px-3 py-1.5 rounded-full border flex items-center gap-1.5 shrink-0`}
              >
                {getStatusIcon(puzzle.status)}
                {puzzle.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Premium Metadata */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-normal text-slate-600">{puzzle.brand}</span>
              <span className="font-normal text-slate-500">{puzzle.pieces} pieces</span>
            </div>

            {/* Premium Action Section */}
            <div className="pt-3 border-t border-white/20" onClick={(e) => e.stopPropagation()}>
              {getActionButtons()}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <DialogContent>
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
            <Button variant="outline" onClick={() => setShowCompletionModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmComplete}>
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdvancedRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        puzzle={{
          id: puzzle.id,
          title: puzzle.title,
          brand: { name: puzzle.brand },
          imageUrl: puzzle.image,
          pieceCount: puzzle.pieces
        }}
      />
    </div>
  )
} 