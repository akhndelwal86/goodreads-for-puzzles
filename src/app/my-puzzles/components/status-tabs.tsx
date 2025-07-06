'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { UserPuzzle, UserPuzzleStatus } from '@/lib/supabase'

interface StatusTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  puzzles: UserPuzzle[]
}

export function StatusTabs({ activeTab, onTabChange, puzzles }: StatusTabsProps) {
  // Count puzzles by status - CLEAN ARCHITECTURE VERSION
  const counts = {
    all: puzzles.length,
    'wishlist': puzzles.filter(p => p.status === 'wishlist').length,
    'library': puzzles.filter(p => p.status === 'library').length,
    'in-progress': puzzles.filter(p => p.status === 'in-progress').length,
    completed: puzzles.filter(p => p.status === 'completed').length,
    abandoned: puzzles.filter(p => p.status === 'abandoned').length,
  }

  const tabs = [
    { key: 'all', label: 'All Puzzles', emoji: '🧩', count: counts.all },
    { key: 'wishlist', label: 'Wishlist', emoji: '💝', count: counts['wishlist'] },
    { key: 'library', label: 'My Library', emoji: '📚', count: counts['library'] },
    { key: 'in-progress', label: 'In Progress', emoji: '⏳', count: counts['in-progress'] },
    { key: 'completed', label: 'Completed', emoji: '✅', count: counts.completed },
    { key: 'abandoned', label: 'Abandoned', emoji: '❌', count: counts.abandoned },
  ]

  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as string)} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6 bg-white/50 p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <span className="text-lg sm:text-base">{tab.emoji}</span>
              <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
} 