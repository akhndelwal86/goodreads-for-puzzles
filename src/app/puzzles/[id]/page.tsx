'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Clock, 
  Users, 
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Flame,
  TrendingUp,
  Image as ImageIcon
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
    year?: number
    created_at: string
    brand?: {
      id: string
      name: string
    }
    avgRating?: number
    reviewCount?: number
    avgCompletionTime?: number
    difficulty?: number
    totalSolved?: number
    inWishlists?: number
  }
}

export default function PuzzleDetailPage() {
  const params = useParams()
  const { user } = useUser()
  const puzzleId = params.id as string
  const [puzzleData, setPuzzleData] = useState<PuzzleDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchPuzzle = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Comprehensive dummy data
      const dummyPuzzle: PuzzleDetail = {
        puzzle: {
          id: puzzleId,
          title: "Majestic Mountain Lake Reflection",
          piece_count: 1000,
          image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
          theme: "Nature & Landscapes",
          material: "Premium Cardboard",
          description: "A breathtaking view of crystal-clear lake waters perfectly reflecting towering mountain peaks during golden hour. This challenging puzzle features subtle color gradations and intricate details that will test even experienced puzzlers.",
          year: 2023,
          created_at: "2023-11-15T10:30:00Z",
          brand: {
            id: "ravensburger-001",
            name: "Ravensburger"
          },
          avgRating: 4.7,
          reviewCount: 127,
          avgCompletionTime: 14.5, // hours
          difficulty: 4.2,
          totalSolved: 2847,
          inWishlists: 1523
        }
      }
      
      setPuzzleData(dummyPuzzle)
        setLoading(false)
      }

    fetchPuzzle()
  }, [puzzleId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!puzzleData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Puzzle not found</h1>
            <Link href="/puzzles/browse">
            <Button>Browse Puzzles</Button>
            </Link>
        </div>
      </div>
    )
  }

  const { puzzle } = puzzleData

  // Generate dummy community stats
  const communityStats = [
    { label: "Total Solved", value: puzzle.totalSolved?.toLocaleString() || "2,847", icon: Users },
    { label: "In Wishlists", value: puzzle.inWishlists?.toLocaleString() || "1,523", icon: Heart },
    { label: "Avg Time", value: `${puzzle.avgCompletionTime || 14.5}h`, icon: Clock },
    { label: "Difficulty", value: `${puzzle.difficulty || 4.2}/5`, icon: TrendingUp }
  ]

  // Generate dummy reviews
  const dummyReviews = [
    {
      id: 1,
      user: { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face" },
      rating: 5,
      date: "2 days ago",
      content: "Absolutely loved this puzzle! The colors are vibrant and the pieces fit perfectly. Took me about 12 hours over a weekend.",
      helpful: 8,
      photos: 2
    },
    {
      id: 2,
      user: { name: "Mike R.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" },
      rating: 4,
      date: "1 week ago", 
      content: "Great quality puzzle with a beautiful image. Some sections with similar colors were quite challenging but very rewarding.",
      helpful: 5,
      photos: 0
    },
    {
      id: 3,
      user: { name: "Emma L.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" },
      rating: 5,
      date: "2 weeks ago",
      content: "This is now one of my favorite puzzles! The reflection details are incredible. Perfect for a relaxing evening.",
      helpful: 12,
      photos: 3
    }
  ]

  // Generate dummy related puzzles
  const relatedPuzzles = [
    {
      id: 1,
      title: "Alpine Sunrise",
      brand: "Ravensburger",
      pieces: 500,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1464822759844-d150baec843c?w=300&h=200&fit=crop",
      theme: "Mountains"
    },
    {
      id: 2, 
      title: "Forest Lake",
      brand: "Ravensburger",
      pieces: 1000,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
      theme: "Nature"
    },
    {
      id: 3,
      title: "Mountain Cabin",
      brand: "Ravensburger", 
      pieces: 750,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      theme: "Architecture"
    },
    {
      id: 4,
      title: "Crystal Waters",
      brand: "Ravensburger",
      pieces: 1000,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      theme: "Water"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/puzzles/browse">
            <Button variant="ghost" className="gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
            </Button>
        </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200">
              {puzzle.image_url ? (
                <Image
                  src={puzzle.image_url}
                  alt={puzzle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/brands/${puzzle.brand?.id}`} className="text-orange-600 hover:text-orange-700 font-medium">
                  {puzzle.brand?.name || 'Unknown Brand'}
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{puzzle.year || '2023'}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{puzzle.title}</h1>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {puzzle.description || 'A beautiful and challenging puzzle perfect for puzzle enthusiasts of all skill levels.'}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(puzzle.avgRating || 4.7)
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {puzzle.avgRating || 4.7}
                  </span>
                  <span className="text-gray-500">
                    ({puzzle.reviewCount || 127} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-2xl font-bold text-gray-900">{puzzle.piece_count.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Pieces</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-2xl font-bold text-gray-900">{puzzle.avgCompletionTime || 14.5}h</div>
                <div className="text-sm text-gray-600">Avg Time</div>
                  </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-2xl font-bold text-gray-900">{puzzle.difficulty || 4.2}/5</div>
                <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">{puzzle.avgRating || 4.7}</span>
                  </div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white gap-2">
                <Bookmark className="w-4 h-4" />
                Add to List
                  </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Star className="w-4 h-4" />
                Rate & Review
                  </Button>
            </div>
          </div>
        </div>

        {/* Community Stats Strip */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 mx-auto mb-2">
                  <stat.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Where to Buy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Where to Buy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { store: "Amazon", price: "$24.99", shipping: "Free shipping", url: "#" },
              { store: "Target", price: "$26.99", shipping: "In store pickup", url: "#" },
              { store: "Puzzle Warehouse", price: "$22.99", shipping: "Expert selection", url: "#" }
            ].map((retailer, index) => (
              <a
                key={index}
                href={retailer.url}
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{retailer.store}</div>
                <div className="text-lg font-bold text-orange-600">{retailer.price}</div>
                <div className="text-sm text-gray-600">{retailer.shipping}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Community Reviews
            </h2>
            <Button variant="outline" size="sm">
              Write Review
                  </Button>
          </div>

          <div className="space-y-6">
            {dummyReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-4">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-amber-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{review.content}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </button>
                      {review.photos > 0 && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <ImageIcon className="w-4 h-4" />
                          {review.photos} photos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Puzzles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            More from {puzzle.brand?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPuzzles.map((related) => (
              <Link
                key={related.id}
                href={`/puzzles/${related.id}`}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={related.image}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {related.brand} • {related.pieces} pieces
                  </p>
              <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{related.rating}</span>
                    <span className="text-sm text-gray-500">rating</span>
              </div>
            </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 