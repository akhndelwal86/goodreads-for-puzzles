'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { UserPuzzle, UserPuzzleStatus } from '@/lib/supabase'
import { Layers, Heart, Archive, PlayCircle, CheckCircle, XCircle } from 'lucide-react'
import { ViewToggle } from './view-toggle'

interface StatusTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  puzzles: UserPuzzle[]
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
}

export function StatusTabs({ activeTab, onTabChange, puzzles, view, onViewChange }: StatusTabsProps) {
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
    { 
      key: 'all', 
      label: 'All Puzzles', 
      icon: Layers, 
      count: counts.all, 
      colors: 'from-slate-500 to-slate-600 border-slate-200 text-slate-700' 
    },
    { 
      key: 'wishlist', 
      label: 'Wishlist', 
      icon: Heart, 
      count: counts['wishlist'], 
      colors: 'from-rose-500 to-rose-600 border-rose-200 text-rose-700' 
    },
    { 
      key: 'library', 
      label: 'My Library', 
      icon: Archive, 
      count: counts['library'], 
      colors: 'from-blue-500 to-blue-600 border-blue-200 text-blue-700' 
    },
    { 
      key: 'in-progress', 
      label: 'In Progress', 
      icon: PlayCircle, 
      count: counts['in-progress'], 
      colors: 'from-amber-500 to-amber-600 border-amber-200 text-amber-700' 
    },
    { 
      key: 'completed', 
      label: 'Completed', 
      icon: CheckCircle, 
      count: counts.completed, 
      colors: 'from-emerald-500 to-emerald-600 border-emerald-200 text-emerald-700' 
    },
    { 
      key: 'abandoned', 
      label: 'Abandoned', 
      icon: XCircle, 
      count: counts.abandoned, 
      colors: 'from-gray-500 to-gray-600 border-gray-200 text-gray-700' 
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-700">Puzzle Collection</h2>
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
      
      {/* Premium Status Tabs */}
      <div className="glass-card border-white/30 rounded-xl p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            const [fromColor, toColor, borderColor, textColor] = tab.colors.split(' ')
            const IconComponent = tab.icon
            
            return (
              <button
              key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`relative group p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? `glass-card hover-lift border border-white/40 ${textColor} shadow-glass` 
                    : 'hover:bg-white/30 text-slate-600 hover:text-slate-800'
                }`}
              >
                {/* Background gradient for active state */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${fromColor} ${toColor} opacity-5 rounded-xl`} />
                )}
                
                <div className="relative flex flex-col items-center gap-2">
                  <IconComponent className="w-6 h-6" />
                  <span className="text-sm font-medium line-clamp-1">{tab.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isActive 
                      ? `bg-gradient-to-r ${fromColor} ${toColor} text-white shadow-sm` 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                {tab.count}
              </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
} 