'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef } from 'react'

interface Brand {
  id: string
  name: string
  puzzleCount: number
  rating: number
  logo: string
  gradient: string
}

export function PopularBrandsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const brands: Brand[] = [
    {
      id: 'ravensburger',
      name: 'Ravensburger',
      puzzleCount: 156,
      rating: 4.8,
      logo: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop',
      gradient: 'from-emerald-50 to-green-50'
    },
    {
      id: 'buffalo-games',
      name: 'Buffalo Games',
      puzzleCount: 89,
      rating: 4.6,
      logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      gradient: 'from-purple-50 to-violet-50'
    },
    {
      id: 'cobble-hill',
      name: 'Cobble Hill',
      puzzleCount: 67,
      rating: 4.7,
      logo: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
      gradient: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'white-mountain',
      name: 'White Mountain',
      puzzleCount: 124,
      rating: 4.5,
      logo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
      gradient: 'from-amber-50 to-orange-50'
    },
    {
      id: 'eurographics',
      name: 'Eurographics',
      puzzleCount: 78,
      rating: 4.4,
      logo: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
      gradient: 'from-rose-50 to-pink-50'
    },
    {
      id: 'springbok',
      name: 'Springbok',
      puzzleCount: 43,
      rating: 4.6,
      logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
      gradient: 'from-teal-50 to-cyan-50'
    }
  ]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 240
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
      
      // Update scroll state
      setTimeout(() => {
        if (scrollRef.current) {
          setCanScrollLeft(scrollRef.current.scrollLeft > 0)
          setCanScrollRight(
            scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          )
        }
      }, 300)
    }
  }

  return (
    <div className="pb-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <span className="text-lg">🏭</span>
            </div>
            <div>
              <h2 className="text-lg font-medium text-slate-800">Popular Brands</h2>
              <p className="text-sm text-slate-600">Trusted puzzle manufacturers</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/brands">
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

        {/* Brands Carousel - Much Wider Cards */}
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {brands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.id}`}>
              <Card className={`group glass-card hover-lift border-white/40 w-56 h-24 flex-shrink-0 bg-gradient-to-br ${brand.gradient} transition-all duration-300 hover:shadow-lg`}>
                <CardContent className="p-3 h-full">
                  <div className="flex items-center h-full space-x-3">
                    {/* Brand Logo */}
                    <div className="flex-shrink-0">
                      <img 
                        src={brand.logo}
                        alt={brand.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/60"
                      />
                    </div>

                    {/* Brand Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-slate-800 group-hover:text-violet-700 transition-colors leading-tight truncate">
                        {brand.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {brand.puzzleCount} puzzles
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs font-medium text-slate-700">{brand.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center mt-1.5">
                        <div className="flex items-center space-x-1 text-violet-600 group-hover:text-violet-700 transition-colors">
                          <span className="text-xs font-medium">Browse Collection</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
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
