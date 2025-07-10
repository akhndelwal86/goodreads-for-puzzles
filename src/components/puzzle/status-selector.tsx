'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { PuzzleStatus } from '@/types/database'

export type { PuzzleStatus }

interface StatusSelectorProps {
  value: PuzzleStatus
  onChange: (status: PuzzleStatus) => void
  className?: string
}

const statusConfig = {
  'wishlist': {
    label: 'Wishlist',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    icon: '⭐',
    description: 'Want to get this puzzle'
  },
  'library': {
    label: 'My Library',
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    icon: '📚',
    description: 'I own this puzzle'
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    icon: '🧩',
    description: 'Currently working on this'
  },
  'completed': {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 hover:bg-green-200',
    icon: '✅',
    description: 'Finished this puzzle'
  },
  'abandoned': {
    label: 'Abandoned',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    icon: '❌',
    description: 'Gave up on this one'
  }
} as const

export function StatusSelector({ value, onChange, className }: StatusSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="text-sm font-medium text-foreground">
        Status
      </label>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {(Object.keys(statusConfig) as PuzzleStatus[]).map((status) => {
          const config = statusConfig[status]
          const isSelected = value === status
          
          return (
            <button
              key={status}
              type="button"
              onClick={() => onChange(status)}
              className={cn(
                'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border hover:border-primary/50'
              )}
            >
              <span className="text-2xl" role="img" aria-label={config.label}>
                {config.icon}
              </span>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm text-foreground">
                  {config.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {config.description}
                </div>
              </div>
              {isSelected && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
} 