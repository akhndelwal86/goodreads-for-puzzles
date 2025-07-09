'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  FolderOpen, Plus, Search, Filter, Star, Eye, Clock, 
  Users, BookOpen, TrendingUp, Heart, Package, Award,
  Calendar, Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'featured' | 'my-collections'>('all')

  // Sample data - replace with real API calls
  const featuredCollections = [
    {
      id: '1',
      title: 'Van Gogh Masterpieces',
      description: 'Complete collection of Van Gogh puzzle reproductions',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&q=80',
      puzzleCount: 12,
      totalPieces: 14400,
      averageRating: 4.9,
      difficulty: 'Expert',
      brand: 'Ravensburger',
      theme: 'Art',
      completionRate: 85,
      followers: 432,
      isOfficial: true
    },
    {
      id: '2',
      title: 'National Parks Series',
      description: 'Stunning landscapes from Americas most beautiful parks',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80',
      puzzleCount: 8,
      totalPieces: 8000,
      averageRating: 4.7,
      difficulty: 'Intermediate',
      brand: 'Buffalo Games',
      theme: 'Nature',
      completionRate: 92,
      followers: 267,
      isOfficial: true
    },
    {
      id: '3',
      title: 'Fantasy Kingdoms',
      description: 'Epic fantasy artwork collection for adventure lovers',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&q=80',
      puzzleCount: 15,
      totalPieces: 18750,
      averageRating: 4.8,
      difficulty: 'Advanced',
      brand: 'Cobble Hill',
      theme: 'Fantasy',
      completionRate: 76,
      followers: 543,
      isOfficial: true
    }
  ]

  const myCollections = [
    {
      id: '4',
      title: 'My Vintage Collection',
      description: 'Classic puzzles from the 80s and 90s',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80',
      puzzleCount: 6,
      totalPieces: 6000,
      averageRating: 4.5,
      completionRate: 100,
      isPrivate: false
    },
    {
      id: '5',
      title: 'Animal Friends',
      description: 'Cute and cuddly animal puzzles',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&q=80',
      puzzleCount: 10,
      totalPieces: 7500,
      averageRating: 4.3,
      completionRate: 60,
      isPrivate: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            📦 Puzzle Collections
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explore curated puzzle collections from brands, artists, and fellow enthusiasts. Complete entire series and track your progress.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              size="sm"
            >
              All Collections
            </Button>
            <Button
              variant={filterType === 'featured' ? 'default' : 'outline'}
              onClick={() => setFilterType('featured')}
              size="sm"
            >
              Featured
            </Button>
            <Button
              variant={filterType === 'my-collections' ? 'default' : 'outline'}
              onClick={() => setFilterType('my-collections')}
              size="sm"
            >
              My Collections
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <FolderOpen className="h-8 w-8 text-violet-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">47</div>
              <div className="text-sm text-slate-600">Official Collections</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">312</div>
              <div className="text-sm text-slate-600">Total Collections</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">78%</div>
              <div className="text-sm text-slate-600">Avg Completion</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">12</div>
              <div className="text-sm text-slate-600">New This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Collections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Featured Collections</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredCollections.map((collection) => (
              <Card key={collection.id} className="glass-card border border-white/40 hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div className="relative">
                  <img 
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {collection.isOfficial && (
                      <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                        <Award className="h-3 w-3 mr-1" />
                        Official
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-white/80 text-slate-700">
                      {collection.theme}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 rounded-full px-2 py-1 text-xs font-semibold text-slate-700">
                      {collection.completionRate}% complete
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-slate-800 leading-tight mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {collection.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{collection.puzzleCount} puzzles</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{collection.totalPieces.toLocaleString()} pieces</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-slate-600">{collection.averageRating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{collection.followers} followers</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      {collection.difficulty} • {collection.brand}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-violet-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${collection.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View Collection
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Collections */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">My Collections</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myCollections.map((collection) => (
              <Card key={collection.id} className="glass-card border border-white/40 hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div className="relative">
                  <img 
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className={
                      collection.isPrivate 
                        ? "bg-slate-100 text-slate-700 border-slate-200" 
                        : "bg-emerald-100 text-emerald-700 border-emerald-200"
                    }>
                      {collection.isPrivate ? 'Private' : 'Public'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 rounded-full px-2 py-1 text-xs font-semibold text-slate-700">
                      {collection.completionRate}% complete
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-slate-800 leading-tight mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {collection.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{collection.puzzleCount} puzzles</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{collection.totalPieces.toLocaleString()} pieces</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-slate-600">{collection.averageRating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">Last updated</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-violet-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${collection.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Edit Collection
                    </Button>
                    <Button size="sm" variant="outline">
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Create New Collection Card */}
            <Card className="glass-card border border-dashed border-violet-300 hover:border-violet-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  Create New Collection
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Group related puzzles together and track your completion progress
                </p>
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
