'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { UserPuzzle, UserPuzzleStatus } from '@/lib/supabase'

interface StatusTabsProps {
  activeTab: UserPuzzleStatus | 'all'
  onTabChange: (tab: UserPuzzleStatus | 'all') => void
  puzzles: UserPuzzle[]
}

export function StatusTabs({ activeTab, onTabChange, puzzles }: StatusTabsProps) {
  // Count puzzles by status
  const counts = {
    all: puzzles.length,
    completed: puzzles.filter(p => p.status === 'completed').length,
    'want-to-do': puzzles.filter(p => p.status === 'want-to-do').length,
    'in-progress': puzzles.filter(p => p.status === 'in-progress').length,
  }

  const tabs = [
    { key: 'all' as const, label: 'All Puzzles', emoji: '🧩', count: counts.all },
    { key: 'completed' as const, label: 'Completed', emoji: '✅', count: counts.completed },
    { key: 'want-to-do' as const, label: 'Want to Do', emoji: '🎯', count: counts['want-to-do'] },
    { key: 'in-progress' as const, label: 'In Progress', emoji: '⏳', count: counts['in-progress'] },
  ]

  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as UserPuzzleStatus | 'all')} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white/50 p-1">
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