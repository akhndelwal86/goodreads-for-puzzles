'use client'

import { PuzzleCard } from './puzzle-card'
import type { Puzzle } from '@/types/database'

interface PuzzleGridProps {
  puzzles: Puzzle[]
  isLoading?: boolean
  onAddToList?: (puzzleId: string) => void
  onToggleFavorite?: (puzzleId: string) => void
  favoritedPuzzles?: Set<string>
}

export function PuzzleGrid({ 
  puzzles, 
  isLoading = false,
  onAddToList,
  onToggleFavorite,
  favoritedPuzzles = new Set()
}: PuzzleGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (puzzles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🧩</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No puzzles found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {puzzles.map((puzzle) => (
        <PuzzleCard
          key={puzzle.id}
          puzzle={puzzle}
          onAddToList={onAddToList}
          onToggleFavorite={onToggleFavorite}
          isFavorited={favoritedPuzzles.has(puzzle.id)}
        />
      ))}
    </div>
  )
}