'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PlusCircle, Search, Filter, Heart, Archive, PlayCircle, CheckCircle, XCircle, ShoppingCart, BookOpen, Play, Trophy, RefreshCcw } from 'lucide-react'

interface EmptyStateProps {
  status: string
  onAction?: () => void
}

export function EmptyState({ status, onAction }: EmptyStateProps) {
  const content = {
    all: {
      title: 'No puzzles found',
      description: 'Looks like you haven\'t added any puzzles to your collection yet.',
      icon: <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center shadow-lg shadow-slate-500/25"><Search className="w-8 h-8 text-white" /></div>,
      action: {
        label: 'Browse Puzzles',
        icon: <Search className="w-4 h-4" />
      }
    },
    wishlist: {
      title: 'Your wishlist is empty',
      description: 'Start building your collection by adding puzzles you want to buy.',
      icon: <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/25"><Heart className="w-8 h-8 text-white" /></div>,
      action: {
        label: 'Find Puzzles',
        icon: <ShoppingCart className="w-4 h-4" />
      }
    },
    library: {
      title: 'Your library is empty',
      description: 'Add puzzles you own but haven\'t started solving yet.',
      icon: <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25"><Archive className="w-8 h-8 text-white" /></div>,
      action: {
        label: 'Add to Library',
        icon: <BookOpen className="w-4 h-4" />
      }
    },
    'in-progress': {
      title: 'No puzzles in progress',
      description: 'Start working on a puzzle from your library.',
      icon: <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25"><PlayCircle className="w-8 h-8 text-white" /></div>,
      action: {
        label: 'Start Puzzle',
        icon: <Play className="w-4 h-4" />
      }
    },
    completed: {
      title: 'No completed puzzles yet',
      description: 'Keep solving! Your completed puzzles will appear here.',
      icon: <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25"><CheckCircle className="w-8 h-8 text-white" /></div>,
      action: {
        label: 'View Progress',
        icon: <Trophy className="w-4 h-4" />
      }
    },
    abandoned: {
      title: 'No abandoned puzzles',
      description: 'Puzzles you\'ve decided not to complete will appear here.',
      icon: <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-500/25"><XCircle className="w-8 h-8 text-white" /></div>,
      action: {
        label: 'Try Again',
        icon: <RefreshCcw className="w-4 h-4" />
      }
    },
    filtered: {
      title: 'No puzzles match your filters',
      description: 'Start building your puzzle collection by adding puzzles you want to solve.',
      icon: <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25"><Filter className="w-8 h-8 text-white" /></div>,
      action: {
        label: 'Clear Filters',
        icon: <Search className="w-4 h-4" />
      }
    }
  }

  const currentContent = content[status as keyof typeof content] || content.all

  return (
    <div className="glass-card border-white/30 rounded-2xl p-12 text-center space-y-6 border-2 border-dashed">
      {currentContent.icon}
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-700">{currentContent.title}</h3>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">{currentContent.description}</p>
      </div>

      {onAction && (
        <Button onClick={onAction} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2">
          {currentContent.action.icon}
          {currentContent.action.label}
        </Button>
      )}
    </div>
  )
} 