import { TrendingList, MostCompletedList, RecentlyAddedList } from '@/components/lists'

interface SmartListsSectionProps {
  onPuzzleClick?: (puzzleId: string) => void
  onViewAll?: (listType: 'trending' | 'most-completed' | 'recently-added') => void
}

export function SmartListsSection({ onPuzzleClick, onViewAll }: SmartListsSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="sr-only">Smart Puzzle Lists</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4">
          <TrendingList 
            onPuzzleClick={onPuzzleClick}
            onViewAll={() => onViewAll?.('trending')}
          />
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4">
          <MostCompletedList 
            onPuzzleClick={onPuzzleClick}
            onViewAll={() => onViewAll?.('most-completed')}
          />
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
          <RecentlyAddedList 
            onPuzzleClick={onPuzzleClick}
            onViewAll={() => onViewAll?.('recently-added')}
          />
        </div>
      </div>
    </section>
  )
} 
