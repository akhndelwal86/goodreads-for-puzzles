'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

  const getDifficultyClass = (pieceCount: number | null) => {
    if (!pieceCount) return 'bg-slate-100 text-slate-600'
    if (pieceCount <= 500) return 'bg-emerald-100 text-emerald-700'
    if (pieceCount <= 1000) return 'bg-amber-100 text-amber-700'
    if (pieceCount <= 2000) return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <Link href={`/puzzles/${puzzle.id}`}>
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={puzzle.image_url || '/placeholder-puzzle.jpg'}
            alt={puzzle.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onToggleFavorite && (
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleToggleFavorite}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
              </Button>
            )}
            {showAddToList && onAddToList && (
              <Button
                size="sm"
                className="w-8 h-8 p-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                onClick={handleAddToList}
                aria-label="Add to List"
                title="Add to List"
              >
                <Plus className="w-4 h-4 text-white" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors duration-300 truncate">
                {puzzle.title}
              </h3>
              <p className="text-sm text-slate-600 mt-1 truncate">
                {puzzle.brand?.name || 'Unknown Brand'}
              </p>
            </div>
            <Badge className={`ml-2 text-xs px-2 py-1 ${getDifficultyClass(puzzle.piece_count)}`}>
              {puzzle.piece_count || 'Unknown'} pieces
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span className="text-sm font-medium text-slate-700">4.8</span>
              <span className="text-xs text-slate-500 ml-1">(24)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>156 solves</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
