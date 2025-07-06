'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Users, Clock, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
    uploader?: {
      id: string
      username: string
    }
  }
  communityStats: {
    wantToBuy: number
    backlog: number
    inProgress: number
    completed: number
    averageTime: number
  }
}

export default function PuzzleDetailPage() {
  const { user } = useUser()
  const params = useParams()
  const puzzleId = params.id as string

  const [puzzleData, setPuzzleData] = useState<PuzzleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPuzzleData = async () => {
      try {
        const response = await fetch(`/api/puzzles/${puzzleId}`)
        if (response.ok) {
          const data = await response.json()
          setPuzzleData(data)
        } else {
          setError('Failed to load puzzle details')
        }
      } catch (err) {
        setError('An error occurred while loading the puzzle')
      } finally {
        setLoading(false)
      }
    }

    if (puzzleId) {
      loadPuzzleData()
    }
  }, [puzzleId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading puzzle details...</div>
        </div>
      </div>
    )
  }

  if (error || !puzzleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">{error || 'Puzzle not found'}</p>
            <Link href="/puzzles/browse">
              <Button>Back to Browse</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { puzzle, communityStats } = puzzleData

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/puzzles/browse" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              {puzzle.image_url ? (
                <Image
                  src={puzzle.image_url}
                  alt={puzzle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Clock className="w-16 h-16" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{puzzle.title}</h1>
              {puzzle.brand && (
                <p className="text-xl text-gray-600 mb-4">{puzzle.brand.name}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{puzzle.piece_count} pieces</Badge>
                {puzzle.theme && <Badge variant="outline">{puzzle.theme}</Badge>}
                {puzzle.material && <Badge variant="outline">{puzzle.material}</Badge>}
                {puzzle.year && <Badge variant="outline">{puzzle.year}</Badge>}
              </div>
            </div>

            {/* Description */}
            {puzzle.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{puzzle.description}</p>
              </div>
            )}

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{communityStats.completed}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{communityStats.inProgress}</div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{communityStats.averageTime}h</div>
                    <div className="text-sm text-gray-600">Avg. Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4.8</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {user && (
              <div className="space-y-3">
                <Link href={`/my-puzzles`}>
                  <Button className="w-full">
                    Add to My Collection
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Rate
                  </Button>
                  <Button variant="outline">
                    Share
                  </Button>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-sm text-gray-500 space-y-1">
              {puzzle.uploader && (
                <div>Added by {puzzle.uploader.username}</div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Added {new Date(puzzle.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 