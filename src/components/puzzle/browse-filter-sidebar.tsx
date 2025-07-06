'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Star,
  SlidersHorizontal,
  Trash2
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

interface FilterState {
  search: string
  brands: string[]
  pieceCountMin: number
  pieceCountMax: number
  difficultyMin: number
  difficultyMax: number
  ratingMin: number
  status: string[]
  ratedOnly: boolean
}

interface BrowseFilterSidebarProps {
  onFiltersChange: (filters: FilterState) => void
  availableBrands: Array<{ id: string; name: string; count: number }>
  totalPuzzles: number
  isLoading?: boolean
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  brands: [],
  pieceCountMin: 0,
  pieceCountMax: 5000,
  difficultyMin: 1,
  difficultyMax: 5,
  ratingMin: 1,
  status: [],
  ratedOnly: false
}

export function BrowseFilterSidebar({ 
  onFiltersChange, 
  availableBrands, 
  totalPuzzles,
  isLoading = false 
}: BrowseFilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()
  
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    brands: true,
    pieces: true,
    difficulty: true,
    rating: true,
    status: true,
    ratedOnly: true
  })

  // Load filters from URL params on mount
  useEffect(() => {
    const urlFilters: FilterState = {
      search: searchParams.get('search') || '',
      brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
      pieceCountMin: parseInt(searchParams.get('pieceMin') || '0'),
      pieceCountMax: parseInt(searchParams.get('pieceMax') || '5000'),
      difficultyMin: parseInt(searchParams.get('diffMin') || '1'),
      difficultyMax: parseInt(searchParams.get('diffMax') || '5'),
      ratingMin: parseInt(searchParams.get('ratingMin') || '1'),
      status: searchParams.get('status')?.split(',').filter(Boolean) || [],
      ratedOnly: searchParams.get('ratedOnly') === 'true'
    }
    setFilters(urlFilters)
    onFiltersChange(urlFilters)
  }, [searchParams, onFiltersChange])

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.brands.length > 0) params.set('brands', newFilters.brands.join(','))
    if (newFilters.pieceCountMin !== DEFAULT_FILTERS.pieceCountMin) params.set('pieceMin', newFilters.pieceCountMin.toString())
    if (newFilters.pieceCountMax !== DEFAULT_FILTERS.pieceCountMax) params.set('pieceMax', newFilters.pieceCountMax.toString())
    if (newFilters.difficultyMin !== DEFAULT_FILTERS.difficultyMin) params.set('diffMin', newFilters.difficultyMin.toString())
    if (newFilters.difficultyMax !== DEFAULT_FILTERS.difficultyMax) params.set('diffMax', newFilters.difficultyMax.toString())
    if (newFilters.ratingMin !== DEFAULT_FILTERS.ratingMin) params.set('ratingMin', newFilters.ratingMin.toString())
    if (newFilters.status.length > 0) params.set('status', newFilters.status.join(','))
    if (newFilters.ratedOnly) params.set('ratedOnly', 'true')

    router.push(`?${params.toString()}`, { scroll: false })
  }, [router])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
    updateURL(newFilters)
  }

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS)
    onFiltersChange(DEFAULT_FILTERS)
    router.push('/puzzles/browse', { scroll: false })
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.brands.length > 0) count++
    if (filters.pieceCountMin !== DEFAULT_FILTERS.pieceCountMin || filters.pieceCountMax !== DEFAULT_FILTERS.pieceCountMax) count++
    if (filters.difficultyMin !== DEFAULT_FILTERS.difficultyMin || filters.difficultyMax !== DEFAULT_FILTERS.difficultyMax) count++
    if (filters.ratingMin !== DEFAULT_FILTERS.ratingMin) count++
    if (filters.status.length > 0) count++
    if (filters.ratedOnly) count++
    return count
  }

  const renderStarRating = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              className={`p-1.5 hover:scale-110 transition-all duration-200 rounded-lg ${
                star <= rating ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-amber-300'
              }`}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700 ml-2">{rating}+ stars</span>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-sm border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        {/* Header - Enhanced */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">
                  {getActiveFilterCount()} active
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 px-3"
              disabled={getActiveFilterCount() === 0}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Results Count - Enhanced */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
          {isLoading ? (
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{totalPuzzles.toLocaleString()} puzzles</span>
              <span className="text-xs text-gray-500">found</span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Search - Enhanced */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('search')}
                className="flex items-center justify-between w-full text-left group py-1"
              >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Search</span>
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  {expandedSections.search ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {expandedSections.search && (
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search puzzles..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              )}
            </div>

            {/* Brands - Enhanced */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('brands')}
                className="flex items-center justify-between w-full text-left group py-1"
              >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Brands</span>
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  {expandedSections.brands ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {expandedSections.brands && (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {availableBrands.map((brand) => (
                    <label key={brand.id} className="flex items-center justify-between cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors group">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand.id)}
                          onChange={(e) => {
                            const newBrands = e.target.checked
                              ? [...filters.brands, brand.id]
                              : filters.brands.filter(id => id !== brand.id)
                            handleFilterChange('brands', newBrands)
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">{brand.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs font-medium">
                        {brand.count}
                      </Badge>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Piece Count - Enhanced */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('pieces')}
                className="flex items-center justify-between w-full text-left group py-1"
              >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Piece Count</span>
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  {expandedSections.pieces ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {expandedSections.pieces && (
                <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
                  <div className="px-2">
                    <Slider
                      value={[filters.pieceCountMin, filters.pieceCountMax]}
                      onValueChange={([min, max]) => {
                        handleFilterChange('pieceCountMin', min)
                        handleFilterChange('pieceCountMax', max)
                      }}
                      min={0}
                      max={5000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{filters.pieceCountMin.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">to</span>
                    <span className="text-sm font-semibold text-gray-900">{filters.pieceCountMax.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Difficulty - Enhanced */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('difficulty')}
                className="flex items-center justify-between w-full text-left group py-1"
              >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Difficulty</span>
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  {expandedSections.difficulty ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {expandedSections.difficulty && (
                <div className="space-y-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Minimum:</p>
                    {renderStarRating(filters.difficultyMin, (rating) => handleFilterChange('difficultyMin', rating))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Maximum:</p>
                    {renderStarRating(filters.difficultyMax, (rating) => handleFilterChange('difficultyMax', rating))}
                  </div>
                </div>
              )}
            </div>

            {/* Rating - Enhanced */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('rating')}
                className="flex items-center justify-between w-full text-left group py-1"
              >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Rating</span>
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  {expandedSections.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {expandedSections.rating && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Minimum rating:</p>
                  {renderStarRating(filters.ratingMin, (rating) => handleFilterChange('ratingMin', rating))}
                </div>
              )}
            </div>

            {/* Status (if logged in) - Enhanced */}
            {user && (
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection('status')}
                  className="flex items-center justify-between w-full text-left group py-1"
                >
                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">My Status</span>
                  <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    {expandedSections.status ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {expandedSections.status && (
                  <div className="space-y-1">
                    {[
                      { value: 'not-added', label: 'Not Added' },
                      { value: 'wishlist', label: 'Wishlist' },
                      { value: 'library', label: 'Library' },
                      { value: 'in-progress', label: 'In Progress' },
                      { value: 'completed', label: 'Completed' }
                    ].map((status) => (
                      <label key={status.value} className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-3 rounded-lg transition-colors group">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status.value)}
                          onChange={(e) => {
                            const newStatus = e.target.checked
                              ? [...filters.status, status.value]
                              : filters.status.filter(s => s !== status.value)
                            handleFilterChange('status', newStatus)
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">{status.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Rated Only - Enhanced */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('ratedOnly')}
                className="flex items-center justify-between w-full text-left group py-1"
              >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Rated Only</span>
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  {expandedSections.ratedOnly ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>
              {expandedSections.ratedOnly && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.ratedOnly}
                      onChange={(e) => handleFilterChange('ratedOnly', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    <span className="text-sm font-medium text-gray-700">Only show puzzles with reviews</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
} 