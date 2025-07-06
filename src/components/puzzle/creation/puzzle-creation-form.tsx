'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BrandSelector } from './brand-selector'
import { MainImageUploader } from './main-image-uploader'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Puzzle } from 'lucide-react'

interface PuzzleCreationData {
  title: string
  brand: string
  pieceCount: number
  description: string
  mainImage: File | null
  // Optional purchase info
  price?: string
  purchaseLink?: string
  whereBought?: string
}

interface PuzzleCreationFormProps {
  onSuccess: (puzzle: { id: string; [key: string]: any }) => void
  onCancel?: () => void
  onSubmitStart?: () => void
  onError?: () => void
  isSubmitting?: boolean
  className?: string
  initialData?: Partial<PuzzleCreationData>
}

const PIECE_COUNT_OPTIONS = [
  { value: 100, label: '100 pieces' },
  { value: 250, label: '250 pieces' },
  { value: 500, label: '500 pieces' },
  { value: 750, label: '750 pieces' },
  { value: 1000, label: '1000 pieces' },
  { value: 1500, label: '1500 pieces' },
  { value: 2000, label: '2000 pieces' },
  { value: 3000, label: '3000 pieces' },
  { value: 4000, label: '4000 pieces' },
  { value: 5000, label: '5000+ pieces' }
]

export function PuzzleCreationForm({
  onSuccess,
  onCancel,
  onSubmitStart,
  onError,
  isSubmitting: externalIsSubmitting,
  className,
  initialData = {}
}: PuzzleCreationFormProps) {
  const [formData, setFormData] = useState<PuzzleCreationData>({
    title: initialData.title || '',
    brand: initialData.brand || '',
    pieceCount: initialData.pieceCount || 1000,
    description: initialData.description || '',
    mainImage: initialData.mainImage || null,
    price: initialData.price || '',
    purchaseLink: initialData.purchaseLink || '',
    whereBought: initialData.whereBought || ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const finalIsSubmitting = externalIsSubmitting ?? isSubmitting
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showOptionalFields, setShowOptionalFields] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Puzzle title is required'
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required'
    }

    if (!formData.pieceCount) {
      newErrors.pieceCount = 'Piece count is required'
    }

    if (!formData.mainImage) {
      newErrors.mainImage = 'Main puzzle image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    onSubmitStart?.()
    setIsSubmitting(true)
    setErrors({})

    try {
      // First, upload the main image
      let mainImageUrl = ''
      if (formData.mainImage) {
        const imageFormData = new FormData()
        imageFormData.append('file-0', formData.mainImage)
        imageFormData.append('folder', 'puzzles/main-images')

        const uploadResponse = await fetch('/api/upload-photos', {
          method: 'POST',
          body: imageFormData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadData = await uploadResponse.json()
        mainImageUrl = uploadData.urls[0] || ''
      }

      // Create the puzzle with all information
      const puzzleData = {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        pieceCount: formData.pieceCount,
        description: formData.description.trim(),
        imageUrl: mainImageUrl,
        // Optional purchase info
        ...(formData.price && { price: formData.price }),
        ...(formData.purchaseLink && { purchaseLink: formData.purchaseLink }),
        ...(formData.whereBought && { whereBought: formData.whereBought })
      }

      const response = await fetch('/api/puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(puzzleData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create puzzle')
      }

      const puzzle = await response.json()
      onSuccess(puzzle)

    } catch (error) {
      console.error('Error creating puzzle:', error)
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Failed to create puzzle'
      })
      onError?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof PuzzleCreationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Puzzle className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Add New Puzzle to Platform</CardTitle>
        <CardDescription>
          Help others discover this puzzle by adding it to our database
        </CardDescription>
        <Badge variant="outline" className="w-fit mx-auto">
          Stage 1 of 2: Platform Contribution
        </Badge>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Puzzle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            {/* Puzzle Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Puzzle Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g., Mountain Lake Reflection"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Brand Selector */}
            <BrandSelector
              value={formData.brand}
              onChange={(brand) => updateField('brand', brand)}
              className={errors.brand ? 'text-destructive' : ''}
            />
            {errors.brand && (
              <p className="text-sm text-destructive">{errors.brand}</p>
            )}

            {/* Piece Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Piece Count *
              </label>
              <Select 
                value={formData.pieceCount.toString()} 
                onValueChange={(value) => updateField('pieceCount', parseInt(value))}
              >
                <SelectTrigger className={errors.pieceCount ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select piece count" />
                </SelectTrigger>
                <SelectContent>
                  {PIECE_COUNT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pieceCount && (
                <p className="text-sm text-destructive">{errors.pieceCount}</p>
              )}
            </div>

            {/* Main Image */}
            <MainImageUploader
              image={formData.mainImage}
              onChange={(image) => updateField('mainImage', image)}
              className={errors.mainImage ? 'text-destructive' : ''}
            />
            {errors.mainImage && (
              <p className="text-sm text-destructive">{errors.mainImage}</p>
            )}

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the puzzle theme, artwork, or any special features..."
                rows={3}
              />
            </div>
          </div>

          {/* Optional Purchase Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Purchase Information (Optional)</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
              >
                {showOptionalFields ? 'Hide' : 'Add'} Purchase Details
              </Button>
            </div>

            {showOptionalFields && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Price Paid
                    </label>
                    <Input
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      placeholder="$19.99"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Where Bought
                    </label>
                    <Input
                      value={formData.whereBought}
                      onChange={(e) => updateField('whereBought', e.target.value)}
                      placeholder="Amazon, Target, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Purchase Link
                  </label>
                  <Input
                    value={formData.purchaseLink}
                    onChange={(e) => updateField('purchaseLink', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
              disabled={finalIsSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={finalIsSubmitting}
            >
              {finalIsSubmitting ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Creating Puzzle...
                </>
              ) : (
                'Add to Platform'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 