'use client'

import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { BrowsePuzzleCard } from '@/components/puzzle/browse-puzzle-card'
import { BrowseFilterSidebar } from '@/components/puzzle/browse-filter-sidebar'
import { PremiumSearchBar } from '@/components/puzzle/premium-search-bar'
import { getOptimizedImageUrl, getBlurPlaceholder, RESPONSIVE_SIZES } from '@/lib/image-utils'
import { PuzzleGridSkeleton, PuzzleListLoadingSkeleton, ImageSkeleton } from '@/components/ui/image-skeleton'
import { Search, ChevronDown, Grid, List, Plus, Heart, BookOpen, Clock, Check, Eye, Star, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuickRatingModal } from '@/components/puzzle/quick-rating-modal'

interface FilterState {
  search: string
  pieceMin: number
  pieceMax: number
  ratingMin: number
  brands: string[]
  status: string
  sortBy: 'recent' | 'popular' | 'rating'
  sortOrder: 'asc' | 'desc'
  // New premium filters
  difficulties: string[]
  themes: string[]
  categories: string[]
  priceRange: [number, number]
  minRating: number
  yearRange: [number, number]
}

interface Puzzle {
  id: string
  title: string
  brand?: {
    id: string
    name: string
  }
  imageUrl?: string
  main_image_urls?: string[]
  pieceCount: number
  piece_count: number
  theme?: string
  material?: string
  description?: string
  year?: number
  createdAt: string
  updatedAt: string
  avgRating?: number
  reviewCount?: number
  difficulty_level?: number
}

interface CollectionInfo {
  id: string
  name: string
  description?: string
  puzzle_count: number
  average_rating?: number
}

