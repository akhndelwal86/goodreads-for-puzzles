'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

interface Brand {
  id: string
  name: string
  puzzleCount: number
  rating: number
  reviewCount: number
  imageUrl: string
  description: string
}

export function PopularBrandsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real brands data from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands')
        const data = await response.json()
        
        if (data.success && data.brands) {
          setBrands(data.brands)
          console.log('🏷️ Popular brands loaded:', data.brands.length)
        } else {
          console.error('❌ Failed to fetch brands:', data.error)
        }
      } catch (error) {
        console.error('❌ Error fetching brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 240 // Card width + gap
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    const current = scrollRef.current
    if (current) {
      current.addEventListener('scroll', updateScrollButtons)
      updateScrollButtons() // Initial check
      
      return () => current.removeEventListener('scroll', updateScrollButtons)
    }
  }, [brands])

  // Loading skeleton
  if (loading) {
    return (
      <div className="glass-card border-white/30 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 bg-slate-200 rounded w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-8 bg-slate-200 rounded w-20 animate-pulse"></div>
            <div className="flex space-x-1">
              <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-56 h-24 bg-slate-200 rounded-lg animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>
    )
  }

  // Show message if no brands found
  if (!loading && brands.length === 0) {
    return (
      <div className="glass-card border-white/30 p-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Popular Brands</h2>
          <p className="text-slate-600">No brands available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card border-white/30 p-8">
      <div className="max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-1">Popular Brands</h2>
            <p className="text-slate-600 text-sm">Discover puzzles from top manufacturers</p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/puzzles/browse">
              <Button variant="outline" size="sm" className="border-violet-200 text-violet-700 hover:bg-violet-50 text-sm">
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
            
            {/* Carousel Controls */}
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-8 h-8 p-0 border-slate-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-8 h-8 p-0 border-slate-200 disabled:opacity-50"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Brands Carousel */}
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {brands.map((brand) => (
            <Link key={brand.id} href={`/puzzles/browse?brands=${encodeURIComponent(brand.name)}`}>
              <Card className="group glass-card hover-lift border-white/40 w-56 h-20 flex-shrink-0 bg-gradient-to-br from-white to-slate-50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-3 h-full">
                  <div className="flex items-center h-full space-x-3">
                    {/* Brand Logo */}
                    <div className="flex-shrink-0">
                      <img 
                        src={brand.imageUrl}
                        alt={brand.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/60"
                        onError={(e) => {
                          // Fallback to default image if brand image fails
                          const target = e.target as HTMLImageElement
                          target.src = `https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop&q=80`
                        }}
                      />
                    </div>

                    {/* Brand Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-slate-800 group-hover:text-violet-700 transition-colors leading-tight truncate">
                        {brand.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {brand.puzzleCount} puzzle{brand.puzzleCount !== 1 ? 's' : ''}
                        </div>
                        {brand.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span className="text-xs font-medium text-slate-700">
                              {brand.rating}
                            </span>
                            {brand.reviewCount > 0 && (
                              <span className="text-xs text-slate-500">
                                ({brand.reviewCount})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Add custom scrollbar hiding styles */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  )
}
