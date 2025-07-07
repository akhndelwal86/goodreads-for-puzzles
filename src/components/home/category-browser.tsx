'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  description: string
  puzzleCount: number
  image: string
  gradient: string
  textColor: string
}

export function CategoryBrowser() {
  const categories: Category[] = [
    {
      id: 'nature',
      name: 'Nature & Landscapes',
      description: 'Breathtaking natural scenes and landscapes',
      puzzleCount: 234,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      textColor: 'text-emerald-700'
    },
    {
      id: 'art',
      name: 'Art & Paintings',
      description: 'Famous artworks and artistic masterpieces',
      puzzleCount: 156,
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop',
      gradient: 'from-purple-500/20 to-violet-500/20',
      textColor: 'text-purple-700'
    },
    {
      id: 'animals',
      name: 'Animals & Wildlife',
      description: 'Adorable animals and wildlife photography',
      puzzleCount: 189,
      image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=200&fit=crop',
      gradient: 'from-amber-500/20 to-orange-500/20',
      textColor: 'text-amber-700'
    },
    {
      id: 'architecture',
      name: 'Architecture',
      description: 'Stunning buildings and architectural wonders',
      puzzleCount: 98,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      textColor: 'text-blue-700'
    },
    {
      id: 'vintage',
      name: 'Vintage & Classic',
      description: 'Classic designs and nostalgic themes',
      puzzleCount: 87,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
      gradient: 'from-rose-500/20 to-pink-500/20',
      textColor: 'text-rose-700'
    },
    {
      id: 'fantasy',
      name: 'Fantasy & Fiction',
      description: 'Magical worlds and futuristic scenes',
      puzzleCount: 123,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
      gradient: 'from-violet-500/20 to-purple-500/20',
      textColor: 'text-violet-700'
    },
    {
      id: 'cities',
      name: 'Cities & Travel',
      description: 'Urban landscapes and travel destinations',
      puzzleCount: 145,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      textColor: 'text-cyan-700'
    },
    {
      id: 'food',
      name: 'Food & Drinks',
      description: 'Delicious food and beverage photography',
      puzzleCount: 76,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop',
      gradient: 'from-orange-500/20 to-red-500/20',
      textColor: 'text-orange-700'
    }
  ]

  return (
    <div className="pb-8 bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-slate-800">Browse by Category</h2>
              <p className="text-sm text-slate-600">Discover puzzles by your favorite themes</p>
            </div>
          </div>
          <Link href="/categories">
            <Button variant="outline" size="sm" className="border-violet-200 text-violet-700 hover:bg-violet-50 text-sm">
              View All Categories
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Category Grid - 2 rows, 4 columns with proper aspect ratio */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/puzzles/browse?category=${category.id}`}>
              <Card className="group glass-card hover-lift border-white/40 overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative">
                  {/* Background Image with proper aspect ratio and rounded corners */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden rounded-xl">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-xl"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} via-transparent to-transparent rounded-xl`} />
                    
                    {/* Puzzle Count Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/30">
                        <span className="text-xs font-medium text-slate-700">
                          {category.puzzleCount} puzzles
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content with proper proportions */}
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-slate-800 group-hover:text-violet-700 transition-colors leading-tight line-clamp-1">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                      
                      {/* Browse Link */}
                      <div className="flex items-center justify-end pt-1">
                        <div className={`flex items-center space-x-1 ${category.textColor} group-hover:text-violet-600 transition-colors`}>
                          <span className="text-xs font-medium">Browse</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