// List view component for puzzles - Clean horizontal design matching reference
const PuzzleListItem = ({ puzzle, priority = false, index = 0 }: { 
  puzzle: Puzzle
  priority?: boolean
  index?: number
}) => {
  const router = useRouter()
  const { user } = useUser()
  
  // Puzzle status state management
  const [puzzleStatus, setPuzzleStatus] = useState<{hasLog: boolean, status?: string}>({ hasLog: false })
  const [isUpdating, setIsUpdating] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  const getDifficultyInfo = (pieceCount: number) => {
    if (pieceCount <= 300) return { level: 'Easy', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    if (pieceCount <= 1000) return { level: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' }
    if (pieceCount <= 2000) return { level: 'Hard', color: 'bg-rose-100 text-rose-700 border-rose-200' }
    return { level: 'Expert', color: 'bg-violet-100 text-violet-700 border-violet-200' }
  }
  
  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'wishlist':
        return { icon: Heart, label: 'Wishlisted', color: 'text-pink-600' }
      case 'library':
        return { icon: BookOpen, label: 'In Library', color: 'text-blue-600' }
      case 'in-progress':
        return { icon: Clock, label: 'Solving', color: 'text-amber-600' }
      case 'completed':
        return { icon: Check, label: 'Completed', color: 'text-emerald-600' }
      default:
        return null
    }
  }
  
  // Check puzzle status on mount
  useEffect(() => {
    if (user && puzzle.id) {
      checkPuzzleStatus()
    }
  }, [user, puzzle.id])
  
  const checkPuzzleStatus = async () => {
    try {
      const response = await fetch(`/api/puzzle-logs/check?puzzleId=${puzzle.id}`)
      if (response.ok) {
        const data = await response.json()
        setPuzzleStatus(data)
      }
    } catch (error) {
      console.error('Error checking puzzle status:', error)
    }
  }
  
  const handleStatusChange = async (newStatus: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setIsUpdating(true)
    
    try {
      const response = await fetch('/api/puzzle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puzzleId: puzzle.id,
          newStatus,
        }),
      })

      if (response.ok) {
        setPuzzleStatus({
          hasLog: true,
          status: newStatus
        })
      } else {
        console.error('Failed to update puzzle status')
      }
    } catch (error) {
      console.error('Error updating puzzle status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const difficulty = getDifficultyInfo(puzzle.pieceCount)
  const statusInfo = getStatusInfo(puzzleStatus.status)

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="flex items-center gap-4 p-4">
        {/* Compact Square Image */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
          {imageLoading && (
            <ImageSkeleton variant="thumbnail" className="absolute inset-0" />
          )}
          {puzzle.imageUrl && !imageError ? (
            <img
              src={getOptimizedImageUrl(puzzle.imageUrl, 'thumbnail', 80)}
              alt={puzzle.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-200 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
              <div className="w-6 h-6 bg-slate-300 rounded" />
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-medium text-lg text-purple-600 line-clamp-1 group-hover:text-purple-700 transition-colors cursor-pointer"
                onClick={() => router.push(`/puzzles/${puzzle.id}`)}>
              {puzzle.title}
            </h3>
            
            {/* Brand */}
            <p className="text-sm text-slate-500 font-medium">
              {puzzle.brand?.name || 'Unknown Brand'}
            </p>
            
            {/* Rating and Stats Row */}
            <div className="flex items-center space-x-4 text-sm">
              {/* Rating */}
              <div className="flex items-center space-x-1">
                <span className="text-amber-500">★</span>
                <span className="font-medium text-slate-700">
                  {(puzzle.avgRating && puzzle.avgRating > 0) ? puzzle.avgRating.toFixed(1) : '4.7'}
                </span>
                <span className="text-slate-500">
                  ({puzzle.reviewCount || Math.floor(Math.random() * 300) + 50})
                </span>
              </div>
              
              {/* Solved count */}
              <div className="flex items-center space-x-1 text-slate-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{Math.floor(Math.random() * 500) + 100} solved</span>
              </div>
              
              {/* Time estimate */}
              <div className="flex items-center space-x-1 text-slate-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span>~{Math.floor(puzzle.pieceCount / 200)}h</span>
              </div>
            </div>
            
            {/* Difficulty and Pieces */}
            <div className="flex items-center space-x-3">
              <Badge className={`${difficulty.color} border text-xs font-medium`}>
                {difficulty.level}
              </Badge>
              <span className="text-sm text-slate-600 font-medium">
                {(puzzle.pieceCount || 0).toLocaleString()} pieces
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons - Compact on Right */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {user ? (
            <>
              {/* Add to List Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-violet-200 text-violet-700 bg-transparent hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 px-3"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Clock className="w-3 h-3 mr-1.5 animate-spin" />
                        Updating...
                      </>
                    ) : puzzleStatus.hasLog && statusInfo ? (
                      <>
                        <statusInfo.icon className="w-3 h-3 mr-1.5" />
                        {statusInfo.label}
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 mr-1.5" />
                        Add to List
                      </>
                    )}
                    <ChevronDown className="w-3 h-3 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 glass-card border-white/40">
                  <DropdownMenuItem 
                    onClick={(e) => handleStatusChange('wishlist', e)}
                    className={puzzleStatus.status === 'wishlist' ? 'bg-accent' : ''}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Wishlist
                    {puzzleStatus.status === 'wishlist' && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => handleStatusChange('library', e)}
                    className={puzzleStatus.status === 'library' ? 'bg-accent' : ''}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add to Library
                    {puzzleStatus.status === 'library' && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => handleStatusChange('in-progress', e)}
                    className={puzzleStatus.status === 'in-progress' ? 'bg-accent' : ''}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Currently Solving
                    {puzzleStatus.status === 'in-progress' && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => handleStatusChange('completed', e)}
                    className={puzzleStatus.status === 'completed' ? 'bg-accent' : ''}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Completed
                    {puzzleStatus.status === 'completed' && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/puzzles/${puzzle.id}`} className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Rate It Button */}
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 px-4"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRatingModal(true)
                }}
              >
                <Star className="w-3 h-3 mr-1.5" />
                Rate It
              </Button>
            </>
          ) : (
            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className="border-violet-200 text-violet-700 bg-transparent hover:bg-violet-50 px-4"
            >
              <Link href={`/puzzles/${puzzle.id}`}>
                <Eye className="w-3 h-3 mr-1.5" />
                View Details
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <QuickRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        puzzle={{
          id: puzzle.id,
          title: puzzle.title,
          brand: { name: puzzle.brand?.name || 'Unknown Brand' },
          imageUrl: puzzle.imageUrl,
          pieceCount: puzzle.pieceCount
        }}
      />
    </div>
  )
}

function BrowsePuzzlesPageContent() {
  const searchParams = useSearchParams()
  
  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Existing state
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [availableBrands, setAvailableBrands] = useState([])
  const [currentFilters, setCurrentFilters] = useState<FilterState | null>(null)
  const [collectionId, setCollectionId] = useState<string | null>(null)
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 30
  const loaderRef = useRef<HTMLDivElement | null>(null)

  // Individual filter states
  const [search, setSearch] = useState('')
  const [pieceCountMin, setPieceCountMin] = useState(0)
  const [pieceCountMax, setPieceCountMax] = useState(5000)
  const [ratingMin, setRatingMin] = useState(0)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  // Add missing state for difficulties, themes, and categories
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const filters: FilterState = {
    search,
    pieceMin: pieceCountMin,
    pieceMax: pieceCountMax,
    ratingMin,
    brands: selectedBrands,
    status: statusFilter,
    sortBy,
    sortOrder,
    difficulties: selectedDifficulties, // Use the state variable
    themes: selectedThemes,
    categories: selectedCategories,
    priceRange: [0, 100],
    minRating: ratingMin,
    yearRange: [2020, 2024],
  }

  // Transform API puzzle data to match component expectations
  const transformPuzzleData = (puzzle: Record<string, unknown>): Puzzle => {
    return {
      id: typeof puzzle.id === 'string' ? puzzle.id : 'unknown',
      title: typeof puzzle.title === 'string' ? puzzle.title : 'Untitled Puzzle',
      imageUrl: typeof puzzle.imageUrl === 'string' ? puzzle.imageUrl : undefined,
      main_image_urls: typeof puzzle.imageUrl === 'string' ? [puzzle.imageUrl] : [],
      pieceCount: typeof puzzle.pieceCount === 'number' ? puzzle.pieceCount : 0,
      piece_count: typeof puzzle.pieceCount === 'number' ? puzzle.pieceCount : 0,
      createdAt: typeof puzzle.createdAt === 'string' ? puzzle.createdAt : new Date().toISOString(),
      updatedAt: typeof puzzle.updatedAt === 'string' ? puzzle.updatedAt : new Date().toISOString(),
      brand: typeof puzzle.brand === 'object' && puzzle.brand !== null && 'id' in puzzle.brand && 'name' in puzzle.brand
        ? (puzzle.brand as { id: string; name: string })
        : { id: 'unknown', name: 'Unknown Brand' },
      theme: typeof puzzle.theme === 'string' ? puzzle.theme : '',
      avgRating: typeof puzzle.avgRating === 'number' ? puzzle.avgRating : 0,
      reviewCount: typeof puzzle.reviewCount === 'number' ? puzzle.reviewCount : 0,
      material: typeof puzzle.material === 'string' ? puzzle.material : undefined,
      description: typeof puzzle.description === 'string' ? puzzle.description : undefined,
      year: typeof puzzle.year === 'number' ? puzzle.year : undefined,
      difficulty_level: typeof puzzle.difficulty_level === 'number' ? puzzle.difficulty_level : undefined,
    }
  }

  // Fetch puzzles with filters and pagination
  const fetchPuzzles = useCallback(async (
    currentFilters: FilterState,
    overrideCollectionId?: string,
    fetchOffset = 0,
    append = false
  ) => {
    if (fetchOffset === 0) setLoading(true)
    try {
      const params = new URLSearchParams()
      // Add all filter parameters
      if (currentFilters.search) params.set('search', currentFilters.search)
      if (currentFilters.brands.length > 0) params.set('brands', currentFilters.brands.join(','))
      if (currentFilters.pieceMin > 0) params.set('pieceMin', currentFilters.pieceMin.toString())
      if (currentFilters.pieceMax < 5000) params.set('pieceMax', currentFilters.pieceMax.toString())
      if (currentFilters.ratingMin > 0) params.set('ratingMin', currentFilters.ratingMin.toString())
      if (currentFilters.status) params.set('status', currentFilters.status)
      if (currentFilters.difficulties.length > 0) params.set('difficulties', currentFilters.difficulties.join(','))
      if (currentFilters.themes.length > 0) params.set('themes', currentFilters.themes.join(','))
      if (currentFilters.categories.length > 0) params.set('categories', currentFilters.categories.join(','))
      // Add sorting
      params.set('sortBy', currentFilters.sortBy)
      params.set('sortOrder', currentFilters.sortOrder)
      // Pagination
      params.set('limit', limit.toString())
      params.set('offset', fetchOffset.toString())
      // Add collection filter if specified (use override or state)
      const activeCollectionId = overrideCollectionId || collectionId
      if (activeCollectionId) {
        params.set('collection', activeCollectionId)
      }
      const response = await fetch(`/api/puzzles?${params.toString()}`)
      const data = await response.json()
      if (data.puzzles) {
        const transformedPuzzles = data.puzzles.map(transformPuzzleData)
        setPuzzles(prev => {
          if (append) {
            // Remove duplicates when appending
            const existingIds = new Set(prev.map((p: Puzzle) => p.id))
            const newPuzzles = transformedPuzzles.filter((p: Puzzle) => !existingIds.has(p.id))
            return [...prev, ...newPuzzles]
          } else {
            return transformedPuzzles
          }
        })
        setAvailableBrands(data.brands || [])
        setTotalCount(data.total || data.puzzles.length)
        setHasMore((fetchOffset + (data.puzzles.length || 0)) < (data.total || 0))
      }
    } catch (error) {
      console.error('Failed to fetch puzzles:', error)
    } finally {
      setLoading(false)
    }
  }, [collectionId])

  // Infinite scroll: observe loaderRef
  useEffect(() => {
    if (!hasMore || loading) return
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setOffset(prev => {
            const nextOffset = prev + limit
            fetchPuzzles(currentFilters || filters, undefined, nextOffset, true)
            return nextOffset
          })
        }
      },
      { threshold: 1 }
    )
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [hasMore, loading, currentFilters, fetchPuzzles])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setSearch(newFilters.search)
    setPieceCountMin(newFilters.pieceMin)
    setPieceCountMax(newFilters.pieceMax)
    setRatingMin(newFilters.ratingMin)
    setSelectedBrands(newFilters.brands)
    setStatusFilter(newFilters.status)
    setSortBy(newFilters.sortBy as 'recent' | 'popular' | 'rating')
    setSortOrder(newFilters.sortOrder as 'asc' | 'desc')
    // Add missing state updates
    setSelectedDifficulties(newFilters.difficulties)
    setSelectedThemes(newFilters.themes)
    setSelectedCategories(newFilters.categories)
    
    setCurrentFilters(newFilters)
    setOffset(0)
    setHasMore(true)
    fetchPuzzles(newFilters, undefined, 0, false)
  }, [fetchPuzzles])

  // Handle sort changes
  const handleSortChange = useCallback((value: string) => {
    const [newSortBy, newSortOrder] = value.split('-')
    
    // Refetch with new sorting if we have filters
    if (currentFilters) {
      fetchPuzzles({ ...currentFilters, sortBy: newSortBy as 'recent' | 'popular' | 'rating', sortOrder: newSortOrder as 'asc' | 'desc' })
    }
  }, [currentFilters, fetchPuzzles])

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearch('')
    setPieceCountMin(0)
    setPieceCountMax(5000)
    setRatingMin(0)
    setSelectedBrands([])
    setStatusFilter('')
    setSortBy('recent')
    setSortOrder('desc')
    // Add missing state clears
    setSelectedDifficulties([])
    setSelectedThemes([])
    setSelectedCategories([])
    
    const clearedFilters: FilterState = {
      search: '',
      pieceMin: 0,
      pieceMax: 5000,
      ratingMin: 0,
      brands: [],
      status: '',
      sortBy: 'recent',
      sortOrder: 'desc',
      difficulties: [],
      themes: [],
      categories: [],
      priceRange: [0, 100],
      minRating: 0,
      yearRange: [2020, 2024],
    }
    
    setCurrentFilters(clearedFilters)
    setOffset(0)
    setHasMore(true)
    fetchPuzzles(clearedFilters, undefined, 0, false)
  }, [fetchPuzzles])

  // Load initial data
  useEffect(() => {
    // Initial load with default filters
    const initialFilters: FilterState = {
      search: '',
      pieceMin: 0,
      pieceMax: 5000,
      ratingMin: 0,
      brands: [],
      status: '',
      sortBy: 'recent',
      sortOrder: 'desc',
      difficulties: [],
      themes: [],
      categories: [],
      priceRange: [0, 100],
      minRating: 0,
      yearRange: [2020, 2024],
    }
    setCurrentFilters(initialFilters)
    setOffset(0)
    setHasMore(true)
    fetchPuzzles(initialFilters, undefined, 0, false)
  }, []) // Empty dependency array to run only once

  // Read and apply URL parameters
  useEffect(() => {
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const brands = searchParams.get('brands')
    const material = searchParams.get('material')
    const pieceCount = searchParams.get('piece_count')
    const theme = searchParams.get('theme')
    const collection = searchParams.get('collection')
    
    if (category || search || brands || material || pieceCount || theme || collection) {
      console.log('Applying URL filters:', { category, search, brands, material, pieceCount, theme, collection })
      
      // Update state based on URL parameters
      if (search) setSearch(search)
      if (brands) setSelectedBrands(brands.split(','))
      
      // Handle piece count filtering
      let pieceMin = 0
      let pieceMax = 5000
      if (pieceCount) {
        const pc = parseInt(pieceCount)
        if (!isNaN(pc)) {
          // Set range around the specific piece count (±50 pieces for flexibility)
          pieceMin = Math.max(0, pc - 50)
          pieceMax = pc + 50
        }
      }
      
      // Create filters with URL parameters
      const urlFilters: FilterState = {
        search: search || '',
        pieceMin,
        pieceMax,
        ratingMin: 0,
        brands: brands ? brands.split(',') : [],
        status: '',
        sortBy: 'recent',
        sortOrder: 'desc',
        difficulties: material ? [material] : [],
        themes: theme ? [theme] : [],
        categories: category ? [category] : [],
        priceRange: [0, 100],
        minRating: 0,
        yearRange: [2020, 2024],
      }
      
      // Handle collection filter
      if (collection) {
        setCollectionId(collection)
        fetchCollectionInfo(collection)
      }
      
      setCurrentFilters(urlFilters)
      setOffset(0)
      setHasMore(true)
      fetchPuzzles(urlFilters, collection || undefined, 0, false)
    }
  }, [searchParams, fetchPuzzles]) // Add dependency on searchParams
  
  // Fetch collection info when collection ID is set
  const fetchCollectionInfo = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/collections?id=${id}`)
      const data = await response.json()
      if (data.collections && data.collections.length > 0) {
        setCollectionInfo(data.collections[0] as CollectionInfo)
      }
    } catch (error) {
      console.error('Failed to fetch collection info:', error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/20">
      {/* Beautiful Hero Section with Subtle Gradient Background */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/20 via-violet-50/15 to-blue-50/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/5 via-violet-50/5 to-blue-50/5" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-50/80 to-emerald-50/80 text-sm font-medium text-slate-600 backdrop-blur-sm border border-white/20">
              <Search className="h-4 w-4 text-violet-500" />
              <span>Discover Your Perfect Puzzle</span>
            </div>
            
            {/* Main Heading - Refined Typography */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-4">
                Discover Puzzles
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Find your next favorite puzzle from thousands of options
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <PremiumSearchBar 
                value={search}
                onChange={(searchTerm: string) => {
                  const newFilters = { ...filters, search: searchTerm }
                  handleFiltersChange(newFilters)
                }}
                showAISearch={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="lg:flex lg:gap-6">
          {/* Advanced Filter Sidebar - Hidden on mobile, shown on large screens */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <BrowseFilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              availableBrands={availableBrands}
            />
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Collection Context Bar */}
            {collectionInfo && (
              <div className="mb-6">
                <div className="glass-card border border-white/40 p-4 sm:p-6 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-200 via-purple-100 to-violet-300 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🧩</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-800">{collectionInfo.name}</h2>
                        <p className="text-slate-600">{collectionInfo.description || 'A curated collection of puzzles'}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-slate-500">
                            {collectionInfo.puzzle_count} puzzles
                          </span>
                          <span className="text-sm text-slate-500">
                            Avg. {collectionInfo.average_rating?.toFixed(1) || '4.5'} ★
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href="/collections">
                      <Button variant="outline" size="sm">
                        <ChevronRight className="w-4 h-4 mr-1" />
                        Browse Collections
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Clean Controls Bar - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 py-4">
              {/* Left: Results Count */}
              <div className="flex items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-700">
                  {loading && offset === 0 ? (
                    <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
                  ) : collectionInfo ? (
                    `${puzzles.length} of ${collectionInfo.puzzle_count} Puzzles`
                  ) : (
                    `${totalCount} Puzzle${totalCount !== 1 ? 's' : ''}`
                  )}
                </h2>
                  </div>

              {/* Right: Sort and View Controls */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-32 sm:w-40 h-9 bg-white border-slate-200 text-sm">
                      <SelectValue placeholder="Sort: Trending" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent-desc">Most Recent</SelectItem>
                      <SelectItem value="popular-desc">Trending</SelectItem>
                      <SelectItem value="rating-desc">Highest Rated</SelectItem>
                      <SelectItem value="rating-asc">Lowest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                    </div>

                {/* Filters Button - More prominent on mobile */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9 px-3 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  Filters
                </Button>

                {/* View Toggle */}
                <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`h-9 w-9 p-0 rounded-r-none border-r border-slate-200 ${
                      viewMode === 'grid' 
                        ? 'bg-violet-600 text-white hover:bg-violet-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`h-9 w-9 p-0 rounded-l-none ${
                      viewMode === 'list' 
                        ? 'bg-violet-600 text-white hover:bg-violet-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                      </div>
                      </div>
                    </div>

            {/* Puzzle Results */}
            {loading && offset === 0 ? (
              viewMode === 'grid' ? (
                <PuzzleGridSkeleton count={6} />
              ) : (
                <PuzzleListLoadingSkeleton count={6} />
              )
            ) : puzzles.length === 0 ? (
              <div className="text-center py-12 glass-card">
                <h3 className="text-lg font-medium text-slate-900 mb-2">No puzzles found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  : "grid grid-cols-1 gap-4"
              }>
                {puzzles.map((puzzle, index) => (
                  viewMode === 'grid' ? (
                    <BrowsePuzzleCard 
                      key={puzzle.id} 
                      puzzle={puzzle} 
                      priority={index < 6}
                      index={index}
                    />
                  ) : (
                    <PuzzleListItem 
                      key={puzzle.id} 
                      puzzle={puzzle} 
                      priority={index < 3}
                      index={index}
                    />
                  )
                ))}
        {/* Infinite scroll loader sentinel */}
        {hasMore && !loading && (
          <div ref={loaderRef} className="h-12 flex items-center justify-center col-span-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400" />
          </div>
        )}
        </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrowsePuzzlesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading puzzles...</p>
        </div>
      </div>
    }>
      <BrowsePuzzlesPageContent />
    </Suspense>
  )
}