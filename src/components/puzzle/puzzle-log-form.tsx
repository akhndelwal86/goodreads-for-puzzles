'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StarRating } from './star-rating'
import { ProgressSlider } from './progress-slider'
import { PhotoUploader } from './photo-uploader'
import { ProgressPhotoUploader } from './logging/progress-photo-uploader'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Puzzle, UserPuzzle, CreatePuzzleLogRequest, UpdatePuzzleLogRequest, UserPuzzleStatus } from '@/lib/supabase'
import { uploadPhotos } from '@/lib/storage'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface PuzzleLogFormProps {
  mode: 'create' | 'edit'
  puzzle?: Puzzle
  existingLog?: UserPuzzle
  onSuccess: (log: UserPuzzle) => void
  onCancel: () => void
  className?: string
}

interface PuzzleLogFormData {
  puzzle_id: string
  status: UserPuzzleStatus
  progress_percentage: number
  difficulty_rating: number
  rating: number
  private: boolean
  note: string
  time_spent: number // Change to number for seconds
  photos: File[]
}

export function PuzzleLogForm({
  mode,
  puzzle,
  existingLog,
  onSuccess,
  onCancel,
  className
}: PuzzleLogFormProps) {
  const [formData, setFormData] = useState<PuzzleLogFormData>({
    puzzle_id: puzzle?.id || '',
    status: existingLog?.status as UserPuzzleStatus || 'want_to_buy',
    progress_percentage: existingLog?.progressPercentage || 0,
    difficulty_rating: existingLog?.difficulty || 0, // 0 means no rating selected
    rating: existingLog?.rating || 0, // 0 means no rating selected  
    private: existingLog?.private || false,
    note: existingLog?.notes || '',
    time_spent: (existingLog as any)?.timeSpent || 0, // Get from existing log if available
    photos: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showTimeInput, setShowTimeInput] = useState(false)

  // Show time input for completed puzzles or if time already exists
  useEffect(() => {
    const shouldShowTime = formData.progress_percentage === 100 || formData.time_spent > 0
    setShowTimeInput(shouldShowTime)
  }, [formData.progress_percentage, formData.time_spent])

  // Auto-adjust progress based on status (removed since status is not in form anymore)
  // Progress is now freely editable in the logging form

  const updateFormData = <K extends keyof PuzzleLogFormData>(key: K, value: PuzzleLogFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const formatTimeForDisplay = (seconds: number): string => {
    if (seconds === 0) return ''
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.puzzle_id) {
      newErrors.puzzle_id = 'Please select or create a puzzle'
    }

    // Remove status-based validation since status is managed by list actions

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    console.log('🚀 Form submit - Mode:', mode)
    console.log('🚀 Form submit - ExistingLog:', existingLog)
    console.log('🚀 Form submit - Puzzle ID:', formData.puzzle_id)
    console.log('🚀 Form submit - Form Data:', formData)

    try {
      let uploadedPhotoUrls: string[] = []

      // Upload photos if we have any
      if (formData.photos.length > 0) {
        uploadedPhotoUrls = await uploadPhotos(formData.photos, `puzzle-logs/${formData.puzzle_id}`)
      }

      // Prepare the request data
      const requestData = {
        puzzleId: formData.puzzle_id,
        status: formData.status,
        progressPercentage: formData.progress_percentage,
        difficulty: formData.difficulty_rating === 0 ? null : formData.difficulty_rating, // Convert 0 to null
        rating: formData.rating === 0 ? null : formData.rating, // Convert 0 to null
        notes: formData.note,
        private: formData.private,
        photos: uploadedPhotoUrls,
        timeSpent: formData.time_spent // Add timeSpent to the request
      }

      let response: Response

      if (mode === 'create') {
        // Create new puzzle log
        response = await fetch('/api/puzzle-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        })
      } else {
        // Update existing puzzle log - use the log ID from existingLog
        const { puzzleId, status, ...updateData } = requestData
        const logId = (existingLog as any)?.logId // Use logId from the modal
        
        if (!logId) {
          throw new Error('No log ID found for update operation')
        }
        
        response = await fetch(`/api/puzzle-logs/${logId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${mode === 'create' ? 'create' : 'update'} puzzle log`)
      }

      const savedLog = await response.json()
      
      // Transform response to UserPuzzle format if needed
      const userPuzzle: UserPuzzle = {
        id: savedLog.puzzle?.id || savedLog.puzzle_id,
        title: savedLog.puzzle?.title || 'Unknown Puzzle',
        brand: savedLog.puzzle?.brand?.name || 'Unknown Brand',
        pieces: savedLog.puzzle?.piece_count || 0,
        image: savedLog.puzzle?.image_url || '/placeholder-puzzle.svg',
        status: savedLog.status,
        progressPercentage: savedLog.progress_percentage,
        difficulty: savedLog.difficulty_rating,
        rating: savedLog.rating,
        notes: savedLog.notes,
        private: savedLog.private,
        photos: savedLog.photo_urls || uploadedPhotoUrls,
        createdAt: savedLog.created_at,
        updatedAt: savedLog.updated_at
      }

      onSuccess(userPuzzle)
    } catch (error) {
      console.error('Error saving puzzle log:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save puzzle log' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Log Your Puzzle' : 'Update Puzzle Log'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Track your puzzle journey from start to finish'
            : 'Update your progress and thoughts'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Puzzle Info */}
          {puzzle && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground">{puzzle.title}</h3>
              <p className="text-sm text-muted-foreground">
                {puzzle.pieceCount} pieces • {puzzle.brand?.name || 'Unknown Brand'}
              </p>
              {puzzle.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {puzzle.description}
                </p>
              )}
            </div>
          )}

          {/* Status is managed by list actions, not in logging form */}

          {/* Progress Slider */}
          <ProgressSlider
            value={formData.progress_percentage}
            onChange={(value) => updateFormData('progress_percentage', value)}
            disabled={false}
          />
          {errors.progress_percentage && (
            <p className="text-sm text-red-600">{errors.progress_percentage}</p>
          )}

          {/* Completion Time - Show when progress is 100% or time already exists */}
          {showTimeInput && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Time to Complete
              </label>
              <Input
                type="text"
                value={formatTimeForDisplay(formData.time_spent)}
                onChange={(e) => {
                  const seconds = parseTimeInput(e.target.value)
                  updateFormData('time_spent', seconds)
                }}
                placeholder="e.g., 2h 30m, 90m, or 1.5h"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How long did it take to complete? (e.g., "2h 30m" or "90m")
              </p>
            </div>
          )}

          {/* Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StarRating
              value={formData.difficulty_rating}
              onChange={(rating) => updateFormData('difficulty_rating', rating)}
              label="Difficulty"
              description="How challenging was this puzzle?"
            />
            
            <StarRating
              value={formData.rating}
              onChange={(rating) => updateFormData('rating', rating)}
              label="Quality Rating"
              description="How much did you enjoy it?"
            />
          </div>

          {/* Photos */}
          <ProgressPhotoUploader
            photos={formData.photos}
            onChange={(photos) => updateFormData('photos', photos)}
          />

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Notes
            </label>
            <Textarea
              value={formData.note}
              onChange={(e) => updateFormData('note', e.target.value)}
              placeholder="Share your thoughts, tips, or memories about this puzzle..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <label className="text-sm font-medium text-foreground">
                Private Log
              </label>
              <p className="text-xs text-muted-foreground">
                Only you can see this log entry
              </p>
            </div>
            <Switch
              checked={formData.private}
              onCheckedChange={(checked) => updateFormData('private', checked)}
            />
          </div>

          {/* Submit Errors */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </div>
              ) : (
                mode === 'create' ? 'Create Log' : 'Update Log'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 