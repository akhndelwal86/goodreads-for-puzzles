'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Shield
} from 'lucide-react'

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
  const { user } = useUser()
  const [puzzleData, setPuzzleData] = useState<PuzzleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (params.id) {
      fetchPuzzleDetail(params.id as string)
    }
  }, [params.id])

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
            <div className="glass-card border-white/30 rounded-2xl p-4">
              <div className="grid md:grid-cols-5 gap-4">
                
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
                <div className="md:col-span-3 space-y-3">
            <div>
                    <h1 className="text-2xl font-semibold text-slate-800 mb-2">{puzzle.title}</h1>
                    
                    {/* Brand and Basic Info */}
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <Link href={`/brands/${puzzle.brand?.name}`} className="font-normal text-violet-600 hover:text-violet-700">
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
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(puzzle.average_rating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 font-normal">
                          {puzzle.average_rating.toFixed(1)} ({puzzle.total_ratings} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                      {puzzle.description || 'A beautiful jigsaw puzzle featuring stunning artwork and premium quality pieces. Perfect for puzzle enthusiasts looking for their next challenge with excellent image quality and precise piece cutting.'}
                    </p>
                  </div>

                  {/* Essential Specs as Labels */}
              <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-violet-50 text-violet-700 border-violet-200 px-2 py-1 text-xs">
                      <Layers className="w-3 h-3 mr-1" />
                      {puzzle.piece_count} pieces
                    </Badge>
                    {puzzle.difficulty && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2 py-1 text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        {puzzle.difficulty} difficulty
                      </Badge>
                    )}
                    {puzzle.estimated_time && (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 px-2 py-1 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{puzzle.estimated_time}h avg
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-rose-50 text-rose-700 border-rose-200 px-2 py-1 text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {puzzle.average_rating?.toFixed(1) || '4.6'} rating
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white px-4 text-sm">
                      <Archive className="w-4 h-4 mr-2" />
                      Add to Collection
                    </Button>
                    <Button variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50 px-4 text-sm">
                      <Star className="w-4 h-4 mr-2" />
                      Rate & Review
                    </Button>
                    <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-4 text-sm">
                      <Play className="w-4 h-4 mr-2" />
                      Log Progress
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabbed Content */}
            <div className="glass-card border-white/30 rounded-2xl p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5 bg-white/50">
                  <TabsTrigger value="details" className="text-sm font-normal">Details</TabsTrigger>
                  <TabsTrigger value="community" className="text-sm font-normal">Community</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-sm font-normal">Reviews</TabsTrigger>
                  <TabsTrigger value="activity" className="text-sm font-normal">Activity</TabsTrigger>
                  <TabsTrigger value="related" className="text-sm font-normal">Related</TabsTrigger>
                </TabsList>

                {/* Details Tab - Comprehensive Specifications */}
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-normal text-slate-700 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-violet-600" />
                        Product Specifications
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Brand</span>
                          <span className="text-slate-700 font-normal">{puzzle.brand?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Piece Count</span>
                          <span className="text-slate-700 font-normal">{puzzle.piece_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Finished Size</span>
                          <span className="text-slate-700 font-normal">27" × 20" (68.6 × 50.8 cm)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Box Size</span>
                          <span className="text-slate-700 font-normal">14" × 10.25" × 2.37"</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Weight</span>
                          <span className="text-slate-700 font-normal">1.8 lbs (816g)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Material</span>
                          <span className="text-slate-700 font-normal">{puzzle.material || 'Premium Cardboard'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Piece Thickness</span>
                          <span className="text-slate-700 font-normal">2.0mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Cutting Style</span>
                          <span className="text-slate-700 font-normal">Random Cut</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Age Range</span>
                          <span className="text-slate-700 font-normal">14+ years</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-normal text-slate-700 mb-3 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-emerald-600" />
                        Design & Theme
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Theme</span>
                          <span className="text-slate-700 font-normal">{puzzle.theme || 'Animals & Pets'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Category</span>
                          <span className="text-slate-700 font-normal">Photography</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Artist</span>
                          <span className="text-slate-700 font-normal">Nature Photography</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Color Palette</span>
                          <span className="text-slate-700 font-normal">Warm Earth Tones</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Dominant Colors</span>
                          <span className="text-slate-700 font-normal">Brown, Golden, Cream</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Image Quality</span>
                          <span className="text-slate-700 font-normal">High Definition</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Surface Finish</span>
                          <span className="text-slate-700 font-normal">Anti-glare Matte</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Series</span>
                          <span className="text-slate-700 font-normal">Animal Kingdom Collection</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">SKU</span>
                          <span className="text-slate-700 font-normal">#{puzzle.id.slice(0, 12)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-normal text-slate-700 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      Quality & Features
                    </h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="glass-card border-white/40 p-3 text-center">
                        <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <h4 className="font-normal text-slate-700 mb-1 text-sm">Precision Cut</h4>
                        <p className="text-xs text-slate-600">Perfect interlocking pieces</p>
                      </div>
                      <div className="glass-card border-white/40 p-3 text-center">
                        <Eye className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                        <h4 className="font-normal text-slate-700 mb-1 text-sm">HD Imaging</h4>
                        <p className="text-xs text-slate-600">Crystal clear reproduction</p>
                      </div>
                      <div className="glass-card border-white/40 p-3 text-center">
                        <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-normal text-slate-700 mb-1 text-sm">Dust-Free</h4>
                        <p className="text-xs text-slate-600">Clean cutting process</p>
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
                      <h3 className="text-lg font-normal text-slate-700 mb-3">Overall Rating</h3>
                      <div className="text-center p-4 glass-card border-white/40 rounded-xl">
                        <div className="text-3xl font-normal text-slate-800 mb-2">{puzzle.average_rating?.toFixed(1) || '4.6'}</div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(puzzle.average_rating || 4.6)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-slate-600">{puzzle.total_ratings || 127} total reviews</div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-normal text-slate-700 mb-3">Rating Breakdown</h3>
                      <div className="space-y-2">
                        {[
                          { stars: 5, count: 78, percentage: 61 },
                          { stars: 4, count: 31, percentage: 24 },
                          { stars: 3, count: 12, percentage: 10 },
                          { stars: 2, count: 4, percentage: 3 },
                          { stars: 1, count: 2, percentage: 2 }
                        ].map((item) => (
                          <div key={item.stars} className="flex items-center gap-3">
                            <span className="text-sm font-normal text-slate-700 w-6">{item.stars}★</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-400 transition-all duration-500"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-600 w-8">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Dimensional Ratings */}
              <div>
                    <h3 className="text-lg font-normal text-slate-700 mb-3">Quality Breakdown</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { category: 'Image Quality', rating: 4.8, icon: ImageIcon },
                        { category: 'Piece Fit Quality', rating: 4.7, icon: Target },
                        { category: 'Durability', rating: 4.6, icon: Award },
                        { category: 'Overall Experience', rating: 4.6, icon: Star }
                      ].map((item) => (
                        <div key={item.category} className="flex items-center justify-between p-3 glass-card border-white/40 rounded-lg">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-violet-600" />
                            <span className="font-normal text-slate-700 text-sm">{item.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(item.rating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-normal text-slate-700">{item.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
              </div>

                  {/* Individual Reviews */}
                  <div>
                    <h3 className="text-lg font-normal text-slate-700 mb-3">Recent Reviews</h3>
                    <div className="space-y-3">
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
                        }
                      ].map((review, index) => (
                        <div key={index} className="glass-card border-white/40 p-4 rounded-xl">
                          <div className="flex items-start gap-3">
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-normal text-slate-800 text-sm">{review.user}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-1 py-0">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                <span className="text-xs text-slate-500">{review.date}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-slate-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-normal text-slate-700 text-sm">{review.title}</span>
                              </div>
                              
                              <p className="text-slate-600 mb-3 text-sm">{review.review}</p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex gap-3 text-xs text-slate-500">
                                  <span>Image: {review.qualities.imageQuality}★</span>
                                  <span>Fit: {review.qualities.pieceFit}★</span>
                                  <span>Durability: {review.qualities.durability}★</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    Helpful ({review.helpful})
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    Reply
                                  </Button>
                                </div>
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
          </div>

          {/* Rich Sidebar - 1 column */}
          <div className="space-y-4">
            
            {/* Quick Stats */}
            <div className="glass-card border-white/30 rounded-2xl p-5">
              <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-600" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Views
                  </span>
                  <span className="text-slate-800 font-semibold">{mockStats.views.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    Likes
                  </span>
                  <span className="text-slate-800 font-semibold">{mockStats.likes.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                  <span className="text-slate-800 font-semibold">{mockStats.timesCompleted.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Success Rate
                  </span>
                  <span className="text-emerald-600 font-semibold">{mockStats.successRate}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Wishlisted
                  </span>
                  <span className="text-slate-800 font-semibold">{mockStats.wishlistCount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Want to Buy
                  </span>
                  <span className="text-slate-800 font-semibold">{mockStats.wantToBuyCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Avg Time
                  </span>
                  <span className="text-slate-800 font-semibold">{mockStats.averageTime}h</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Difficulty
                  </span>
                  <span className="text-slate-800 font-semibold">{mockStats.communityDifficulty}/10</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Active Solvers
                  </span>
                  <span className="text-violet-600 font-semibold">{mockStats.activeSolvers}</span>
                </div>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="glass-card border-white/30 rounded-2xl p-5">
              <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Pricing
              </h3>
              <div className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-700 mb-1">{mockStats.bestPrice}</div>
                  <div className="text-sm text-emerald-600 font-medium">Best Price Found</div>
                </div>
                <div className="text-center text-sm text-slate-600">
                  Range: {mockStats.priceRange}
                </div>
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Find Best Deals
                </Button>
              </div>
            </div>

            {/* Recent Activity Snapshot */}
            <div className="glass-card border-white/30 rounded-2xl p-5">
              <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                Recent Activity
              </h3>
              <div className="text-sm text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>{mockStats.recentlyAdded} added to collections today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>12 completed this week</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>8 new reviews posted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 