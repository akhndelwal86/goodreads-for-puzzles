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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  )
} 