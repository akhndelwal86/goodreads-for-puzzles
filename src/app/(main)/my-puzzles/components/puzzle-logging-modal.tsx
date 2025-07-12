'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PuzzleLogForm } from '@/components/puzzle/puzzle-log-form'
import { type UserPuzzle } from '@/lib/supabase'
import { usePuzzleLog } from '@/hooks/use-puzzle-log'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

interface PuzzleLoggingModalProps {
  puzzle: UserPuzzle | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function PuzzleLoggingModal({ 
  puzzle, 
  isOpen, 
  onClose, 
  onSuccess 
}: PuzzleLoggingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { hasLog, log, loading: logLoading, checkForLog, refetch, invalidateCache } = usePuzzleLog()

  // Check for existing log when modal opens and puzzle changes
  useEffect(() => {
    if (isOpen && puzzle?.id) {
      checkForLog(puzzle.id)
    }
  }, [isOpen, puzzle?.id, checkForLog])

  // Clear cache when modal closes
  useEffect(() => {
    if (!isOpen) {
      invalidateCache()
    }
  }, [isOpen, invalidateCache])

  if (!puzzle) return null

  // Determine mode and existing log based on the hook results
  const mode = hasLog ? 'edit' : 'create'
  
  // Convert log data to UserPuzzle format for the form if we have an existing log
  const existingLog = hasLog && log ? {
    id: puzzle.id, // Keep puzzle ID for UserPuzzle interface
    logId: log.id, // Add log ID for PATCH operations
    title: log.puzzleTitle,
    brand: puzzle.brand,
    pieces: puzzle.pieces,
    image: puzzle.image,
    status: puzzle.status,
    progressPercentage: log.progressPercentage || (puzzle.status === 'completed' ? 100 : 0),
    difficulty: log.difficulty || 0,
    rating: log.rating || 0,
    notes: log.notes || '',
    private: log.private || false,
    photos: log.photos || [],
    timeSpent: log.timeSpent || 0,
    completedAt: log.completedAt,
    createdAt: log.createdAt,
    updatedAt: log.updatedAt
  } as UserPuzzle & { logId: string } : undefined

  // Convert UserPuzzle to Puzzle format for the form
  const puzzleForForm = puzzle ? {
    id: puzzle.id,
    title: puzzle.title,
    pieceCount: puzzle.pieces,
    brand: { id: 'unknown', name: puzzle.brand },
    description: puzzle.notes || undefined,
    imageUrl: puzzle.image,
    createdAt: puzzle.createdAt || new Date().toISOString(),
    updatedAt: puzzle.updatedAt || new Date().toISOString()
  } : undefined

  const handleSuccess = async () => {
    setIsSubmitting(false)
    
    // Refetch the log data to get the latest information
    await refetch()
    
    // Call parent success handler
    onSuccess?.()
    
    // Close modal
    onClose()
  }

  const handleCancel = () => {
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Puzzle Log' : 'Log Puzzle Progress'} - {puzzle.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {logLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <PuzzleLogForm
              mode={mode}
              puzzle={puzzleForForm}
              existingLog={existingLog}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              className="border-0 shadow-none p-0"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 