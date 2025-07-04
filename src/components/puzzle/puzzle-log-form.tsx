'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusSelector, type PuzzleStatus } from './status-selector'
import { StarRating } from './star-rating'
import { ProgressSlider } from './progress-slider'
import { PhotoUploader } from './photo-uploader'
import { ProgressPhotoUploader } from './logging/progress-photo-uploader'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Puzzle, UserPuzzle, CreatePuzzleLogRequest, UpdatePuzzleLogRequest } from '@/lib/supabase'
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

interface FormData {
  puzzle_id: string
  status: PuzzleStatus
  progress_percentage: number
  difficulty_rating: number
  user_rating: number
  private: boolean
  notes: string
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
  const [formData, setFormData] = useState<FormData>({
    puzzle_id: puzzle?.id || existingLog?.id || '',
    status: existingLog?.status as PuzzleStatus || 'want-to-do',
    progress_percentage: existingLog?.progressPercentage || 0,
    difficulty_rating: existingLog?.difficulty || 0,
    user_rating: existingLog?.rating || 0,
    private: existingLog?.private || false,
    notes: existingLog?.notes || '',
    photos: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-adjust progress based on status
  useEffect(() => {
    if (formData.status === 'want-to-do' && formData.progress_percentage > 0) {
      setFormData(prev => ({ ...prev, progress_percentage: 0 }))
    } else if (formData.status === 'completed' && formData.progress_percentage < 100) {
      setFormData(prev => ({ ...prev, progress_percentage: 100 }))
    }
  }, [formData.status, formData.progress_percentage])

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.puzzle_id) {
      newErrors.puzzle_id = 'Please select or create a puzzle'
    }

    if (formData.status === 'completed' && formData.progress_percentage < 100) {
      newErrors.progress_percentage = 'Completed puzzles should be at 100%'
    }

    if (formData.status === 'want-to-do' && formData.progress_percentage > 0) {
      newErrors.progress_percentage = 'Want-to-do puzzles should be at 0%'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

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
        difficulty: formData.difficulty_rating,
        rating: formData.user_rating,
        notes: formData.notes,
        private: formData.private,
        photos: uploadedPhotoUrls
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
        // Update existing puzzle log
        const { puzzleId, ...updateData } = requestData
        response = await fetch(`/api/puzzle-logs/${existingLog?.id}`, {
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
        rating: savedLog.user_rating,
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

  const progressDisabled = formData.status === 'want-to-do' || formData.status === 'completed'

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

          {/* Status Selection */}
          <StatusSelector
            value={formData.status}
            onChange={(status) => updateFormData('status', status)}
          />
          {errors.status && (
            <p className="text-sm text-red-600">{errors.status}</p>
          )}

          {/* Progress Slider */}
          <ProgressSlider
            value={formData.progress_percentage}
            onChange={(value) => updateFormData('progress_percentage', value)}
            disabled={progressDisabled}
          />
          {errors.progress_percentage && (
            <p className="text-sm text-red-600">{errors.progress_percentage}</p>
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
              value={formData.user_rating}
              onChange={(rating) => updateFormData('user_rating', rating)}
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
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
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