'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, Upload, Camera, Image } from 'lucide-react'

interface PhotoUploaderProps {
  photos: File[]
  onChange: (photos: File[]) => void
  maxPhotos?: number
  className?: string
}

export function PhotoUploader({ 
  photos, 
  onChange, 
  maxPhotos = 5, 
  className 
}: PhotoUploaderProps) {
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
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/')
    )
    
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
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Photos
        </label>
        <span className="text-xs text-muted-foreground">
          {photos.length} of {maxPhotos}
        </span>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                aria-label="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
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
            'border-2 border-dashed rounded-lg p-6 transition-colors duration-200',
            'hover:border-primary/50 focus-within:border-primary',
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300'
          )}
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground">
                Drop photos here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 10MB each
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('photo-input')?.click()}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Browse Files</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('camera-input')?.click()}
                className="flex items-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Camera</span>
              </Button>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            id="photo-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {!canAddMore && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum number of photos reached
        </p>
      )}
    </div>
  )
} 