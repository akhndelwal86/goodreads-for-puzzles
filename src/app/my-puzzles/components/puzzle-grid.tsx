'use client'

import type { UserPuzzle } from '@/lib/supabase'
import { PuzzleCard } from './puzzle-card'

interface PuzzleGridProps {
  puzzles: UserPuzzle[]
  onPuzzleClick: (puzzle: UserPuzzle) => void
  onStatusChange?: (puzzleId: string, newStatus: string) => void
  onLogProgress?: (puzzle: UserPuzzle) => void
}

export function PuzzleGrid({ puzzles, onPuzzleClick, onStatusChange, onLogProgress }: PuzzleGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-700">
        {puzzles.length} puzzle{puzzles.length !== 1 ? 's' : ''} found
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {puzzles.map((puzzle) => (
          <PuzzleCard
            key={puzzle.id}
            puzzle={puzzle}
            onPuzzleClick={onPuzzleClick}
            onStatusChange={onStatusChange}
            onLogProgress={onLogProgress}
          />
        ))}
      </div>
    </div>
  )
} 