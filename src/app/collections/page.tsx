'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, Star, Eye, Users, BookOpen, Heart, Package, Award,
  Sparkles, TrendingUp, Clock, Globe, Lock, Crown, Plus,
  Filter, Grid3X3, List, ChevronRight, Loader2
} from 'lucide-react'
import { CreateCollectionModal } from '@/components/collections/create-collection-modal'
import { cn } from '@/lib/utils'

interface Collection {
  id: string
  name: string
  description: string
  collection_type: 'official' | 'user-created' | 'brand' | 'auto-generated'
  collection_source?: 'created' | 'followed'
  theme: string
  visibility: 'public' | 'private' | 'friends-only'
  cover_image_url?: string
  puzzle_count: number
  average_rating: number
  follower_count: number
  likes_count: number
  is_featured: boolean
  creator_username?: string
  creator_avatar?: string
  created_at: string
  followed_at?: string
  isFollowing?: boolean
}

interface Theme {
  id: string
  name: string
  display_name: string
  description: string
  icon_name: string
  color_class: string
  collection_count: number
}

export default function CollectionsPage() {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('featured')
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Data states
  const [collections, setCollections] = useState<Collection[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({})

  // Load data on component mount
  useEffect(() => {
    loadThemes()
    loadCollections()
  }, [])

  // Reload collections when filters change
  useEffect(() => {
    loadCollections()
  }, [activeTab, selectedTheme, searchTerm])

  const loadThemes = async () => {
    try {
      const response = await fetch('/api/collections/themes')
      const data = await response.json()
      setThemes(data.themes || [])
    } catch (error) {
      console.error('Error loading themes:', error)
    }
  }

  const loadCollections = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Set collection type based on active tab
      switch (activeTab) {
        case 'featured':
          params.append('featured', 'true')
          break
        case 'official':
          params.append('type', 'official')
          break
        case 'community':
          params.append('type', 'user-created')
          break
        case 'my-collections':
          if (user) params.append('userId', user.id)
          break
      }
      
      if (selectedTheme) params.append('theme', selectedTheme)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/collections?${params}`)
      const data = await response.json()
      setCollections(data.collections || [])
      
    } catch (error) {
      console.error('Error loading collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = (collection: any) => {
    loadCollections()
    setActiveTab('my-collections')
  }

  // Follow/unfollow functionality
  const handleFollowToggle = useCallback(async (collectionId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!user) return

    const isCurrentlyFollowing = followStates[collectionId]
    
    try {
      const response = await fetch(`/api/collections/${collectionId}/follow`, {
        method: isCurrentlyFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setFollowStates(prev => ({
          ...prev,
          [collectionId]: !isCurrentlyFollowing
        }))
      } else {
        console.error('Failed to toggle follow status')
      }
    } catch (error) {
      console.error('Error toggling follow status:', error)
    }
  }, [user, followStates])

  // Load follow states for authenticated users
  const loadFollowStates = useCallback(async () => {
    if (!user || collections.length === 0) return

    try {
      const followPromises = collections.map(async (collection) => {
        const response = await fetch(`/api/collections/${collection.id}/follow`)
        const data = await response.json()
        return { id: collection.id, isFollowing: data.isFollowing }
      })

      const followResults = await Promise.all(followPromises)
      const newFollowStates = followResults.reduce((acc, result) => {
        acc[result.id] = result.isFollowing
        return acc
      }, {} as Record<string, boolean>)

      setFollowStates(newFollowStates)
    } catch (error) {
      console.error('Error loading follow states:', error)
    }
  }, [user, collections])

  // Load follow states when collections change
  useEffect(() => {
    loadFollowStates()
  }, [collections, loadFollowStates])

  const getCollectionTypeIcon = (type: Collection['collection_type']) => {
    switch (type) {
      case 'official': return <Crown className="w-4 h-4 text-amber-500" />
      case 'brand': return <Award className="w-4 h-4 text-blue-500" />
      case 'auto-generated': return <Sparkles className="w-4 h-4 text-violet-500" />
      default: return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getVisibilityIcon = (visibility: Collection['visibility']) => {
    switch (visibility) {
      case 'public': return <Globe className="w-3 h-3 text-green-500" />
      case 'private': return <Lock className="w-3 h-3 text-gray-500" />
      case 'friends-only': return <Users className="w-3 h-3 text-blue-500" />
    }
  }

  const getThemedBackground = (theme: string) => {
    switch (theme) {
      case 'art':
        return 'bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300'
      case 'nature':
        return 'bg-gradient-to-br from-green-200 via-emerald-100 to-green-300'
      case 'animals':
        return 'bg-gradient-to-br from-orange-200 via-amber-100 to-orange-300'
      case 'fantasy':
        return 'bg-gradient-to-br from-violet-200 via-purple-100 to-violet-300'
      case 'vintage':
        return 'bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300'
      case 'travel':
        return 'bg-gradient-to-br from-red-200 via-rose-100 to-red-300'
      case 'food':
        return 'bg-gradient-to-br from-yellow-200 via-orange-100 to-yellow-300'
      case 'seasonal':
        return 'bg-gradient-to-br from-cyan-200 via-blue-100 to-cyan-300'
      default:
        return 'bg-gradient-to-br from-violet-200 via-purple-100 to-violet-300'
    }
  }

  const getThemedIcon = (theme: string) => {
    switch (theme) {
      case 'art':
        return '🎨'
      case 'nature':
        return '🏔️'
      case 'animals':
        return '🦁'
      case 'fantasy':
        return '🏰'
      case 'vintage':
        return '🕰️'
      case 'travel':
        return '🗺️'
      case 'food':
        return '🍽️'
      case 'seasonal':
        return '❄️'
      default:
        return '🧩'
    }
  }

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <Card className="glass-card border border-white/40 hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="relative">
        <div className={`w-full h-48 ${getThemedBackground(collection.theme)} flex items-center justify-center relative`}>
          {collection.cover_image_url ? (
            <img 
              src={collection.cover_image_url}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-2 opacity-80">
                {getThemedIcon(collection.theme)}
              </div>
              <div className="text-sm font-medium text-slate-600 capitalize">
                {collection.theme} Collection
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute top-4 left-4 flex gap-2">
          {getCollectionTypeIcon(collection.collection_type)}
          <Badge className={cn(
            collection.collection_type === 'official' 
              ? "bg-amber-500 text-white border-0 shadow-lg"
              : "bg-white/80 text-slate-700"
          )}>
            {collection.collection_type === 'official' ? 'Official' : 
             collection.collection_type === 'brand' ? 'Brand' :
             collection.collection_type === 'auto-generated' ? 'Auto' : 'Community'}
          </Badge>
          {collection.theme && (
            <Badge variant="secondary" className="bg-white/80 text-slate-700">
              {collection.theme}
            </Badge>
          )}
          {/* Show source badge only in My Collections tab */}
          {activeTab === 'my-collections' && collection.collection_source && (
            <Badge 
              variant="secondary" 
              className={cn(
                "shadow-sm",
                collection.collection_source === 'created' 
                  ? "bg-blue-50 text-blue-700 border-blue-200" 
                  : "bg-pink-50 text-pink-700 border-pink-200"
              )}
            >
              {collection.collection_source === 'created' ? 'Created by you' : 'Following'}
            </Badge>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {getVisibilityIcon(collection.visibility)}
          {collection.is_featured && (
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-slate-800 leading-tight mb-2 group-hover:text-violet-600 transition-colors">
            {collection.name}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 mb-3">
            {collection.description}
          </p>
          
          {collection.creator_username && collection.collection_type === 'user-created' && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full" />
              <span>by {collection.creator_username}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">{collection.puzzle_count} puzzles</span>
            </div>
            {collection.average_rating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-slate-600">{collection.average_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">{collection.follower_count} followers</span>
            </div>
          </div>
          
        </div>
        
        <div className="flex gap-2 mt-4">
          <Link href={`/puzzles/browse?collection=${collection.id}`} className="flex-1">
            <Button size="sm" className="w-full group-hover:bg-violet-600 transition-colors">
              <Eye className="h-3 w-3 mr-1" />
              View Collection
            </Button>
          </Link>
          {user ? (
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => handleFollowToggle(collection.id, e)}
              className={cn(
                "transition-colors",
                (followStates[collection.id] || collection.collection_source === 'followed')
                  ? "bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100" 
                  : "hover:bg-pink-50 hover:border-pink-200"
              )}
            >
              <Heart className={cn(
                "h-3 w-3",
                (followStates[collection.id] || collection.collection_source === 'followed') 
                  ? "fill-pink-500 text-pink-500" : ""
              )} />
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              <Heart className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            <Package className="inline-block w-10 h-10 mr-3 text-violet-600" />
            Puzzle Collections
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover curated collections, create your own themed sets, and track your completion progress across entire series.
          </p>
        </div>

        {/* Search and Create Bar */}
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
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              size="sm"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            {user && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Collection
              </Button>
            )}
          </div>
        </div>


        {/* Theme Filter */}
        {themes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Browse by Theme</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedTheme === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTheme(null)}
              >
                All Themes
              </Button>
              {themes.map((theme) => (
                <Button
                  key={theme.id}
                  variant={selectedTheme === theme.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTheme(theme.name)}
                  className="whitespace-nowrap"
                >
                  {theme.display_name}
                  <Badge variant="secondary" className="ml-2">
                    {theme.collection_count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto p-1">
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="official" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Official
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            {user && (
              <TabsTrigger value="my-collections" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                My Collections
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className={cn(
                "gap-6",
                viewMode === 'grid' 
                  ? "grid lg:grid-cols-2 xl:grid-cols-3" 
                  : "space-y-4"
              )}>
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
                
                {/* Create New Collection Card for My Collections */}
                {activeTab === 'my-collections' && user && (
                  <Card 
                    className="glass-card border border-dashed border-violet-300 hover:border-violet-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setShowCreateModal(true)}
                  >
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
                )}
              </div>
            )}

            {!loading && collections.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {activeTab === 'my-collections' 
                    ? "No collections yet" 
                    : "No collections found"
                  }
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === 'my-collections' 
                    ? "You haven't created or followed any collections yet"
                    : searchTerm || selectedTheme 
                      ? "Try adjusting your search criteria"
                      : "Be the first to create a collection!"
                  }
                </p>
                {user && activeTab === 'my-collections' && (
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Collection
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('featured')}
                      variant="outline"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Browse Collections
                    </Button>
                  </div>
                )}
                {user && activeTab !== 'my-collections' && (
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Collection
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Collection Modal */}
        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  )
}
