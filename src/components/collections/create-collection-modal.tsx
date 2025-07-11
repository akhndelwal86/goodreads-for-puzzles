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
  { id: 'theme', title: 'Select Theme', description: 'Choose a category for your collection' },
  { id: 'puzzles', title: 'Add Puzzles', description: 'Select puzzles to add (max 10)' },
  { id: 'preview', title: 'Preview', description: 'Review your collection before creating' }
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
    selectedTheme: '',
    filters: {
      pieceCountMin: 100,
      pieceCountMax: 2000,
      brands: [] as string[],
      yearMin: 1990,
      yearMax: new Date().getFullYear()
    },
    selectedPuzzles: [] as string[]
  })

  // Load themes on mount
  useEffect(() => {
    if (isOpen) {
      loadThemes()
    }
  }, [isOpen])

  // Load puzzles when on puzzle selection step
  useEffect(() => {
    if (currentStep === 2 && formData.selectedTheme) {
      loadFilteredPuzzles()
    }
  }, [currentStep, formData.selectedTheme])

  const loadThemes = async () => {
    try {
      const response = await fetch('/api/collections/themes')
      const data = await response.json()
      setThemes(data.themes || [])
    } catch (error) {
      console.error('Error loading themes:', error)
    }
  }

  const loadFilteredPuzzles = async () => {
    setPreviewLoading(true)
    try {
      // Build query parameters based on filters
      const params = new URLSearchParams()
      if (formData.selectedTheme) {
        params.append('themes', formData.selectedTheme)
      }
      params.append('pieceMin', formData.filters.pieceCountMin.toString())
      params.append('pieceMax', formData.filters.pieceCountMax.toString())
      if (formData.filters.brands.length > 0) {
        params.append('brands', formData.filters.brands.join(','))
      }
      params.append('limit', '50') // Get more puzzles for selection

      const response = await fetch(`/api/puzzles?${params}`)
      const data = await response.json()
      setPreviewPuzzles(data.puzzles || [])
    } catch (error) {
      console.error('Error loading puzzles:', error)
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

  const handleThemeSelect = (themeName: string) => {
    setFormData({
      ...formData,
      selectedTheme: themeName
    })
  }

  const handlePuzzleToggle = (puzzleId: string) => {
    if (formData.selectedPuzzles.includes(puzzleId)) {
      setFormData({
        ...formData,
        selectedPuzzles: formData.selectedPuzzles.filter(id => id !== puzzleId)
      })
    } else if (formData.selectedPuzzles.length < 10) {
      setFormData({
        ...formData,
        selectedPuzzles: [...formData.selectedPuzzles, puzzleId]
      })
    }
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
          theme: formData.selectedTheme,
          visibility: 'public',
          puzzleIds: formData.selectedPuzzles
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
      selectedTheme: '',
      filters: {
        pieceCountMin: 100,
        pieceCountMax: 2000,
        brands: [],
        yearMin: 1990,
        yearMax: new Date().getFullYear()
      },
      selectedPuzzles: []
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
      case 1: return formData.selectedTheme !== ''
      case 2: return formData.selectedPuzzles.length > 0
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

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> Choose a clear, descriptive name that tells others what puzzles they'll find in this collection.
                </p>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Choose a Theme for Your Collection</h3>
                <p className="text-gray-600 mb-6">
                  Select one theme that best represents your collection. This helps others discover your collection.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'art', display_name: 'Art', description: 'Famous paintings and artistic puzzles', icon: '🎨' },
                  { name: 'nature', display_name: 'Nature', description: 'Landscapes, wildlife, and natural beauty', icon: '🏔️' },
                  { name: 'animals', display_name: 'Animals', description: 'Cute creatures and wildlife', icon: '🦁' },
                  { name: 'fantasy', display_name: 'Fantasy', description: 'Magical worlds and imagination', icon: '🏰' },
                  { name: 'vintage', display_name: 'Vintage', description: 'Classic and nostalgic themes', icon: '🕰️' },
                  { name: 'travel', display_name: 'Travel', description: 'Places and destinations', icon: '🗺️' }
                ].map((theme) => (
                  <Card
                    key={theme.name}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      formData.selectedTheme === theme.name
                        ? "ring-2 ring-violet-600 bg-violet-50"
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => handleThemeSelect(theme.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl">
                          {theme.icon}
                        </div>
                        {formData.selectedTheme === theme.name && (
                          <Check className="w-4 h-4 text-violet-600" />
                        )}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{theme.display_name}</h4>
                      <p className="text-xs text-gray-500">{theme.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Select Puzzles for Your Collection</h3>
                <p className="text-gray-600 mb-4">
                  Choose up to 10 puzzles to add to your collection. You can always add more later.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-sm">
                    {formData.selectedPuzzles.length}/10 puzzles selected
                  </Badge>
                  {formData.selectedPuzzles.length >= 10 && (
                    <span className="text-sm text-amber-600">Maximum puzzles selected</span>
                  )}
                </div>
              </div>

              {previewLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
                </div>
              ) : previewPuzzles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No puzzles found matching your theme. Try selecting a different theme.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {previewPuzzles.map((puzzle: any) => (
                    <Card
                      key={puzzle.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 overflow-hidden",
                        formData.selectedPuzzles.includes(puzzle.id)
                          ? "ring-2 ring-violet-600 bg-violet-50"
                          : "hover:shadow-md"
                      )}
                      onClick={() => handlePuzzleToggle(puzzle.id)}
                    >
                      <div className="relative">
                        <img 
                          src={puzzle.imageUrl || '/placeholder-puzzle.svg'}
                          alt={puzzle.title}
                          className="w-full h-32 object-cover"
                        />
                        {formData.selectedPuzzles.includes(puzzle.id) && (
                          <div className="absolute top-2 right-2 bg-violet-600 text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <h6 className="text-sm font-medium truncate">{puzzle.title}</h6>
                        <p className="text-xs text-gray-500">{puzzle.pieceCount} pieces</p>
                        {puzzle.brand && (
                          <p className="text-xs text-gray-400">{puzzle.brand.name}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Review Your Collection</h3>
                <p className="text-gray-600 mb-6">
                  Here's what your collection will look like. You can go back to make changes if needed.
                </p>
              </div>

              {/* Collection Summary */}
              <Card className="bg-gradient-to-r from-violet-50 to-purple-50">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold mb-2">{formData.name}</h4>
                  {formData.description && (
                    <p className="text-gray-600 mb-4">{formData.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="secondary">
                      {formData.selectedTheme}
                    </Badge>
                    <span className="text-gray-500">
                      {formData.selectedPuzzles.length} puzzles
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Puzzles */}
              <div>
                <h5 className="font-medium mb-4">Selected Puzzles ({formData.selectedPuzzles.length})</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewPuzzles
                    .filter((puzzle: any) => formData.selectedPuzzles.includes(puzzle.id))
                    .map((puzzle: any) => (
                      <Card key={puzzle.id} className="overflow-hidden">
                        <img 
                          src={puzzle.imageUrl || '/placeholder-puzzle.svg'}
                          alt={puzzle.title}
                          className="w-full h-32 object-cover"
                        />
                        <CardContent className="p-3">
                          <h6 className="text-sm font-medium truncate">{puzzle.title}</h6>
                          <p className="text-xs text-gray-500">{puzzle.pieceCount} pieces</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
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