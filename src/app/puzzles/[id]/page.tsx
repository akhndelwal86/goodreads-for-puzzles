'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { 
  Star, 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Clock, 
  Users, 
  Archive,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  TrendingUp,
  Eye,
  Play,
  Edit3,
  Target,
  Award,
  Calendar,
  MapPin,
  Zap,
  Trophy,
  Activity,
  BarChart3,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
  Image as ImageIcon,
  Package,
  Ruler,
  Palette,
  Shield,
  ChevronDown,
  BookOpen,
  Check,
  Loader2
} from 'lucide-react'
import { AdvancedRatingModal } from '@/components/puzzle/advanced-rating-modal'
import { PurchaseLinks } from '@/components/puzzle/purchase-links'
import { PuzzleShare } from '@/components/puzzle/puzzle-share'

interface PuzzleDetail {
  puzzle: {
    id: string
    title: string
    piece_count: number
    image_url?: string
    theme?: string
    material?: string
    description?: string
    year_published?: number
    brand?: {
      name: string
    }
    difficulty?: string
    estimated_time?: number
    average_rating?: number
    total_ratings?: number
    puzzle_aggregates?: {
      avg_rating: number
      review_count: number
    }
    // New specification fields
    finished_size_width?: number
    finished_size_height?: number
    age_range_min?: number
    age_range_max?: number
    surface_finish?: string
    sku?: string
    included_items?: string[]
    key_features?: Array<{
      title: string
      description: string
      icon: string
    }>
    box_width?: number
    box_height?: number
    box_depth?: number
    weight_grams?: number
  }
  communityStats?: {
    timesCompleted: number
    wishlistCount: number
    averageTime: number
    communityDifficulty: number
    successRate: number
    activeSolvers: number
    totalRatings: number
    averageRating: number
  }
}

