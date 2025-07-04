'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, Upload, Camera, Plus, Image as ImageIcon } from 'lucide-react'

interface ProgressPhotoUploaderProps {
  photos: File[]
  onChange: (photos: File[]) => void
  maxPhotos?: number
  className?: string
}

export function ProgressPhotoUploader({ 
  photos, 
  onChange, 
  maxPhotos = 8, 
  className 
}: ProgressPhotoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    const newPhotos = [...photos, ...files].slice(0, maxPhotos)
    onChange(newPhotos)
  }, [photos, onChange, maxPhotos])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPhotos = [...photos, ...files].slice(0, maxPhotos)
    onChange(newPhotos)
    // Reset input
    e.target.value = ''
  }, [photos, onChange, maxPhotos])

  const removePhoto = useCallback((index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onChange(newPhotos)
  }, [photos, onChange])

  const canAddMore = photos.length < maxPhotos

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">
            Progress Photos
          </label>
          <p className="text-xs text-muted-foreground">
            Share your puzzle journey - workspace, progress shots, completed puzzle
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {photos.length}/{maxPhotos}
        </div>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <PhotoPreview
              key={index}
              photo={photo}
              onRemove={() => removePhoto(index)}
            />
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            photos.length === 0 ? "min-h-[120px]" : "min-h-[80px]",
            isDragOver 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="progress-photos-upload"
          />
          
          <div className="space-y-3">
            {photos.length === 0 ? (
              // Empty state
              <>
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Add progress photos</p>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to upload
                  </p>
                </div>
              </>
            ) : (
              // Add more state
              <div className="space-y-2">
                <Plus className="w-5 h-5 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Add more photos ({maxPhotos - photos.length} remaining)
                </p>
              </div>
            )}
            
            <div className="flex gap-2 justify-center">
              <label htmlFor="progress-photos-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </span>
                </Button>
              </label>
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Future: Open camera on mobile
                  document.getElementById('progress-photos-upload')?.click()
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {photos.length === 0 && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">💡 Photo ideas:</p>
          <ul className="space-y-0.5 ml-2">
            <li>• Your workspace setup</li>
            <li>• Progress at 25%, 50%, 75%</li>
            <li>• Challenging sections</li>
            <li>• The completed puzzle</li>
          </ul>
        </div>
      )}
    </div>
  )
}

// Photo preview component
interface PhotoPreviewProps {
  photo: File
  onRemove: () => void
}

function PhotoPreview({ photo, onRemove }: PhotoPreviewProps) {
  const [preview, setPreview] = useState<string>('')

  // Generate preview URL
  useEffect(() => {
    const url = URL.createObjectURL(photo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  return (
    <div className="relative group aspect-square">
      <div className="w-full h-full bg-muted rounded-lg overflow-hidden">
        {preview && (
          <img
            src={preview}
            alt={`Progress photo ${photo.name}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
      >
        <X className="w-3 h-3" />
      </button>
      
      {/* File info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs truncate">{photo.name}</p>
        <p className="text-xs opacity-75">
          {(photo.size / 1024 / 1024).toFixed(1)}MB
        </p>
      </div>
    </div>
  )
} 