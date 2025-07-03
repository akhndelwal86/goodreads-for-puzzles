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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-violet-100 to-purple-100" />
            <div className="p-6 space-y-3">
              <div className="h-5 bg-gradient-to-r from-violet-200 to-purple-200 rounded-lg" />
              <div className="h-4 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-lg w-3/4" />
              <div className="h-6 bg-gradient-to-r from-slate-200 to-gray-200 rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (puzzles.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl p-16 text-center">
        <div className="text-6xl mb-6">🧩</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">No puzzles found</h3>
        <p className="text-slate-600 text-lg">Check back soon for featured puzzles!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
