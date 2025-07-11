'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, Upload, Image as ImageIcon, Camera } from 'lucide-react'

interface MainImageUploaderProps {
  image: File | null
  onChange: (image: File | null) => void
  className?: string
  onError?: (error: string) => void
}

export function MainImageUploader({ 
  image, 
  onChange, 
  className,
  onError 
}: MainImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPG, PNG, or WebP image.'
    }
    
    if (file.size > maxSize) {
      return 'Image size must be less than 10MB.'
    }
    
    return null
  }

  // Generate preview URL when image changes
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreview(null)
    }
  }, [image])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      const file = files[0]
      const error = validateFile(file)
      if (error) {
        onError?.(error)
      } else {
        onChange(file)
      }
    }
  }, [onChange, onError, validateFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const error = validateFile(file)
      if (error) {
        onError?.(error)
      } else {
        onChange(file)
      }
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }, [onChange, onError, validateFile])

  const handleRemove = useCallback(() => {
    onChange(null)
    setPreview(null)
  }, [onChange])

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-foreground">
        Main Puzzle Image *
      </label>
      <p className="text-xs text-muted-foreground">
        Upload the official product image (box art or completed puzzle)
      </p>
      
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragOver 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="main-image-upload"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Drag & drop your puzzle image here
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or WebP up to 10MB
              </p>
            </div>
            
            <div className="flex gap-2 justify-center">
              <label htmlFor="main-image-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Future: Open camera on mobile
                  document.getElementById('main-image-upload')?.click()
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Image Preview */}
          <div className="relative group">
            <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
              {preview && (
                <img
                  src={preview}
                  alt="Puzzle preview"
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Overlay with remove button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  onClick={handleRemove}
                  variant="destructive"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
          
          {/* Image Info */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{image.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(image.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleRemove}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Replace Option */}
          <div className="text-center">
            <label htmlFor="main-image-replace">
              <Button type="button" variant="outline" size="sm" asChild>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Replace Image
                </span>
              </Button>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="main-image-replace"
            />
          </div>
        </div>
      )}
    </div>
  )
} 