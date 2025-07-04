'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { UserPuzzle } from '@/lib/supabase'

interface PuzzleGridProps {
  puzzles: UserPuzzle[]
  onPuzzleClick: (puzzle: UserPuzzle) => void
}

export function PuzzleGrid({ puzzles, onPuzzleClick }: PuzzleGridProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">⏳ In Progress</Badge>
      case 'want-to-do':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">🎯 Want to Do</Badge>
      case 'abandoned':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">❌ Abandoned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTime = (seconds?: number) => {
    if (!seconds) return null
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {puzzles.map((puzzle) => (
        <Card
          key={puzzle.id}
          className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/20"
          onClick={() => onPuzzleClick(puzzle)}
        >
          <CardContent className="p-0">
            {/* Puzzle Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
              <Image
                src={puzzle.image || '/placeholder-puzzle.svg'}
                alt={puzzle.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              
              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                {getStatusBadge(puzzle.status)}
              </div>

              {/* Rating */}
              {puzzle.rating && (
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  ⭐ {puzzle.rating}/5
                </div>
              )}
            </div>

            {/* Puzzle Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                {puzzle.title}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{puzzle.brand}</span>
                  <span>{puzzle.pieces} pieces</span>
                </div>

                {/* Completion Date or Time Spent */}
                {puzzle.status === 'completed' && puzzle.completedAt && (
                  <div className="text-xs text-green-600">
                    Completed {new Date(puzzle.completedAt).toLocaleDateString()}
                  </div>
                )}

                {puzzle.timeSpent && (
                  <div className="text-xs text-blue-600">
                    ⏱️ {formatTime(puzzle.timeSpent)}
                  </div>
                )}

                {/* Difficulty */}
                {puzzle.difficulty && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">Difficulty:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xs ${
                            star <= puzzle.difficulty! ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Preview */}
                {puzzle.notes && (
                  <div className="text-xs text-gray-500 line-clamp-2">
                    💭 {puzzle.notes}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 