'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Search, Filter } from 'lucide-react'

interface EmptyStateProps {
  activeTab: string
  hasSearchTerm: boolean
  onClearFilters: () => void
}

export function EmptyState({ activeTab, hasSearchTerm, onClearFilters }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    if (hasSearchTerm) {
      return {
        icon: <Search className="w-16 h-16 text-gray-400" />,
        title: 'No puzzles found',
        description: 'Try adjusting your search terms or filters.',
        action: {
          label: 'Clear Filters',
          onClick: onClearFilters,
          icon: <Filter className="w-4 h-4" />
        }
      }
    }

    switch (activeTab) {
      case 'wishlist':
        return {
          icon: <PlusCircle className="w-16 h-16 text-purple-400" />,
          title: 'No puzzles in your wishlist',
          description: 'Start building your collection by adding puzzles you want to buy.',
          action: {
            label: 'Browse Puzzles',
            onClick: () => window.location.href = '/puzzles/browse',
            icon: <Search className="w-4 h-4" />
          }
        }
      
      case 'library':
        return {
          icon: <PlusCircle className="w-16 h-16 text-blue-400" />,
          title: 'No puzzles in your library',
          description: 'Add puzzles you own but haven\'t started solving yet.',
          action: {
            label: 'Browse Puzzles',
            onClick: () => window.location.href = '/puzzles/browse',
            icon: <Search className="w-4 h-4" />
          }
        }
      
      case 'in-progress':
        return {
          icon: <PlusCircle className="w-16 h-16 text-yellow-400" />,
          title: 'No puzzles in progress',
          description: 'Start working on a puzzle from your library.',
          action: {
            label: 'View Library',
            onClick: () => onClearFilters(),
            icon: <PlusCircle className="w-4 h-4" />
          }
        }
      
      case 'completed':
        return {
          icon: <PlusCircle className="w-16 h-16 text-green-400" />,
          title: 'No completed puzzles yet',
          description: 'Complete your first puzzle to see it here.',
          action: {
            label: 'Browse Puzzles',
            onClick: () => window.location.href = '/puzzles/browse',
            icon: <Search className="w-4 h-4" />
          }
        }
      
      case 'abandoned':
        return {
          icon: <PlusCircle className="w-16 h-16 text-red-400" />,
          title: 'No abandoned puzzles',
          description: 'Puzzles you\'ve given up on will appear here.',
          action: {
            label: 'Browse Puzzles',
            onClick: () => window.location.href = '/puzzles/browse',
            icon: <Search className="w-4 h-4" />
          }
        }
      
      default:
        return {
          icon: <PlusCircle className="w-16 h-16 text-gray-400" />,
          title: 'No puzzles in your collection',
          description: 'Start building your puzzle collection by adding puzzles you want to solve.',
          action: {
            label: 'Browse Puzzles',
            onClick: () => window.location.href = '/puzzles/browse',
            icon: <Search className="w-4 h-4" />
          }
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {content.icon}
        <h3 className="mt-6 text-xl font-semibold text-gray-900">{content.title}</h3>
        <p className="mt-2 text-gray-600 max-w-sm">{content.description}</p>
        <Button 
          className="mt-6 flex items-center gap-2"
          onClick={content.action.onClick}
        >
          {content.action.icon}
          {content.action.label}
        </Button>
      </CardContent>
    </Card>
  )
} 