export default function PuzzleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [puzzleData, setPuzzleData] = useState<PuzzleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('details')
  const [showAdvancedRating, setShowAdvancedRating] = useState(false)
  
  // Add to List dropdown state
  const [puzzleStatus, setPuzzleStatus] = useState<{hasLog: boolean, status?: string}>({ hasLog: false })
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  
  // Activity feed state
  const [activityData, setActivityData] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(true)
  const [activityError, setActivityError] = useState<string | null>(null)
  
  // Reviews state
  const [reviewsData, setReviewsData] = useState<any>(null)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState<string | null>(null)
  
  // Related puzzles state
  const [relatedPuzzlesData, setRelatedPuzzlesData] = useState<any>(null)
  const [relatedPuzzlesLoading, setRelatedPuzzlesLoading] = useState(true)
  const [relatedPuzzlesError, setRelatedPuzzlesError] = useState<string | null>(null)
  
  // Browse similar state
  const [browseSimilarData, setBrowseSimilarData] = useState<any>(null)
  const [browseSimilarLoading, setBrowseSimilarLoading] = useState(true)
  const [browseSimilarError, setBrowseSimilarError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchPuzzleDetail(params.id as string)
      fetchActivityData(params.id as string)
      fetchReviewsData(params.id as string)
      fetchRelatedPuzzles(params.id as string)
      fetchBrowseSimilarData(params.id as string)
    }
  }, [params.id])

  // Check puzzle status when user and puzzle data are available
  useEffect(() => {
    if (user && puzzleData?.puzzle.id) {
      checkPuzzleStatus()
    }
  }, [user, puzzleData?.puzzle.id])

  const fetchPuzzleDetail = async (id: string) => {
      try {
      setLoading(true)
      const response = await fetch(`/api/puzzles/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch puzzle details')
      }
      
          const data = await response.json()
          setPuzzleData(data)
    } catch (error) {
      console.error('Error fetching puzzle:', error)
          setError('Failed to load puzzle details')
      } finally {
        setLoading(false)
      }
    }

  // Fetch activity data for the puzzle
  const fetchActivityData = async (id: string) => {
    try {
      setActivityLoading(true)
      setActivityError(null)
      const response = await fetch(`/api/puzzles/${id}/activity`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity data')
      }
      
      const data = await response.json()
      setActivityData(data.activities || [])
    } catch (error) {
      console.error('Error fetching activity:', error)
      setActivityError('Failed to load recent activity')
    } finally {
      setActivityLoading(false)
    }
  }

  // Fetch reviews data for the puzzle
  const fetchReviewsData = async (id: string) => {
    try {
      setReviewsLoading(true)
      setReviewsError(null)
      const response = await fetch(`/api/puzzles/${id}/reviews?limit=20`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews data')
      }
      
      const data = await response.json()
      setReviewsData(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviewsError('Failed to load reviews')
    } finally {
      setReviewsLoading(false)
    }
  }

  // Fetch related puzzles from the same brand
  const fetchRelatedPuzzles = async (id: string) => {
    try {
      setRelatedPuzzlesLoading(true)
      setRelatedPuzzlesError(null)
      const response = await fetch(`/api/puzzles/${id}/related?limit=4`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch related puzzles')
      }
      
      const data = await response.json()
      setRelatedPuzzlesData(data)
    } catch (error) {
      console.error('Error fetching related puzzles:', error)
      setRelatedPuzzlesError('Failed to load related puzzles')
    } finally {
      setRelatedPuzzlesLoading(false)
    }
  }

  // Fetch browse similar data 
  const fetchBrowseSimilarData = async (id: string) => {
    try {
      setBrowseSimilarLoading(true)
      setBrowseSimilarError(null)
      const response = await fetch(`/api/puzzles/browse-similar?puzzleId=${id}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Browse similar API error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch browse similar data`)
      }
      
      const data = await response.json()
      setBrowseSimilarData(data)
    } catch (error) {
      console.error('Error fetching browse similar data:', error)
      setBrowseSimilarError(error instanceof Error ? error.message : 'Failed to load browse similar data')
    } finally {
      setBrowseSimilarLoading(false)
    }
  }

  // Check current puzzle status for the user
  const checkPuzzleStatus = async () => {
    if (!user || !puzzleData?.puzzle.id) return
    
    try {
      const response = await fetch(`/api/puzzle-logs/check?puzzleId=${puzzleData.puzzle.id}`)
      if (response.ok) {
        const data = await response.json()
        setPuzzleStatus(data)
      }
    } catch (error) {
      console.error('Error checking puzzle status:', error)
    }
  }

  // Update puzzle status
  const handleStatusChange = async (newStatus: string) => {
    if (!user || !puzzleData?.puzzle.id) return
    
    setIsUpdatingStatus(true)
    try {
      const response = await fetch('/api/puzzle-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puzzleId: puzzleData.puzzle.id,
          newStatus: newStatus,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.log) {
          setPuzzleStatus({
            hasLog: true,
            status: result.log.status
          })
        }
      }
    } catch (error) {
      console.error('Error updating puzzle status:', error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Get status display info
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

  // Extract community stats from API response
  const communityStats = puzzleData?.communityStats || {
    timesCompleted: 0,
    wishlistCount: 0,
    averageTime: 0,
    communityDifficulty: 0,
    successRate: 0,
    activeSolvers: 0,
    totalRatings: 0,
    averageRating: 0
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/20 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="glass-card border-white/30 rounded-2xl p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="w-full h-96 bg-white/40 rounded-xl animate-pulse" />
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-white/40 rounded animate-pulse" />
                <div className="h-4 bg-white/40 rounded w-3/4 animate-pulse" />
                <div className="h-20 bg-white/40 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !puzzleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card border-white/30 rounded-2xl p-8 text-center">
            <h1 className="text-xl font-medium text-slate-700 mb-4">Puzzle Not Found</h1>
            <p className="text-slate-500 mb-6">This puzzle doesn't exist or has been removed.</p>
            <Link href="/puzzles/browse">
              <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800">
                Browse Puzzles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { puzzle } = puzzleData

  // Generate meta tags for social sharing
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/puzzles/${puzzle.id}`
  const shareTitle = `${puzzle.title} - ${puzzle.piece_count} Piece Puzzle by ${puzzle.brand?.name || 'Unknown Brand'}`
  const shareDescription = puzzle.description || `Discover this amazing ${puzzle.piece_count}-piece jigsaw puzzle from ${puzzle.brand?.name || 'Unknown Brand'} on Puzzlr! Check out reviews, ratings, and community insights.`

  return (
    <>
      <Head>
        <title>{shareTitle} | Puzzlr</title>
        <meta name="description" content={shareDescription} />
        
        {/* OpenGraph tags */}
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Puzzlr" />
        {puzzle.image_url && (
          <meta property="og:image" content={puzzle.image_url} />
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDescription} />
        {puzzle.image_url && (
          <meta name="twitter:image" content={puzzle.image_url} />
        )}
        
        {/* Additional meta tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={shareUrl} />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/20">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Back Navigation */}
        <Link 
          href="/puzzles/browse"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-violet-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content Area - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Hero Section */}
            <div className="glass-card border-white/30 rounded-2xl p-6">
              <div className="grid md:grid-cols-5 gap-6">
                
                {/* Image - 2 columns */}
                <div className="md:col-span-2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg group">
                    {puzzle.image_url ? (
                      <Image
                        src={puzzle.image_url}
                        alt={puzzle.title}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info - 3 columns */}
                <div className="md:col-span-3 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-3">{puzzle.title}</h1>
                    
                    {/* Brand and Basic Info */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                      <Link href={`/brands/${puzzle.brand?.name}`} className="font-medium text-violet-600 hover:text-violet-700">
                        {puzzle.brand?.name}
                      </Link>
                      {puzzle.year_published && (
                        <>
                          <span>•</span>
                          <span>{puzzle.year_published}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>#{puzzle.id.slice(0, 8)}</span>
                    </div>

                    {/* Rating */}
                    {puzzle.average_rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(puzzle.average_rating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 font-medium">
                          {puzzle.average_rating.toFixed(1)} ({puzzle.total_ratings} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-slate-600 leading-relaxed mb-4 text-base">
                      {puzzle.description || 'A beautiful jigsaw puzzle featuring stunning artwork and premium quality pieces. Perfect for puzzle enthusiasts looking for their next challenge with excellent image quality and precise piece cutting.'}
                    </p>
                  </div>

                  {/* Essential Specs as Labels */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary" className="bg-violet-50 text-violet-700 border-violet-200 px-3 py-1 text-sm">
                      <Layers className="w-4 h-4 mr-1" />
                      {puzzle.piece_count} pieces
                    </Badge>
                    {puzzle.difficulty && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-sm">
                        <Target className="w-4 h-4 mr-1" />
                        {puzzle.difficulty} difficulty
                      </Badge>
                    )}
                    {puzzle.estimated_time && (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        ~{puzzle.estimated_time}h avg
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-rose-50 text-rose-700 border-rose-200 px-3 py-1 text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      {puzzle.average_rating?.toFixed(1) || '4.6'} rating
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {/* Add to List Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white px-6 py-2"
                          disabled={isUpdatingStatus || !user}
                        >
                          {isUpdatingStatus ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <>
                              {puzzleStatus.hasLog && puzzleStatus.status ? (
                                <>
                                  {(() => {
                                    const statusInfo = getStatusInfo(puzzleStatus.status)
                                    return statusInfo ? (
                                      <statusInfo.icon className="w-4 h-4 mr-2" />
                                    ) : (
                                      <Archive className="w-4 h-4 mr-2" />
                                    )
                                  })()}
                                </>
                              ) : (
                                <Archive className="w-4 h-4 mr-2" />
                              )}
                            </>
                          )}
                          {puzzleStatus.hasLog && puzzleStatus.status 
                            ? getStatusInfo(puzzleStatus.status)?.label || 'Add to List'
                            : 'Add to List'
                          }
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={() => handleStatusChange('wishlist')}>
                          <Heart className="w-4 h-4 mr-2" />
                          Add to Wishlist
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange('library')}>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Add to Library
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                          <Clock className="w-4 h-4 mr-2" />
                          Currently Solving
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                          <Check className="w-4 h-4 mr-2" />
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange('abandoned')}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Abandon Puzzle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                      variant="outline" 
                      className="border-violet-200 text-violet-700 hover:bg-violet-50 px-6 py-2"
                      onClick={() => setShowAdvancedRating(true)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate & Review
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-6 py-2"
                      onClick={() => router.push('/my-puzzles')}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Log Progress
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Links Section */}
            <div className="glass-card border-white/30 rounded-2xl p-6">
              <PurchaseLinks 
                puzzleId={puzzle.id} 
                puzzleTitle={puzzle.title}
              />
            </div>

            {/* Tabbed Content */}
            <div className="glass-card border-white/30 rounded-2xl p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 glass-card border-white/30 p-1 rounded-xl">
                  <TabsTrigger 
                    value="details" 
                    className="text-sm font-normal data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-violet-700 data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:shadow-lg hover:bg-white/60 transition-all duration-200 rounded-lg"
                  >
                    Product Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reviews" 
                    className="text-sm font-normal data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-violet-700 data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:shadow-lg hover:bg-white/60 transition-all duration-200 rounded-lg"
                  >
                    Reviews & Ratings
                  </TabsTrigger>
                  <TabsTrigger 
                    value="specifications" 
                    className="text-sm font-normal data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-violet-700 data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:shadow-lg hover:bg-white/60 transition-all duration-200 rounded-lg"
                  >
                    Specifications
                  </TabsTrigger>
                </TabsList>

                {/* Product Details Tab - Amazon-style main details */}
                <TabsContent value="details" className="mt-4 space-y-4">
                  
                  {/* Main Details Section */}
                  <div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Brand</span>
                          <span className="font-medium text-slate-800">{puzzle.brand?.name}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Piece Count</span>
                          <span className="font-medium text-slate-800">{puzzle.piece_count}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Theme</span>
                          <span className="font-medium text-slate-800">{puzzle.theme || 'Animals & Pets'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Difficulty</span>
                          <span className="font-medium text-slate-800">{puzzle.difficulty || '-'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Material</span>
                          <span className="font-medium text-slate-800">{puzzle.material || '-'}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Finished Size</span>
                          <span className="font-medium text-slate-800">
                            {puzzle.finished_size_width && puzzle.finished_size_height 
                              ? `${puzzle.finished_size_width}" × ${puzzle.finished_size_height}"`
                              : '-'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Age Range</span>
                          <span className="font-medium text-slate-800">
                            {puzzle.age_range_min && puzzle.age_range_max 
                              ? `${puzzle.age_range_min}+ years`
                              : '-'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Surface Finish</span>
                          <span className="font-medium text-slate-800">{puzzle.surface_finish || '-'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Average Time</span>
                          <span className="font-medium text-slate-800">{puzzle.estimated_time ? `${puzzle.estimated_time}h` : '-'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">SKU</span>
                          <span className="font-medium text-slate-800">{puzzle.sku || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">What's Included</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {puzzle.included_items && puzzle.included_items.length > 0 ? (
                        <>
                          <div className="space-y-2">
                            {puzzle.included_items.slice(0, Math.ceil(puzzle.included_items.length / 2)).map((item: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm text-slate-700">
                                  {item.includes('pieces') ? `${puzzle.piece_count} ${item.toLowerCase()}` : item}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            {puzzle.included_items.slice(Math.ceil(puzzle.included_items.length / 2)).map((item: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span className="text-sm text-slate-700">
                                  {item.includes('pieces') ? `${puzzle.piece_count} ${item.toLowerCase()}` : item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        // No included items data available
                        <div className="col-span-2 text-center text-slate-500 py-8">
                          <span className="text-lg">-</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Key Features</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {puzzle.key_features && puzzle.key_features.length > 0 ? (
                        puzzle.key_features.map((feature: any, index: number) => {
                          // Icon mapping
                          const IconComponent = feature.icon === 'precision' ? CheckCircle :
                                              feature.icon === 'image' ? Eye :
                                              feature.icon === 'clean' ? Shield : CheckCircle
                          
                          const iconColor = feature.icon === 'precision' ? 'text-emerald-600' :
                                           feature.icon === 'image' ? 'text-violet-600' :
                                           feature.icon === 'clean' ? 'text-blue-600' : 'text-emerald-600'
                          
                          return (
                            <div key={index} className="glass-card border-white/40 p-4 text-center">
                              <IconComponent className={`w-8 h-8 ${iconColor} mx-auto mb-3`} />
                              <h4 className="font-medium text-slate-700 mb-2">{feature.title}</h4>
                              <p className="text-sm text-slate-600">{feature.description}</p>
                            </div>
                          )
                        })
                      ) : (
                        // No key features data available
                        <div className="col-span-3 text-center text-slate-500 py-8">
                          <span className="text-lg">-</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Specifications Tab - Real Data with Graceful Fallbacks */}
                <TabsContent value="specifications" className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Puzzle Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Basic Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Piece Count</span>
                            <span className="text-slate-800">{puzzle.piece_count || '-'}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Brand</span>
                            <span className="text-slate-800">{puzzle.brand?.name || '-'}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Theme</span>
                            <span className="text-slate-800">{puzzle.theme || '-'}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Material</span>
                            <span className="text-slate-800">{puzzle.material || '-'}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Year Published</span>
                            <span className="text-slate-800">{puzzle.year_published || '-'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Specifications</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Difficulty Level</span>
                            <span className="text-slate-800">{puzzle.difficulty || '-'}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Estimated Time</span>
                            <span className="text-slate-800">
                              {puzzle.estimated_time ? `${puzzle.estimated_time} hours` : '-'}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Community Difficulty</span>
                            <span className="text-slate-800">
                              {communityStats.communityDifficulty > 0 
                                ? `${communityStats.communityDifficulty}/10`
                                : '-'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Average Completion</span>
                            <span className="text-slate-800">
                              {communityStats.averageTime > 0 
                                ? `${communityStats.averageTime} hours`
                                : '-'
                              }
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Success Rate</span>
                            <span className="text-slate-800">
                              {communityStats.successRate > 0 
                                ? `${communityStats.successRate}%`
                                : '-'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  {puzzle.description && (
                    <div>
                      <h3 className="text-base font-medium text-slate-700 mb-3">Description</h3>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                        {puzzle.description}
                      </p>
                    </div>
                  )}

                  {/* Community Stats */}
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Community Analytics</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">Times Completed</h4>
                        <p className="text-sm text-slate-600">
                          {communityStats.timesCompleted > 0 
                            ? `${communityStats.timesCompleted.toLocaleString()} completions`
                            : 'Be the first to complete!'
                          }
                        </p>
                      </div>
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Star className="w-8 h-8 text-violet-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">Average Rating</h4>
                        <p className="text-sm text-slate-600">
                          {communityStats.averageRating > 0
                            ? `${communityStats.averageRating}/5 stars`
                            : 'No ratings yet'
                          }
                        </p>
                      </div>
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Heart className="w-8 h-8 text-rose-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">Wishlist Count</h4>
                        <p className="text-sm text-slate-600">
                          {communityStats.wishlistCount > 0
                            ? `${communityStats.wishlistCount.toLocaleString()} wishlists`
                            : 'Add to yours today!'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Standard Quality Features */}
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Quality Features</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="glass-card border-white/40 p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">Precision Cut</h4>
                        <p className="text-sm text-slate-600">Perfect interlocking pieces</p>
                      </div>
                      <div className="glass-card border-white/40 p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">High Quality Print</h4>
                        <p className="text-sm text-slate-600">Vibrant, fade-resistant colors</p>
                      </div>
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Shield className="w-8 h-8 text-violet-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">Durable Material</h4>
                        <p className="text-sm text-slate-600">Built to last multiple uses</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Community Tab - Rich Data Insights */}
                <TabsContent value="community" className="mt-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-normal text-slate-700 mb-3">Completion Time Distribution</h3>
                      <div className="space-y-3">
                        {[
                          { range: '2-4 hours', percentage: 15, color: 'bg-violet-500' },
                          { range: '4-8 hours', percentage: 45, color: 'bg-violet-400' },
                          { range: '8-12 hours', percentage: 30, color: 'bg-violet-300' },
                          { range: '12+ hours', percentage: 10, color: 'bg-violet-200' }
                        ].map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-600">{item.range}</span>
                              <span className="text-sm font-normal text-slate-800">{item.percentage}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${item.color} transition-all duration-500`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-normal text-slate-700 mb-3">Solver Demographics</h3>
                      <div className="space-y-3">
                        {[
                          { age: 'Under 25', percentage: 18, color: 'bg-emerald-500' },
                          { age: '25-45', percentage: 42, color: 'bg-emerald-400' },
                          { age: '45-65', percentage: 28, color: 'bg-emerald-300' },
                          { age: '65+', percentage: 12, color: 'bg-emerald-200' }
                        ].map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-slate-600">{item.age}</span>
                              <span className="text-sm font-normal text-slate-800">{item.percentage}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${item.color} transition-all duration-500`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-slate-700 mb-3">Community Insights</h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="glass-card border-white/40 p-4 text-center">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg mb-2">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-normal text-slate-800 mb-1 text-sm">Peak Solving Time</h4>
                        <p className="text-xs text-slate-600">Weekend afternoons</p>
                        <p className="text-xs text-emerald-600 mt-1">6-8 hours most common</p>
                      </div>
                      
                      <div className="glass-card border-white/40 p-4 text-center">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center shadow-lg mb-2">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-normal text-slate-800 mb-1 text-sm">Difficulty Rating</h4>
                        <p className="text-xs text-slate-600">Intermediate Level</p>
                        <p className="text-xs text-violet-600 mt-1">7.2/10 community score</p>
                      </div>
                      
                      <div className="glass-card border-white/40 p-4 text-center">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg mb-2">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-normal text-slate-800 mb-1 text-sm">Social Aspect</h4>
                        <p className="text-xs text-slate-600">Great for families</p>
                        <p className="text-xs text-amber-600 mt-1">87% completion rate</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews Tab - Real database reviews */}
                <TabsContent value="reviews" className="mt-4 space-y-4">
                  {reviewsLoading ? (
                    // Loading state
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="h-32 bg-slate-200 rounded-xl animate-pulse" />
                        <div className="md:col-span-2 space-y-2">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-6 bg-slate-200 rounded animate-pulse" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : reviewsError ? (
                    // Error state
                    <div className="text-center py-8">
                      <p className="text-slate-500 mb-4">{reviewsError}</p>
                      <button
                        onClick={() => fetchReviewsData(params.id as string)}
                        className="text-violet-600 hover:text-violet-700 font-medium"
                      >
                        Try again
                      </button>
                    </div>
                  ) : !reviewsData || reviewsData.summary.totalReviews === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-700 mb-2">No reviews yet</h3>
                        <p className="text-slate-500 mb-4">Be the first to review this puzzle!</p>
                      </div>
                      <Button 
                        onClick={() => setShowAdvancedRating(true)}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Write a Review
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Rating Overview */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-base font-medium text-slate-700 mb-3">Overall Rating</h3>
                          <div className="text-center p-4 glass-card border-white/40 rounded-xl">
                            <div className="text-3xl font-bold text-slate-800 mb-3">
                              {reviewsData.summary.averageRating.toFixed(1)}
                            </div>
                            <div className="flex justify-center mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < Math.floor(reviewsData.summary.averageRating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="text-sm text-slate-600 font-medium">
                              {reviewsData.summary.totalReviews} total review{reviewsData.summary.totalReviews !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <h3 className="text-base font-medium text-slate-700 mb-3">Rating Breakdown</h3>
                          <div className="space-y-2">
                            {reviewsData.summary.ratingBreakdown.map((item: any) => (
                              <div key={item.stars} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-16">
                                  <span className="text-sm font-medium text-slate-700">{item.stars}</span>
                                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                </div>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-amber-400 transition-all duration-500"
                                    style={{ width: `${item.percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-slate-600 w-12 text-right">{item.percentage}%</span>
                                <span className="text-sm text-slate-600 w-8 text-right">({item.count})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quality Breakdown */}
                      <div>
                        <h3 className="text-base font-medium text-slate-700 mb-3">Quality Breakdown</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-4 glass-card border-white/40 rounded-lg">
                            <div className="flex items-center gap-3">
                              <ImageIcon className="w-5 h-5 text-violet-600" />
                              <span className="font-medium text-slate-700">Image Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(reviewsData.summary.qualityBreakdown.imageQuality)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-bold text-slate-700">
                                {reviewsData.summary.qualityBreakdown.imageQuality}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 glass-card border-white/40 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Target className="w-5 h-5 text-violet-600" />
                              <span className="font-medium text-slate-700">Piece Fit Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(reviewsData.summary.qualityBreakdown.pieceFit)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-bold text-slate-700">
                                {reviewsData.summary.qualityBreakdown.pieceFit}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 glass-card border-white/40 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Award className="w-5 h-5 text-violet-600" />
                              <span className="font-medium text-slate-700">Durability</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(reviewsData.summary.qualityBreakdown.durability)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-bold text-slate-700">
                                {reviewsData.summary.qualityBreakdown.durability}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-4 glass-card border-white/40 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Star className="w-5 h-5 text-violet-600" />
                              <span className="font-medium text-slate-700">Overall Experience</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(reviewsData.summary.qualityBreakdown.overallExperience)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-bold text-slate-700">
                                {reviewsData.summary.qualityBreakdown.overallExperience}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Individual Reviews */}
                      <div>
                        <h3 className="text-base font-medium text-slate-700 mb-3">Customer Reviews</h3>
                        <div className="space-y-4">
                          {reviewsData.reviews.map((review: any) => (
                            <div key={review.id} className="p-4 glass-card border-white/40 rounded-lg">
                              <div className="flex items-start gap-3">
                                <img
                                  src={review.user.avatar || '/default-avatar.png'}
                                  alt={review.user.username}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-slate-800">{review.user.username}</span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? 'fill-amber-400 text-amber-400'
                                              : 'text-slate-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-slate-500">{review.timeAgo}</span>
                                  </div>
                                  {review.review && (
                                    <p className="text-slate-600 mb-3 leading-relaxed">{review.review}</p>
                                  )}
                                  
                                  {/* Show metadata if available */}
                                  {(review.metadata?.looseFit || review.metadata?.falseFit) && (
                                    <div className="text-sm text-slate-500 border-t pt-2">
                                      {review.metadata.looseFit && (
                                        <div>Fit Quality: {review.metadata.looseFit}/5</div>
                                      )}
                                      {review.metadata.falseFit && (
                                        <div>False Fits: {review.metadata.falseFit}/5</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Activity Tab - Social Feed */}
                <TabsContent value="activity" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-normal text-slate-700">Recent Activity</h3>
                      <Button variant="outline" size="sm" className="text-xs">View All</Button>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        {
                          id: 1,
                          user: { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" },
                          action: "completed",
                          details: "in 7.5 hours",
                          time: "2 hours ago",
                          icon: Trophy,
                          color: "text-amber-600"
                        },
                        {
                          id: 2,
                          user: { name: "Sarah Johnson", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face" },
                          action: "reviewed",
                          details: "gave 5 stars",
                          time: "5 hours ago",
                          icon: Star,
                          color: "text-violet-600"
                        },
                        {
                          id: 3,
                          user: { name: "Mike Rodriguez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" },
                          action: "added to wishlist",
                          details: "",
                          time: "1 day ago",
                          icon: Heart,
                          color: "text-rose-600"
                        },
                        {
                          id: 4,
                          user: { name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" },
                          action: "started solving",
                          details: "progress: 25%",
                          time: "2 days ago",
                          icon: Play,
                          color: "text-emerald-600"
                        }
                      ].map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-white/40">
                          <img
                            src={activity.user.avatar}
                            alt={activity.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-1 text-sm">
                              <span className="font-normal text-slate-800">{activity.user.name}</span>
                              <span className="text-slate-600">{activity.action}</span>
                              {activity.details && (
                                <span className={`${activity.color} font-normal`}>{activity.details}</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{activity.time}</div>
                          </div>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Related Tab - Smart Recommendations */}
                <TabsContent value="related" className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-normal text-slate-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      More from {relatedPuzzlesData?.brandName || puzzle.brand?.name || 'This Brand'}
                    </h3>
                    
                    {relatedPuzzlesLoading ? (
                      // Loading state
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((index) => (
                          <div key={index} className="glass-card border-white/40 p-3 rounded-xl">
                            <div className="aspect-[4/3] bg-slate-200 rounded-lg animate-pulse mb-2" />
                            <div className="space-y-1">
                              <div className="h-3 bg-slate-200 rounded animate-pulse" />
                              <div className="h-2 bg-slate-200 rounded animate-pulse w-16" />
                              <div className="flex justify-between">
                                <div className="h-3 bg-slate-200 rounded animate-pulse w-12" />
                                <div className="h-3 bg-slate-200 rounded animate-pulse w-10" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : relatedPuzzlesError ? (
                      // Error state
                      <div className="text-center py-6">
                        <p className="text-slate-500 text-sm mb-3">{relatedPuzzlesError}</p>
                        <button
                          onClick={() => fetchRelatedPuzzles(params.id as string)}
                          className="text-violet-600 hover:text-violet-700 font-medium text-sm"
                        >
                          Try again
                        </button>
                      </div>
                    ) : !relatedPuzzlesData?.relatedPuzzles || relatedPuzzlesData.relatedPuzzles.length === 0 ? (
                      // Empty state
                      <div className="text-center py-6">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-1">
                          No other puzzles from {relatedPuzzlesData?.brandName || 'this brand'}
                        </h4>
                        <p className="text-slate-500 text-sm">This appears to be the only puzzle from this brand.</p>
                      </div>
                    ) : (
                      // Related puzzles list
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {relatedPuzzlesData.relatedPuzzles.map((related: any) => (
                          <Link
                            key={related.id}
                            href={`/puzzles/${related.id}`}
                            className="glass-card hover-lift border border-white/40 p-3 group rounded-xl"
                          >
                            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-2 relative">
                              {related.image ? (
                                <img
                                  src={related.image}
                                  alt={related.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                  <Package className="w-6 h-6 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-normal text-slate-800 group-hover:text-violet-600 transition-colors mb-1 text-sm line-clamp-2">
                                {related.title}
                              </h4>
                              <p className="text-xs text-slate-600 mb-2">
                                {related.pieces} pieces
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {related.rating ? (
                                    <>
                                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                                      <span className="text-xs font-normal text-slate-800">{related.rating}</span>
                                    </>
                                  ) : (
                                    <span className="text-xs text-slate-500">No rating</span>
                                  )}
                                </div>
                                {related.timesCompleted > 0 && (
                                  <span className="text-xs text-emerald-600 font-normal">
                                    {related.timesCompleted} done
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-slate-700 mb-3">You Might Also Like</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        {
                          title: "Similar Difficulty",
                          description: "Puzzles with 7-8/10 difficulty rating",
                          count: 24,
                          icon: Target,
                          color: "from-violet-500 to-violet-600"
                        },
                        {
                          title: "Same Piece Count",
                          description: "Other 1000-piece puzzles",
                          count: 156,
                          icon: Layers,
                          color: "from-emerald-500 to-emerald-600"
                        },
                        {
                          title: "Animal Theme",
                          description: "More animal puzzles",
                          count: 89,
                          icon: Heart,
                          color: "from-rose-500 to-rose-600"
                        }
                      ].map((category, index) => (
                        <div key={index} className="glass-card hover-lift border border-white/40 p-4 text-center cursor-pointer group">
                          <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg mb-2`}>
                            <category.icon className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="font-normal text-slate-800 mb-1 group-hover:text-violet-600 transition-colors text-sm">{category.title}</h4>
                          <p className="text-xs text-slate-600 mb-1">{category.description}</p>
                          <span className="text-xs text-violet-600 font-normal">{category.count} puzzles</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Related Puzzles - Standalone Section */}
            <div className="glass-card border-white/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                You Might Also Like
              </h2>
              
              <div className="space-y-6">
                {/* More from Brand */}
                <div>
                  <h3 className="text-lg font-medium text-slate-700 mb-3">
                    More from {relatedPuzzlesData?.brandName || puzzle.brand?.name || 'This Brand'}
                  </h3>
                  
                  {relatedPuzzlesLoading ? (
                    // Loading state
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="glass-card border-white/40 p-4 rounded-xl">
                          <div className="aspect-[4/3] bg-slate-200 rounded-lg animate-pulse mb-3" />
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded animate-pulse" />
                            <div className="h-3 bg-slate-200 rounded animate-pulse w-20" />
                            <div className="flex justify-between">
                              <div className="h-4 bg-slate-200 rounded animate-pulse w-16" />
                              <div className="h-4 bg-slate-200 rounded animate-pulse w-12" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : relatedPuzzlesError ? (
                    // Error state
                    <div className="text-center py-8">
                      <p className="text-slate-500 mb-4">{relatedPuzzlesError}</p>
                      <button
                        onClick={() => fetchRelatedPuzzles(params.id as string)}
                        className="text-violet-600 hover:text-violet-700 font-medium"
                      >
                        Try again
                      </button>
                    </div>
                  ) : !relatedPuzzlesData?.relatedPuzzles || relatedPuzzlesData.relatedPuzzles.length === 0 ? (
                    // Empty state
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-slate-700 mb-2">
                          No other puzzles from {relatedPuzzlesData?.brandName || 'this brand'}
                        </h4>
                        <p className="text-slate-500">This appears to be the only puzzle from this brand in our collection.</p>
                      </div>
                    </div>
                  ) : (
                    // Related puzzles list
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {relatedPuzzlesData.relatedPuzzles.map((related: any) => (
                        <Link
                          key={related.id}
                          href={`/puzzles/${related.id}`}
                          className="glass-card hover-lift border border-white/40 p-4 group rounded-xl transition-all duration-200"
                        >
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-3 relative">
                            {related.image ? (
                              <img
                                src={related.image}
                                alt={related.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                <Package className="w-8 h-8 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 group-hover:text-violet-600 transition-colors mb-2 line-clamp-2">
                              {related.title}
                            </h4>
                            <p className="text-sm text-slate-600 mb-3">
                              {related.pieces} pieces
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {related.rating ? (
                                  <>
                                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                                    <span className="text-sm font-medium text-slate-800">{related.rating}</span>
                                    <span className="text-xs text-slate-500">({related.reviewCount})</span>
                                  </>
                                ) : (
                                  <span className="text-sm text-slate-500">No rating yet</span>
                                )}
                              </div>
                              {related.timesCompleted > 0 && (
                                <span className="text-xs text-emerald-600 font-medium">
                                  {related.timesCompleted} completed
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Browse Similar Categories */}
                <div>
                  <h3 className="text-lg font-medium text-slate-700 mb-3">Browse Similar</h3>
                  
                  {browseSimilarLoading ? (
                    // Loading state
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="glass-card border border-white/40 p-4 text-center">
                          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-200 animate-pulse mb-3" />
                          <div className="h-5 bg-slate-200 rounded animate-pulse mb-2" />
                          <div className="h-4 bg-slate-200 rounded animate-pulse mb-2" />
                          <div className="h-4 bg-slate-200 rounded animate-pulse w-20 mx-auto" />
                        </div>
                      ))}
                    </div>
                  ) : browseSimilarError ? (
                    // Error state
                    <div className="text-center py-4">
                      <p className="text-slate-500 mb-2 text-sm">{browseSimilarError}</p>
                      <button
                        onClick={() => fetchBrowseSimilarData(params.id as string)}
                        className="text-violet-600 hover:text-violet-700 font-medium text-sm"
                      >
                        Try again
                      </button>
                    </div>
                  ) : browseSimilarData?.similarities ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {browseSimilarData.similarities.map((similarity: any, index: number) => {
                        // Define icon and color based on type
                        const iconMap = {
                          material: Target,
                          piece_count: Layers,
                          theme: Heart
                        }
                        const colorMap = {
                          material: "from-violet-500 to-violet-600",
                          piece_count: "from-emerald-500 to-emerald-600", 
                          theme: "from-rose-500 to-rose-600"
                        }
                        
                        const IconComponent = iconMap[similarity.type as keyof typeof iconMap] || Target
                        const colorClass = colorMap[similarity.type as keyof typeof colorMap] || "from-slate-500 to-slate-600"
                        
                        // Generate browse URL with filter
                        const browseUrl = similarity.enabled && similarity.filterValue ? 
                          `/puzzles/browse?${similarity.filterKey}=${encodeURIComponent(similarity.filterValue)}` : 
                          '/puzzles/browse'
                        
                        return (
                          <Link
                            key={index}
                            href={browseUrl}
                            className={`glass-card hover-lift border border-white/40 p-4 text-center group transition-all duration-200 ${
                              similarity.enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${colorClass} flex items-center justify-center shadow-lg mb-3`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h4 className={`font-medium text-slate-800 mb-2 transition-colors ${
                              similarity.enabled ? 'group-hover:text-violet-600' : ''
                            }`}>
                              {similarity.label}
                            </h4>
                            <p className="text-sm text-slate-600 mb-2">{similarity.description}</p>
                            <span className={`text-sm font-medium ${
                              similarity.enabled && similarity.count > 0 ? 'text-violet-600' : 'text-slate-500'
                            }`}>
                              {similarity.count > 0 ? `${similarity.count} puzzles` : 'No similar puzzles'}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  ) : (
                    // Empty state
                    <div className="text-center py-4">
                      <p className="text-slate-500 text-sm">No similar puzzles data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rich Sidebar - 1 column */}
          <div className="space-y-4">
            
            {/* Key Stats */}
            <div className="glass-card border-white/30 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-600" />
                Key Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                  <span className="text-slate-800 font-bold">
                    {communityStats.timesCompleted > 0 ? communityStats.timesCompleted.toLocaleString() : 'None yet'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Wishlisted
                  </span>
                  <span className="text-slate-800 font-bold">
                    {communityStats.wishlistCount > 0 ? communityStats.wishlistCount.toLocaleString() : 'None yet'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Avg Time
                  </span>
                  <span className="text-slate-800 font-bold">
                    {communityStats.averageTime > 0 ? `${communityStats.averageTime}h` : 'No data'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Difficulty
                  </span>
                  <span className="text-slate-800 font-bold">
                    {communityStats.communityDifficulty > 0 ? `${communityStats.communityDifficulty}/10` : 'Not rated'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Success Rate
                  </span>
                  <span className="text-emerald-600 font-bold">
                    {communityStats.successRate > 0 ? `${communityStats.successRate}%` : 'No data'}
                  </span>
                </div>
              </div>
            </div>

            {/* Share This Puzzle */}
            <div className="glass-card border-white/30 rounded-2xl p-5">
              <PuzzleShare 
                puzzle={{
                  id: puzzle.id,
                  title: puzzle.title,
                  brand: puzzle.brand?.name || 'Unknown Brand',
                  piece_count: puzzle.piece_count,
                  description: puzzle.description,
                  image_url: puzzle.image_url
                }}
              />
            </div>

            {/* Recent Activity */}
            <div className="glass-card border-white/30 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {activityLoading ? (
                  // Loading state
                  <div className="space-y-3">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded animate-pulse mb-1" />
                          <div className="h-3 bg-slate-200 rounded animate-pulse w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activityError ? (
                  // Error state
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 mb-2">{activityError}</p>
                    <button
                      onClick={() => fetchActivityData(params.id as string)}
                      className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                    >
                      Try again
                    </button>
                  </div>
                ) : activityData.length === 0 ? (
                  // Empty state
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 mb-1">No recent activity</p>
                    <p className="text-xs text-slate-400">Be the first to interact with this puzzle!</p>
                  </div>
                ) : (
                  // Activity list
                  activityData.map((activity, index) => {
                    const activityConfigMap = {
                      completed: { icon: Trophy, color: 'text-amber-600', text: 'completed this puzzle' },
                      reviewed: { icon: Star, color: 'text-violet-600', text: 'reviewed this puzzle' },
                      added_to_wishlist: { icon: Heart, color: 'text-rose-600', text: 'added to wishlist' },
                      started_solving: { icon: Clock, color: 'text-blue-600', text: 'started solving' }
                    }
                    const activityConfig = activityConfigMap[activity.type as keyof typeof activityConfigMap] || { icon: Activity, color: 'text-slate-600', text: activity.type }

                    return (
                      <div key={activity.id} className="flex items-center gap-3">
                        <activityConfig.icon className={`w-4 h-4 ${activityConfig.color}`} />
                        <div className="flex-1">
                          <div className="text-sm">
                            <span className="font-medium text-slate-800">{activity.user}</span>
                            <span className="text-slate-600 ml-1">{activityConfig.text}</span>
                            {activity.metadata?.rating && (
                              <span className="text-amber-600 ml-1">({activity.metadata.rating}★)</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{activity.timeAgo}</div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Advanced Rating Modal */}
      {puzzleData && (
        <AdvancedRatingModal
          isOpen={showAdvancedRating}
          onClose={() => setShowAdvancedRating(false)}
          puzzle={{
            id: puzzle.id,
            title: puzzle.title,
            brand: { name: puzzle.brand?.name || 'Unknown Brand' },
            imageUrl: puzzle.image_url,
            pieceCount: puzzle.piece_count
          }}
        />
      )}
      </div>
    </>
  )
} 