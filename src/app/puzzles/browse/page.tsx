'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react'
import { BrowsePuzzleCard } from '@/components/puzzle/browse-puzzle-card'
import { BrowseFilterSidebar } from '@/components/puzzle/browse-filter-sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

interface Puzzle {
  id: string
  title: string
  brand?: {
    id: string
    name: string
  }
  imageUrl?: string
  pieceCount: number
  theme?: string
  material?: string
  description?: string
  year?: number
  createdAt: string
  updatedAt: string
  avgRating?: number
  reviewCount?: number
}

interface Brand {
  id: string
  name: string
  count: number
}

export default function BrowsePuzzlesPage() {
  const { user } = useUser()
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [availableBrands, setAvailableBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPuzzles, setTotalPuzzles] = useState(0)
  const [currentFilters, setCurrentFilters] = useState<FilterState | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Sort options for the dropdown
  const sortOptions = [
    { value: 'recent', label: 'Recently Added', order: 'desc' },
    { value: 'popular', label: 'Most Popular', order: 'desc' },
    { value: 'rating', label: 'Highest Rated', order: 'desc' },
  ]

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Recently Added'
  
  // Fetch puzzles with filters
  const fetchPuzzles = useCallback(async (filters: FilterState, currentSortBy?: string, currentSortOrder?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Add filter parameters
      if (filters.search) params.set('search', filters.search)
      if (filters.brands.length > 0) params.set('brands', filters.brands.join(','))
      if (filters.pieceCountMin > 0) params.set('pieceMin', filters.pieceCountMin.toString())
      if (filters.pieceCountMax < 5000) params.set('pieceMax', filters.pieceCountMax.toString())
      if (filters.difficultyMin > 1) params.set('diffMin', filters.difficultyMin.toString())
      if (filters.difficultyMax < 5) params.set('diffMax', filters.difficultyMax.toString())
      if (filters.ratingMin > 1) params.set('ratingMin', filters.ratingMin.toString())
      if (filters.status.length > 0) params.set('status', filters.status.join(','))
      if (filters.ratedOnly) params.set('ratedOnly', 'true')
      
      // Add sorting parameters from local state (not from filters)
      params.set('sortBy', currentSortBy || sortBy)
      params.set('sortOrder', currentSortOrder || sortOrder)
      
      const response = await fetch(`/api/puzzles?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch puzzles')
      }
      
          const data = await response.json()
      setPuzzles(data.puzzles || [])
      setTotalPuzzles(data.total || data.puzzles?.length || 0)
      
      // Extract unique brands with counts for filtering
      if (data.brands) {
        setAvailableBrands(data.brands)
        }
      } catch (error) {
      console.error('Error fetching puzzles:', error)
      setPuzzles([])
      setTotalPuzzles(0)
      } finally {
        setLoading(false)
      }
  }, [sortBy, sortOrder])

  // Handle filter changes
  const handleFiltersChange = useCallback((filters: FilterState) => {
    setCurrentFilters(filters)
    fetchPuzzles(filters)
  }, [fetchPuzzles])

  // Handle sort changes
  const handleSortChange = useCallback((newSortBy: string) => {
    const newSortOrder = sortOptions.find(opt => opt.value === newSortBy)?.order || 'desc'
    setSortBy(newSortBy as any)
    setSortOrder(newSortOrder as any)
    
    // Refetch with new sorting if we have filters
    if (currentFilters) {
      fetchPuzzles(currentFilters, newSortBy, newSortOrder)
    }
  }, [currentFilters, fetchPuzzles, sortOptions])

  // Load initial data
  useEffect(() => {
    // Initial load with default filters will be handled by the sidebar
    // when it loads filters from URL params
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-emerald-50/20">
      <div className="max-w-7xl mx-auto">
        {/* Premium Glass Header */}
        <div className="glass-card border-white/30 px-6 py-6 mb-6 mx-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Browse Puzzles</h1>
              <p className="text-slate-600">
                Discover your next favorite jigsaw puzzle from our premium collection
              </p>
            </div>
            
            {/* Enhanced Controls */}
            <div className="flex items-center gap-4">
              {/* Premium Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="glass-button flex items-center gap-2 px-4 py-2">
                    <span className="text-sm font-medium">Sort: {currentSortLabel}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass-card border-white/40">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={sortBy === option.value ? 'bg-violet-50 text-violet-700' : ''}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Enhanced View Toggle */}
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-glass' : 'hover:bg-white/80'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-glass' : 'hover:bg-white/80'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6 mx-6">
          {/* Enhanced Sidebar */}
          <div className="w-80">
            <div className="glass-card border-white/30">
              <BrowseFilterSidebar
                onFiltersChange={handleFiltersChange}
                availableBrands={availableBrands}
                totalPuzzles={totalPuzzles}
                isLoading={loading}
              />
            </div>
          </div>

          {/* Premium Content Area */}
          <div className="flex-1 pb-6">
            {loading ? (
              <div className="space-y-6">
                {/* Loading State */}
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading puzzles...</p>
                    </div>

                {/* Loading Skeleton */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border p-4">
                      <div className="aspect-square bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
                  </div>
            ) : puzzles.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No puzzles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find more puzzles.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // This will trigger a filter reset via the sidebar
                    window.location.href = '/puzzles/browse'
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              /* Puzzle Grid */
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 max-w-4xl'
              }`}>
                {puzzles.map((puzzle) => (
                  <BrowsePuzzleCard
                    key={puzzle.id}
                    puzzle={puzzle}
                    viewMode={viewMode}
                  />
          ))}
        </div>
            )}

            {/* Load More Button (for future pagination) */}
            {!loading && puzzles.length > 0 && puzzles.length < totalPuzzles && (
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  Load More Puzzles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 