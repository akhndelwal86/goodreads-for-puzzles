'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, Plus, Database, BookOpen, ArrowRight, 
  CheckCircle, Users, Sparkles, PuzzleIcon as Puzzle 
} from 'lucide-react'

export default function AddPuzzlePage() {
  const { user, isLoaded } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`/api/puzzles?search=${encodeURIComponent(term)}&limit=5`)
      const data = await response.json()
      setSearchResults(data.puzzles || [])
    } catch (error) {
      console.error('Error searching puzzles:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Puzzle className="w-8 h-8 text-violet-600" />
            </div>
            <CardTitle>Sign in to Add Puzzles</CardTitle>
            <CardDescription>
              You need to be signed in to contribute puzzles to our community database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Contribute to Community
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800 bg-clip-text text-transparent">
            Add a Puzzle
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Help fellow puzzlers discover new favorites or log your personal puzzle journey.
          </p>
        </div>

        {/* Search First */}
        <Card className="mb-8 border-2 border-dashed border-violet-200 bg-violet-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-violet-600" />
              Search First - Is this puzzle already in our database?
            </CardTitle>
            <CardDescription>
              Before adding a new puzzle, check if it already exists to avoid duplicates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                placeholder="Search for puzzle title, brand, or theme..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Search Results */}
            {searchLoading && (
              <div className="mt-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600 mx-auto"></div>
                <p className="mt-2">Searching...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Found existing puzzles:</p>
                {searchResults.map((puzzle: any) => (
                  <div key={puzzle.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <img 
                      src={puzzle.imageUrl || '/placeholder-puzzle.svg'} 
                      alt={puzzle.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{puzzle.title}</h4>
                      <p className="text-sm text-gray-500">
                        {puzzle.brand?.name} • {puzzle.pieceCount} pieces
                      </p>
                    </div>
                    <Link href={`/puzzles/${puzzle.id}`}>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {searchTerm && !searchLoading && searchResults.length === 0 && (
              <div className="mt-4 text-center text-gray-500">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p>Great! This puzzle doesn't exist yet. You can add it below.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Add New Puzzle */}
          <Card className="border-2 hover:border-violet-300 transition-colors group">
            <CardHeader>
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                <Plus className="w-6 h-6 text-violet-600" />
              </div>
              <CardTitle className="text-xl">Add New Puzzle to Database</CardTitle>
              <CardDescription>
                Contribute a puzzle to our community database for everyone to discover and log.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Helps other puzzlers discover new favorites</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Builds our community puzzle library</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>You can log it to your collection afterward</span>
                </div>
              </div>
              
              <Link href="/puzzles/create">
                <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
                  <Database className="w-4 h-4 mr-2" />
                  Add to Community Database
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Log Existing Puzzle */}
          <Card className="border-2 hover:border-emerald-300 transition-colors group">
            <CardHeader>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Log Existing Puzzle</CardTitle>
              <CardDescription>
                Track your progress on a puzzle that's already in our database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Add to your personal collection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Track completion progress</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Add photos and notes</span>
                </div>
              </div>
              
              <Link href="/puzzles/browse">
                <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <Search className="w-4 h-4 mr-2" />
                  Browse & Log Puzzles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-50/50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Community Guidelines</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Quality Images:</strong> Use clear, well-lit photos of the puzzle box and completed image.
                </div>
                <div>
                  <strong>Accurate Info:</strong> Double-check piece count, brand name, and title spelling.
                </div>
                <div>
                  <strong>No Duplicates:</strong> Always search first to avoid adding puzzles that already exist.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}