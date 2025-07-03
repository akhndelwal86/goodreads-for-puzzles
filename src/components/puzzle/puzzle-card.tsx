'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Puzzle } from '@/types/database'

interface PuzzleCardProps {
  puzzle: Puzzle
  showAddToList?: boolean
  onAddToList?: (puzzleId: string) => void
  onToggleFavorite?: (puzzleId: string) => void
  isFavorited?: boolean
}

export function PuzzleCard({ 
  puzzle, 
  showAddToList = true,
  onAddToList,
  onToggleFavorite,
  isFavorited = false
}: PuzzleCardProps) {
  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault()
    onAddToList?.(puzzle.id)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggleFavorite?.(puzzle.id)
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <Link href={`/puzzles/${puzzle.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {puzzle.image_url ? (
            <Image
              src={puzzle.image_url}
              alt={puzzle.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 hover:bg-white"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Title and Brand */}
          <div>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {puzzle.title}
            </h3>
            {puzzle.brand && (
              <p className="text-xs text-gray-600">{puzzle.brand.name}</p>
            )}
          </div>

          {/* Piece count and rating */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{puzzle.piece_count} pieces</span>
            {puzzle.stats?.avg_rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{puzzle.stats.avg_rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {puzzle.tags && puzzle.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {puzzle.tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {puzzle.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{puzzle.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Add to list button */}
          {showAddToList && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={handleAddToList}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to List
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}