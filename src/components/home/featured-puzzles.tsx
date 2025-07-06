'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Clock, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface FeaturedPuzzle {
  id: string
  title: string
  brand: string
  pieces: number
  image: string
  rating?: number
  difficulty?: string
}

export function FeaturedPuzzles() {
  const [puzzles, setPuzzles] = useState<FeaturedPuzzle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedPuzzles = async () => {
      try {
        // This would typically fetch from an API
        // For now, using mock data
        const mockPuzzles: FeaturedPuzzle[] = [
          {
            id: '1',
            title: 'Mountain Landscape',
            brand: 'Ravensburger',
            pieces: 1000,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
            rating: 4.8,
            difficulty: 'Medium'
          },
          {
            id: '2',
            title: 'Ocean Sunset',
            brand: 'Buffalo Games',
            pieces: 750,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
            rating: 4.6,
            difficulty: 'Easy'
          },
          {
            id: '3',
            title: 'City Skyline',
            brand: 'Cobble Hill',
            pieces: 1500,
            image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&h=200&fit=crop',
            rating: 4.9,
            difficulty: 'Hard'
          }
        ]
        setPuzzles(mockPuzzles)
      } catch (error) {
        console.error('Failed to load featured puzzles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedPuzzles()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Featured Puzzles</h2>
        <Link href="/puzzles/browse">
          <Button variant="outline" className="flex items-center gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {puzzles.map((puzzle) => (
          <Card key={puzzle.id} className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={puzzle.image}
                    alt={puzzle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                    {puzzle.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">{puzzle.brand}</span>
                    <span>{puzzle.pieces} pieces</span>
                  </div>

                  {/* Rating and Difficulty */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {puzzle.rating?.toFixed(1) || '4.8'}
                      </span>
                    </div>
                    {puzzle.difficulty && (
                      <Badge variant="secondary" className="text-xs">
                        {puzzle.difficulty}
                      </Badge>
                    )}
                  </div>

                  {/* Action */}
                  <Link href={`/puzzles/${puzzle.id}`}>
                    <Button className="w-full mt-3">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 