'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
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
      times_completed: number
      average_completion_time: number
      wishlist_count: number
    }
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

  useEffect(() => {
    if (params.id) {
      fetchPuzzleDetail(params.id as string)
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

  // Check current puzzle status for the user
  const checkPuzzleStatus = async () => {
    if (!user || !puzzleData?.puzzle.id) return
    
    try {
      const response = await fetch(`/api/puzzle-status?puzzleId=${puzzleData.puzzle.id}`)
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
          status: newStatus,
        }),
      })

      if (response.ok) {
        const updatedStatus = await response.json()
        setPuzzleStatus(updatedStatus)
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

  // Rich mock data for comprehensive stats
  const mockStats = {
    views: 12847,
    likes: 2156,
    timesCompleted: 2847,
    successRate: 87,
    wishlistCount: 1523,
    wantToBuyCount: 892,
    averageTime: 8.5,
    timeRange: '6-12 hours',
    communityDifficulty: 7.2,
    activeSolvers: 156,
    priceRange: '$18.99 - $32.99',
    bestPrice: '$24.99',
    recentlyAdded: 45
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

  return (
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
                          <span className="font-medium text-slate-800">{puzzle.difficulty || 'Intermediate'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Material</span>
                          <span className="font-medium text-slate-800">{puzzle.material || 'Premium Cardboard'}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Finished Size</span>
                          <span className="font-medium text-slate-800">27" × 20"</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Age Range</span>
                          <span className="font-medium text-slate-800">14+ years</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Surface Finish</span>
                          <span className="font-medium text-slate-800">Anti-glare Matte</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">Average Time</span>
                          <span className="font-medium text-slate-800">{puzzle.estimated_time || 8}h</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                          <span className="text-slate-600">SKU</span>
                          <span className="font-medium text-slate-800">#{puzzle.id.slice(0, 12)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">What's Included</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-slate-700">{puzzle.piece_count} premium puzzle pieces</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-slate-700">Full-color reference poster</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-slate-700">Resealable storage bag</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-slate-700">Sturdy storage box</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-slate-700">Manufacturer warranty</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-slate-700">Assembly instructions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Key Features</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="glass-card border-white/40 p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">Precision Cut</h4>
                        <p className="text-sm text-slate-600">Perfect interlocking pieces with no false fits</p>
                      </div>
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Eye className="w-8 h-8 text-violet-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">HD Imaging</h4>
                        <p className="text-sm text-slate-600">Crystal clear reproduction with vibrant colors</p>
                      </div>
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">Dust-Free</h4>
                        <p className="text-sm text-slate-600">Clean cutting process with smooth edges</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Specifications Tab - Detailed Technical Specs */}
                <TabsContent value="specifications" className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Technical Specifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Dimensions & Weight</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Finished Size</span>
                            <span className="text-slate-800">27" × 20" (68.6 × 50.8 cm)</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Box Size</span>
                            <span className="text-slate-800">14" × 10.25" × 2.37"</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Weight</span>
                            <span className="text-slate-800">1.8 lbs (816g)</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Piece Thickness</span>
                            <span className="text-slate-800">2.0mm</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Manufacturing Details</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Cutting Style</span>
                            <span className="text-slate-800">Random Cut</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Printing Method</span>
                            <span className="text-slate-800">Offset Lithography</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Country of Origin</span>
                            <span className="text-slate-800">USA</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-600">Recycled Content</span>
                            <span className="text-slate-800">75%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Quality Certifications</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Award className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">CPSIA Certified</h4>
                        <p className="text-sm text-slate-600">Child safety compliant</p>
                      </div>
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">Non-Toxic</h4>
                        <p className="text-sm text-slate-600">Safe materials used</p>
                      </div>
                      <div className="glass-card border-white/40 p-4 text-center">
                        <Zap className="w-8 h-8 text-violet-600 mx-auto mb-3" />
                        <h4 className="font-medium text-slate-700 mb-2">FSC Certified</h4>
                        <p className="text-sm text-slate-600">Sustainable sourcing</p>
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

                {/* Reviews Tab - Amazon-Style Review System */}
                <TabsContent value="reviews" className="mt-4 space-y-4">
                  {/* Rating Overview */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-base font-medium text-slate-700 mb-3">Overall Rating</h3>
                      <div className="text-center p-4 glass-card border-white/40 rounded-xl">
                        <div className="text-3xl font-bold text-slate-800 mb-3">{puzzle.average_rating?.toFixed(1) || '4.6'}</div>
                        <div className="flex justify-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(puzzle.average_rating || 4.6)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">{puzzle.total_ratings || 127} total reviews</div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-base font-medium text-slate-700 mb-3">Rating Breakdown</h3>
                      <div className="space-y-2">
                        {[
                          { stars: 5, count: 78, percentage: 61 },
                          { stars: 4, count: 31, percentage: 24 },
                          { stars: 3, count: 12, percentage: 10 },
                          { stars: 2, count: 4, percentage: 3 },
                          { stars: 1, count: 2, percentage: 2 }
                        ].map((item) => (
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

                  {/* Multi-Dimensional Ratings */}
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Quality Breakdown</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { category: 'Image Quality', rating: 4.8, icon: ImageIcon },
                        { category: 'Piece Fit Quality', rating: 4.7, icon: Target },
                        { category: 'Durability', rating: 4.6, icon: Award },
                        { category: 'Overall Experience', rating: 4.6, icon: Star }
                      ].map((item) => (
                        <div key={item.category} className="flex items-center justify-between p-4 glass-card border-white/40 rounded-lg">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-violet-600" />
                            <span className="font-medium text-slate-700">{item.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(item.rating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-slate-700">{item.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div>
                    <h3 className="text-base font-medium text-slate-700 mb-3">Customer Reviews</h3>
                    <div className="space-y-4">
                      {[
                        {
                          user: 'Sarah Johnson',
                          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face',
                          rating: 5,
                          date: '2 days ago',
                          verified: true,
                          title: 'Absolutely stunning puzzle!',
                          review: 'The colors are vibrant and the pieces fit perfectly. Took me about 9 hours over a weekend. The image quality is exceptional and there were no false fits.',
                          helpful: 23,
                          qualities: { imageQuality: 5, pieceFit: 5, durability: 4, experience: 5 }
                        },
                        {
                          user: 'Mike Rodriguez',
                          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
                          rating: 4,
                          date: '1 week ago',
                          verified: true,
                          title: 'Great quality, challenging enough',
                          review: 'Really enjoyed this puzzle. The puppies are adorable and the detail is excellent. A few pieces were a bit tricky to distinguish but overall very satisfying.',
                          helpful: 18,
                          qualities: { imageQuality: 5, pieceFit: 4, durability: 4, experience: 4 }
                        },
                        {
                          user: 'Emily Chen',
                          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
                          rating: 5,
                          date: '2 weeks ago',
                          verified: true,
                          title: 'Perfect for family time',
                          review: 'We completed this as a family over several evenings. Great quality pieces and beautiful artwork. The finished puzzle looks amazing on our wall!',
                          helpful: 15,
                          qualities: { imageQuality: 5, pieceFit: 5, durability: 5, experience: 5 }
                        }
                      ].map((review, index) => (
                        <div key={index} className="glass-card border-white/40 p-5 rounded-xl">
                          <div className="flex items-start gap-4">
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="font-medium text-slate-800">{review.user}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-1">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified Purchase
                                  </Badge>
                                )}
                                <span className="text-sm text-slate-500">{review.date}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-3">
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
                                <span className="font-medium text-slate-700">{review.title}</span>
                              </div>
                              
                              <p className="text-slate-600 mb-4 leading-relaxed">{review.review}</p>
                              
                              {/* Quality ratings */}
                              <div className="flex gap-4 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500">Image Quality:</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < review.qualities.imageQuality
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500">Piece Fit:</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < review.qualities.pieceFit
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-500">Durability:</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < review.qualities.durability
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                  <Button variant="outline" size="sm" className="text-sm px-3 py-1 hover:bg-slate-50">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    Helpful ({review.helpful})
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-sm px-3 py-1 hover:bg-slate-50">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    Reply
                                  </Button>
                                </div>
                                <span className="text-xs text-slate-500">Was this review helpful?</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                      More from {puzzle.brand?.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        {
                          id: 1,
                          title: "Majestic Eagles",
                          pieces: 1000,
                          rating: 4.7,
                          price: "$26.99",
                          image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=300&h=200&fit=crop"
                        },
                        {
                          id: 2,
                          title: "Forest Wildlife",
                          pieces: 1500,
                          rating: 4.8,
                          price: "$32.99",
                          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop"
                        },
                        {
                          id: 3,
                          title: "Ocean Life",
                          pieces: 1000,
                          rating: 4.6,
                          price: "$28.99",
                          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop"
                        },
                        {
                          id: 4,
                          title: "Mountain Vista",
                          pieces: 2000,
                          rating: 4.9,
                          price: "$39.99",
                          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
                        }
                      ].map((related) => (
                        <Link
                          key={related.id}
                          href={`/puzzles/${related.id}`}
                          className="glass-card hover-lift border border-white/40 p-3 group rounded-xl"
                        >
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-2 relative">
                            <img
                              src={related.image}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div>
                            <h4 className="font-normal text-slate-800 group-hover:text-violet-600 transition-colors mb-1 text-sm">
                              {related.title}
                            </h4>
                            <p className="text-xs text-slate-600 mb-2">
                              {related.pieces} pieces
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-current" />
                                <span className="text-xs font-normal text-slate-800">{related.rating}</span>
                              </div>
                              <span className="text-xs font-normal text-emerald-600">{related.price}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
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
                  <h3 className="text-lg font-medium text-slate-700 mb-3">More from {puzzle.brand?.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        id: 1,
                        title: "Majestic Eagles",
                        pieces: 1000,
                        rating: 4.7,
                        price: "$26.99",
                        image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=300&h=200&fit=crop"
                      },
                      {
                        id: 2,
                        title: "Forest Wildlife",
                        pieces: 1500,
                        rating: 4.8,
                        price: "$32.99",
                        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop"
                      },
                      {
                        id: 3,
                        title: "Ocean Life",
                        pieces: 1000,
                        rating: 4.6,
                        price: "$28.99",
                        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop"
                      },
                      {
                        id: 4,
                        title: "Mountain Vista",
                        pieces: 2000,
                        rating: 4.9,
                        price: "$39.99",
                        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
                      }
                    ].map((related) => (
                      <Link
                        key={related.id}
                        href={`/puzzles/${related.id}`}
                        className="glass-card hover-lift border border-white/40 p-4 group rounded-xl transition-all duration-200"
                      >
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-3 relative">
                          <img
                            src={related.image}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800 group-hover:text-violet-600 transition-colors mb-2">
                            {related.title}
                          </h4>
                          <p className="text-sm text-slate-600 mb-3">
                            {related.pieces} pieces
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="text-sm font-medium text-slate-800">{related.rating}</span>
                            </div>
                            <span className="text-sm font-bold text-emerald-600">{related.price}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Suggestion Categories */}
                <div>
                  <h3 className="text-lg font-medium text-slate-700 mb-3">Browse Similar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Same Difficulty",
                        description: "7-8/10 difficulty puzzles",
                        count: 24,
                        icon: Target,
                        color: "from-violet-500 to-violet-600"
                      },
                      {
                        title: "Same Piece Count",
                        description: "1000-piece puzzles",
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
                      <div key={index} className="glass-card hover-lift border border-white/40 p-4 text-center cursor-pointer group transition-all duration-200">
                        <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg mb-3`}>
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-medium text-slate-800 mb-2 group-hover:text-violet-600 transition-colors">{category.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{category.description}</p>
                        <span className="text-sm text-violet-600 font-medium">{category.count} puzzles</span>
                      </div>
                    ))}
                  </div>
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
                  <span className="text-slate-800 font-bold">{mockStats.timesCompleted.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Wishlisted
                  </span>
                  <span className="text-slate-800 font-bold">{mockStats.wishlistCount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Avg Time
                  </span>
                  <span className="text-slate-800 font-bold">{mockStats.averageTime}h</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Difficulty
                  </span>
                  <span className="text-slate-800 font-bold">{mockStats.communityDifficulty}/10</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Success Rate
                  </span>
                  <span className="text-emerald-600 font-bold">{mockStats.successRate}%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card border-white/30 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  {
                    user: 'Alex Chen',
                    action: 'completed',
                    time: '2h ago',
                    icon: Trophy,
                    color: 'text-amber-600'
                  },
                  {
                    user: 'Sarah Johnson',
                    action: 'reviewed',
                    time: '5h ago',
                    icon: Star,
                    color: 'text-violet-600'
                  },
                  {
                    user: 'Mike Rodriguez',
                    action: 'added to wishlist',
                    time: '1d ago',
                    icon: Heart,
                    color: 'text-rose-600'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium text-slate-800">{activity.user}</span>
                        <span className="text-slate-600 ml-1">{activity.action}</span>
                      </div>
                      <div className="text-xs text-slate-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
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
  )
} 