'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  EyeOff,
  Users,
  Lock,
  Globe,
  Check,
  X,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Theme {
  id: string
  name: string
  display_name: string
  description: string
  icon_name: string
  color_class: string
  collection_count: number
}

interface CollectionFilters {
  themes: string[]
  pieceCountMin: number
  pieceCountMax: number
  difficulty: string[]
  brands: string[]
  yearMin: number
  yearMax: number
}

interface CreateCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (collection: any) => void
}

const STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Name and describe your collection' },
  { id: 'themes', title: 'Select Themes', description: 'Choose categories that fit your collection' },
  { id: 'filters', title: 'Set Filters', description: 'Define criteria to find matching puzzles' },
  { id: 'preview', title: 'Preview', description: 'Review your collection before creating' }
]

const VISIBILITY_OPTIONS = [
  { 
    value: 'public', 
    label: 'Public', 
    description: 'Anyone can view and follow',
    icon: Globe 
  },
  { 
    value: 'friends-only', 
    label: 'Friends Only', 
    description: 'Only your friends can view',
    icon: Users 
  },
  { 
    value: 'private', 
    label: 'Private', 
    description: 'Only you can view and edit',
    icon: Lock 
  }
]

export function CreateCollectionModal({ isOpen, onClose, onSuccess }: CreateCollectionModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [themes, setThemes] = useState<Theme[]>([])
  const [previewPuzzles, setPreviewPuzzles] = useState([])
  const [previewLoading, setPreviewLoading] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public' as 'public' | 'private' | 'friends-only',
    selectedThemes: [] as string[],
    filters: {
      themes: [] as string[],
      pieceCountMin: 100,
      pieceCountMax: 2000,
      difficulty: [] as string[],
      brands: [] as string[],
      yearMin: 1990,
      yearMax: new Date().getFullYear()
    } as CollectionFilters
  })

  // Load themes on mount
  useEffect(() => {
    if (isOpen) {
      loadThemes()
    }
  }, [isOpen])

  // Load preview when filters change
  useEffect(() => {
    if (currentStep === 3 && formData.filters) {
      loadPreviewPuzzles()
    }
  }, [currentStep, formData.filters])

  const loadThemes = async () => {
    try {
      const response = await fetch('/api/collections/themes')
      const data = await response.json()
      setThemes(data.themes || [])
    } catch (error) {
      console.error('Error loading themes:', error)
    }
  }

  const loadPreviewPuzzles = async () => {
    setPreviewLoading(true)
    try {
      // Build query parameters based on filters
      const params = new URLSearchParams()
      if (formData.filters.themes.length > 0) {
        params.append('theme', formData.filters.themes.join(','))
      }
      params.append('minPieces', formData.filters.pieceCountMin.toString())
      params.append('maxPieces', formData.filters.pieceCountMax.toString())
      params.append('limit', '6') // Preview only first 6

      const response = await fetch(`/api/puzzles?${params}`)
      const data = await response.json()
      setPreviewPuzzles(data.puzzles || [])
    } catch (error) {
      console.error('Error loading preview:', error)
      setPreviewPuzzles([])
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleThemeToggle = (themeName: string) => {
    const newThemes = formData.selectedThemes.includes(themeName)
      ? formData.selectedThemes.filter(t => t !== themeName)
      : [...formData.selectedThemes, themeName]
    
    setFormData({
      ...formData,
      selectedThemes: newThemes,
      filters: {
        ...formData.filters,
        themes: newThemes
      }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          theme: formData.selectedThemes[0], // Primary theme
          visibility: formData.visibility,
          autoCriteria: formData.filters,
          tags: formData.selectedThemes
        })
      })

      const data = await response.json()
      
      if (data.success) {
        onSuccess?.(data.collection)
        handleClose()
      } else {
        throw new Error(data.error || 'Failed to create collection')
      }
    } catch (error) {
      console.error('Error creating collection:', error)
      // Handle error (could add toast notification)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
    setFormData({
      name: '',
      description: '',
      visibility: 'public',
      selectedThemes: [],
      filters: {
        themes: [],
        pieceCountMin: 100,
        pieceCountMax: 2000,
        difficulty: [],
        brands: [],
        yearMin: 1990,
        yearMax: new Date().getFullYear()
      }
    })
    onClose()
  }

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) return <Check className="w-4 h-4" />
    if (stepIndex === currentStep) return <div className="w-2 h-2 bg-white rounded-full" />
    return <div className="w-2 h-2 bg-white/50 rounded-full" />
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name.trim().length > 0
      case 1: return formData.selectedThemes.length > 0
      case 2: return true // Filters are optional
      case 3: return true
      default: return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            Create New Collection
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                  index <= currentStep 
                    ? "bg-violet-600 border-violet-600 text-white" 
                    : "border-gray-300 text-gray-400"
                )}>
                  {getStepIcon(index)}
                </div>
                <div className="text-center mt-2">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  index < currentStep ? "bg-violet-600" : "bg-gray-300"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter a memorable name for your collection"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what makes this collection special..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label>Who can see this collection?</Label>
                <div className="grid grid-cols-1 gap-3">
                  {VISIBILITY_OPTIONS.map((option) => {
                    const Icon = option.icon
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors",
                          formData.visibility === option.value
                            ? "border-violet-600 bg-violet-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={formData.visibility === option.value}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            visibility: e.target.value as any 
                          })}
                          className="sr-only"
                        />
                        <Icon className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Choose Themes for Your Collection</h3>
                <p className="text-gray-600 mb-6">
                  Select one or more themes that best represent your collection. These help others discover your collection.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      formData.selectedThemes.includes(theme.name)
                        ? "ring-2 ring-violet-600 bg-violet-50"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => handleThemeToggle(theme.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={cn("text-lg", theme.color_class)}>
                          {/* Icon would go here */}
                          🎨
                        </div>
                        {formData.selectedThemes.includes(theme.name) && (
                          <Check className="w-4 h-4 text-violet-600" />
                        )}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{theme.display_name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{theme.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {theme.collection_count} collections
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Set Collection Filters</h3>
                <p className="text-gray-600 mb-6">
                  Define criteria to automatically include puzzles that match your collection theme.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Piece Count Range</Label>
                  <div className="px-3">
                    <Slider
                      value={[formData.filters.pieceCountMin, formData.filters.pieceCountMax]}
                      onValueChange={([min, max]) => 
                        setFormData({
                          ...formData,
                          filters: { ...formData.filters, pieceCountMin: min, pieceCountMax: max }
                        })
                      }
                      min={50}
                      max={5000}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{formData.filters.pieceCountMin} pieces</span>
                      <span>{formData.filters.pieceCountMax} pieces</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Year Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="From"
                        value={formData.filters.yearMin}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: { ...formData.filters, yearMin: parseInt(e.target.value) || 1990 }
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="To"
                        value={formData.filters.yearMax}
                        onChange={(e) => setFormData({
                          ...formData,
                          filters: { ...formData.filters, yearMax: parseInt(e.target.value) || new Date().getFullYear() }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Preview Your Collection</h3>
                <p className="text-gray-600 mb-6">
                  Here's what your collection will look like based on your selected criteria.
                </p>
              </div>

              {/* Collection Summary */}
              <Card className="bg-gradient-to-r from-violet-50 to-purple-50">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-2">{formData.name}</h4>
                  <p className="text-gray-600 mb-4">{formData.description}</p>
                  <div className="flex gap-2 mb-4">
                    {formData.selectedThemes.map(theme => (
                      <Badge key={theme} variant="secondary">{theme}</Badge>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    <div>Piece Count: {formData.filters.pieceCountMin} - {formData.filters.pieceCountMax}</div>
                    <div>Years: {formData.filters.yearMin} - {formData.filters.yearMax}</div>
                    <div>Visibility: {VISIBILITY_OPTIONS.find(v => v.value === formData.visibility)?.label}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Puzzles */}
              <div>
                <h5 className="font-medium mb-4">Matching Puzzles Preview</h5>
                {previewLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewPuzzles.slice(0, 6).map((puzzle: any) => (
                      <Card key={puzzle.id} className="overflow-hidden">
                        <img 
                          src={puzzle.image_url}
                          alt={puzzle.title}
                          className="w-full h-32 object-cover"
                        />
                        <CardContent className="p-3">
                          <h6 className="text-sm font-medium truncate">{puzzle.title}</h6>
                          <p className="text-xs text-gray-500">{puzzle.piece_count} pieces</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {previewPuzzles.length === 0 && !previewLoading && (
                  <p className="text-center text-gray-500 py-8">
                    No puzzles match your current criteria. Try adjusting your filters.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {STEPS.length}
          </div>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Collection
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}