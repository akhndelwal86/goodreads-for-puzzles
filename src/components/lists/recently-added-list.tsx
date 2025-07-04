'use client'

import { Plus } from 'lucide-react'
import { SmartListContainer } from './smart-list-container'
import { PuzzleListItem } from './puzzle-list-item'
import { useRecentlyAdded } from '@/hooks/use-smart-lists'

interface RecentlyAddedListProps {
  limit?: number
  showContainer?: boolean
  onPuzzleClick?: (puzzleId: string) => void
  onViewAll?: () => void
  className?: string
}

export function RecentlyAddedList({ 
  limit = 3, 
  showContainer = true, 
  onPuzzleClick,
  onViewAll,
  className 
}: RecentlyAddedListProps) {
  const { data: puzzles, isLoading, error } = useRecentlyAdded(limit)

  const content = (
    <>
      {error && (
        <div className="text-sm text-red-600 text-center py-4">
          Failed to load recently added puzzles
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
          No recently added puzzles found
        </div>
      )}
    </>
  )

  if (!showContainer) {
    return <div className={className}>{content}</div>
  }

  return (
    <SmartListContainer
      title="Recently Added"
      icon={<Plus className="w-6 h-6 text-green-600" />}
      isLoading={isLoading}
      onViewAll={onViewAll}
      className={className}
    >
      {content}
    </SmartListContainer>
  )
} 