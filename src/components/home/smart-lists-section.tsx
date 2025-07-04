import { TrendingList, MostCompletedList, RecentlyAddedList } from '@/components/lists'

interface SmartListsSectionProps {
  onPuzzleClick?: (puzzleId: string) => void
  onViewAll?: (listType: 'trending' | 'most-completed' | 'recently-added') => void
}

export function SmartListsSection({ onPuzzleClick, onViewAll }: SmartListsSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="sr-only">Smart Puzzle Lists</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrendingList 
          onPuzzleClick={onPuzzleClick}
          onViewAll={() => onViewAll?.('trending')}
        />
        
        <MostCompletedList 
          onPuzzleClick={onPuzzleClick}
          onViewAll={() => onViewAll?.('most-completed')}
        />
        
        <RecentlyAddedList 
          onPuzzleClick={onPuzzleClick}
          onViewAll={() => onViewAll?.('recently-added')}
        />
      </div>
    </section>
  )
} 