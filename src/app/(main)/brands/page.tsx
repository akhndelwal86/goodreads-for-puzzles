'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Building2, Star, Package, Search, Filter, ChevronRight, Globe, Award } from 'lucide-react'
import Link from 'next/link'

interface Brand {
  id: string
  name: string
  puzzleCount: number
  rating: number
  reviewCount: number
  imageUrl: string
  description: string
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'puzzleCount' | 'rating'>('name')

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands')
        const data = await response.json()
        if (data.success) {
          setBrands(data.brands)
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  // Filter and sort brands
  const filteredBrands = brands
    .filter(brand => 
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'puzzleCount':
          return b.puzzleCount - a.puzzleCount
        case 'rating':
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading brands...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🏢 Puzzle Brands
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover the world's leading puzzle manufacturers and find your next favorite brand.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Building2 className="w-8 h-8 text-violet-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{brands.length}</div>
              <div className="text-sm text-slate-600">Total Brands</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {brands.reduce((sum, brand) => sum + brand.puzzleCount, 0)}
              </div>
              <div className="text-sm text-slate-600">Total Puzzles</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {brands.length > 0 ? (brands.reduce((sum, brand) => sum + brand.rating, 0) / brands.length).toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-slate-600">Avg. Rating</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-rose-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {brands.filter(brand => brand.rating >= 4.5).length}
              </div>
              <div className="text-sm text-slate-600">Top Rated</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="glass-card border border-white/40 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                onClick={() => setSortBy('name')}
                size="sm"
              >
                Name
              </Button>
              <Button
                variant={sortBy === 'puzzleCount' ? 'default' : 'outline'}
                onClick={() => setSortBy('puzzleCount')}
                size="sm"
              >
                Puzzles
              </Button>
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                onClick={() => setSortBy('rating')}
                size="sm"
              >
                Rating
              </Button>
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Link key={brand.id} href={`/puzzles/browse?brands=${encodeURIComponent(brand.name)}`}>
              <Card className="glass-card border border-white/40 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-0">
                  {/* Brand Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        {brand.rating}
                      </Badge>
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-slate-800">{brand.name}</h3>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {brand.description}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{brand.puzzleCount} puzzles</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span>{brand.reviewCount} reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No brands found</h3>
            <p className="text-slate-500">
              {searchTerm ? 
                `No brands match your search for "${searchTerm}"` : 
                'No brands available at the moment'
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="glass-card border border-white/40 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Don't see your favorite brand?
            </h2>
            <p className="text-slate-600 mb-6">
              Help us expand our brand collection by suggesting new manufacturers or adding puzzles from missing brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/puzzles/create">
                <Button className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 text-white">
                  Add Puzzle
                </Button>
              </Link>
              <Button variant="outline" className="border-slate-300 text-slate-700">
                Suggest Brand
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
