'use client'

import { Flame } from 'lucide-react'
import { SmartListContainer } from './smart-list-container'
import { PuzzleListItem } from './puzzle-list-item'
import { useTrending } from '@/hooks/use-smart-lists'

interface TrendingListProps {
  limit?: number
  showContainer?: boolean
  onPuzzleClick?: (puzzleId: string) => void
  onViewAll?: () => void
  className?: string
}

export function TrendingList({ 
  limit = 3, 
  showContainer = true, 
  onPuzzleClick,
  onViewAll,
  className 
}: TrendingListProps) {
  const { data: puzzles, isLoading, error } = useTrending(limit)

  const content = (
    <>
      {error && (
        <div className="text-sm text-red-600 text-center py-4" role="alert">
          <p>Failed to load trending puzzles</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs underline mt-1 hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}
      {puzzles && puzzles.length > 0 ? (
        puzzles.map((puzzle, index) => (
          <PuzzleListItem
            key={puzzle.id}
            puzzle={puzzle}
            rank={index + 1}
            onClick={onPuzzleClick}
          />
        ))
      ) : !isLoading && (
        <div
          className="text-sm text-gray-500 text-center py-8"
          role="status"
          aria-live="polite"
        >
          No trending puzzles found
        </div>
      )}
    </>
  )

  if (!showContainer) {
    return <div className={className}>{content}</div>
  }

  return (
    <SmartListContainer
      title="Trending This Week"
      icon={<Flame className="w-6 h-6 text-red-500" />}
      isLoading={isLoading}
      onViewAll={onViewAll}
      className={className}
    >
      {content}
    </SmartListContainer>
  )
} 