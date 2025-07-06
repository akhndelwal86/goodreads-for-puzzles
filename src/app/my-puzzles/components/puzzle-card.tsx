'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Clock, CheckCircle, Play, BookOpen, Star, Edit3 } from 'lucide-react'
import type { UserPuzzle } from '@/lib/supabase'
import { usePuzzleLog } from '@/hooks/use-puzzle-log'

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
      case 'wishlist': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'library': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'abandoned': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'wishlist': return <Star className="w-3 h-3" />
      case 'library': return <BookOpen className="w-3 h-3" />
      case 'in-progress': return <Play className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'abandoned': return <Clock className="w-3 h-3" />
      default: return null
    }
  }

  const getActionButtons = () => {
    const baseButtonClass = "h-8 px-3 text-xs font-medium rounded-md transition-all duration-200"
    
    switch (puzzle.status) {
      case 'wishlist':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange?.(puzzle.id, 'library')}
            className={`${baseButtonClass} border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300`}
          >
            Move to Library
          </Button>
        )
      
      case 'library':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange?.(puzzle.id, 'in-progress')}
            className={`${baseButtonClass} border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300`}
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
              onClick={() => onLogProgress?.(puzzle)}
              disabled={logLoading}
              className={`${baseButtonClass} border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300 flex items-center gap-1`}
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
              onClick={handleMarkComplete}
              className={`${baseButtonClass} border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300`}
            >
              Mark Complete
            </Button>
          </div>
        )
      
      case 'completed':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onLogProgress?.(puzzle)}
            disabled={logLoading}
            className={`${baseButtonClass} border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 flex items-center gap-1`}
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
        )
      
      case 'abandoned':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange?.(puzzle.id, 'library')}
            className={`${baseButtonClass} border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300`}
          >
            Restart
          </Button>
        )
      
      default:
        return null
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            {puzzle.image ? (
              <Image
                src={puzzle.image}
                alt={puzzle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <BookOpen className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className="font-semibold text-sm text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onPuzzleClick(puzzle)}
              >
                {puzzle.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(puzzle.status)} text-xs font-medium px-2 py-1 rounded-full border flex items-center gap-1 shrink-0`}
              >
                {getStatusIcon(puzzle.status)}
                {puzzle.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">{puzzle.brand}</span>
              <span>{puzzle.pieces} pieces</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-gray-100">
              {getActionButtons()}
            </div>
          </div>
        </div>
      </CardContent>

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
    </Card>
  )
} 