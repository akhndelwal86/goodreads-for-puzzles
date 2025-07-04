'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { UserPuzzleStatus } from '@/lib/supabase'

interface EmptyStateProps {
  activeTab: UserPuzzleStatus | 'all'
  hasSearchTerm: boolean
  onClearFilters: () => void
}

export function EmptyState({ activeTab, hasSearchTerm, onClearFilters }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    if (hasSearchTerm) {
      return {
        emoji: '🔍',
        title: 'No puzzles found',
        description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
        actionText: 'Clear Filters'
      }
    }

    switch (activeTab) {
      case 'completed':
        return {
          emoji: '🧩',
          title: 'No completed puzzles yet',
          description: 'Start solving some puzzles to see them here! Every puzzle completed is a victory worth celebrating.',
          actionText: 'Browse All Puzzles'
        }
      case 'want-to-do':
        return {
          emoji: '🎯',
          title: 'No puzzles in your wishlist',
          description: 'Discover exciting puzzles and add them to your want-to-do list for future solving sessions.',
          actionText: 'Discover Puzzles'
        }
      case 'in-progress':
        return {
          emoji: '⏳',
          title: 'No puzzles in progress',
          description: 'Ready to start a new puzzle adventure? Pick one from your collection and begin solving!',
          actionText: 'Start a Puzzle'
        }
      default:
        return {
          emoji: '🧩',
          title: 'Your puzzle collection is empty',
          description: 'Start building your personal puzzle library by discovering and logging puzzles you love.',
          actionText: 'Discover Puzzles'
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Card className="max-w-md w-full bg-white/50 backdrop-blur-sm border-white/20">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">{content.emoji}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {content.title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {content.description}
          </p>
          <Button 
            onClick={onClearFilters}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {content.actionText}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 