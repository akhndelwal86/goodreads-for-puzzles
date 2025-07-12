'use client'

import { Button } from '@/components/ui/button'
import { Grid3X3, List } from 'lucide-react'

interface ViewToggleProps {
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-white/40 bg-white/20 p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('grid')}
        className={`h-8 px-3 rounded-md transition-all duration-200 ${
          view === 'grid'
            ? 'bg-white/80 text-slate-800 shadow-sm'
            : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('list')}
        className={`h-8 px-3 rounded-md transition-all duration-200 ${
          view === 'list'
            ? 'bg-white/80 text-slate-800 shadow-sm'
            : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
        }`}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  )
}