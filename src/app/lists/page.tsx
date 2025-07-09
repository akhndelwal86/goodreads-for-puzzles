'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  List, Plus, Search, Filter, Star, Eye, Clock, 
  Users, BookOpen, TrendingUp, Heart 
} from 'lucide-react'
import Link from 'next/link'

export default function ListsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'public' | 'my-lists'>('all')

  // Sample data - replace with real API calls
  const featuredLists = [
    {
      id: '1',
      title: 'Top 50 Puzzles of 2024',
      description: 'The most popular and highest-rated puzzles this year',
      puzzleCount: 50,
      followers: 1247,
      isPublic: true,
      creator: 'PuzzleMaster',
      rating: 4.8,
      lastUpdated: '2 days ago'
    },
    {
      id: '2', 
      title: 'Beginner-Friendly Puzzles',
      description: 'Perfect starting puzzles for newcomers to the hobby',
      puzzleCount: 25,
      followers: 892,
      isPublic: true,
      creator: 'NewbieFriend',
      rating: 4.6,
      lastUpdated: '1 week ago'
    },
    {
      id: '3',
      title: '1000+ Piece Challenges',
      description: 'For those who love a real challenge',
      puzzleCount: 75,
      followers: 654,
      isPublic: true,
      creator: 'ChallengeLover',
      rating: 4.9,
      lastUpdated: '3 days ago'
    }
  ]

  const myLists = [
    {
      id: '4',
      title: 'My Wishlist',
      description: 'Puzzles I want to try next',
      puzzleCount: 12,
      isPublic: false,
      lastUpdated: 'Yesterday'
    },
    {
      id: '5',
      title: 'Completed Favorites',
      description: 'My all-time favorite completed puzzles',
      puzzleCount: 8,
      isPublic: true,
      followers: 23,
      lastUpdated: '5 days ago'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            📋 Puzzle Lists
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover curated puzzle collections and create your own lists to organize your puzzle journey.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search lists..."
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
              All Lists
            </Button>
            <Button
              variant={filterType === 'public' ? 'default' : 'outline'}
              onClick={() => setFilterType('public')}
              size="sm"
            >
              Public
            </Button>
            <Button
              variant={filterType === 'my-lists' ? 'default' : 'outline'}
              onClick={() => setFilterType('my-lists')}
              size="sm"
            >
              My Lists
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create List
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <List className="h-8 w-8 text-violet-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">247</div>
              <div className="text-sm text-slate-600">Public Lists</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">1.2k</div>
              <div className="text-sm text-slate-600">Contributors</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">3.5k</div>
              <div className="text-sm text-slate-600">Total Puzzles</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">+23</div>
              <div className="text-sm text-slate-600">This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Lists */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Featured Lists</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLists.map((list) => (
              <Card key={list.id} className="glass-card border border-white/40 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg text-slate-800 leading-tight">
                      {list.title}
                    </h3>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      Public
                    </Badge>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {list.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{list.puzzleCount} puzzles</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{list.followers} followers</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-slate-600">{list.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{list.lastUpdated}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      by {list.creator}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
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

        {/* My Lists */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">My Lists</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLists.map((list) => (
              <Card key={list.id} className="glass-card border border-white/40 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg text-slate-800 leading-tight">
                      {list.title}
                    </h3>
                    <Badge variant="secondary" className={
                      list.isPublic 
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }>
                      {list.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {list.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{list.puzzleCount} puzzles</span>
                      </div>
                      {list.followers && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-600">{list.followers} followers</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600">{list.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Create New List Card */}
            <Card className="glass-card border border-dashed border-violet-300 hover:border-violet-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[280px]">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  Create New List
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Organize your puzzles into custom lists
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
