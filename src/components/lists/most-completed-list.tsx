'use client'

import { Trophy } from 'lucide-react'
import { SmartListContainer } from './smart-list-container'
import { PuzzleListItem } from './puzzle-list-item'
import { useMostCompleted } from '@/hooks/use-smart-lists'

interface MostCompletedListProps {
  limit?: number
  showContainer?: boolean
  onPuzzleClick?: (puzzleId: string) => void
  onViewAll?: () => void
  className?: string
}

export function MostCompletedList({ 
  limit = 3, 
  showContainer = true, 
  onPuzzleClick,
  onViewAll,
  className 
}: MostCompletedListProps) {
  const { data: puzzles, isLoading, error } = useMostCompleted(limit)

  const content = (
    <>
      {error && (
        <div className="text-sm text-red-600 text-center py-4">
          Failed to load most completed puzzles
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
        <div className="text-sm text-gray-500 text-center py-8">
          No completed puzzles found
        </div>
      )}
    </>
  )

  if (!showContainer) {
    return <div className={className}>{content}</div>
  }

  return (
    <SmartListContainer
      title="Most Completed"
      icon={<Trophy className="w-6 h-6 text-orange-600" />}
      isLoading={isLoading}
      onViewAll={onViewAll}
      className={className}
    >
      {content}
    </SmartListContainer>
  )
} 