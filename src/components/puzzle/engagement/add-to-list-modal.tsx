'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Heart, Target, Bookmark, Clock, CheckCircle } from 'lucide-react'
import Image from 'next/image'

interface AddToListModalProps {
  isOpen: boolean
  onClose: () => void
  puzzle: {
    id: string
    title: string
    brand: string
    piece_count: number
    main_image_url?: string
  }
  onAddToList: (puzzleId: string, listType: ListType, priority?: 'low' | 'medium' | 'high') => Promise<void>
}

export type ListType = 'want-to-solve' | 'wishlist' | 'currently-working' | 'completed' | 'backlog'

interface ListOption {
  id: ListType
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
}

const LIST_OPTIONS: ListOption[] = [
  {
    id: 'want-to-solve',
    name: 'Want to Solve',
    description: 'Puzzles you plan to work on soon',
    icon: Target,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  },
  {
    id: 'wishlist',
    name: 'Wishlist',
    description: 'Puzzles you\'d like to try someday',
    icon: Heart,
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    id: 'backlog',
    name: 'Backlog',
    description: 'Puzzles you own but haven\'t started',
    icon: Bookmark,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'currently-working',
    name: 'Currently Working',
    description: 'Puzzles you\'re actively solving',
    icon: Clock,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'completed',
    name: 'Completed',
    description: 'Puzzles you\'ve finished',
    icon: CheckCircle,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
]

export function AddToListModal({ isOpen, onClose, puzzle, onAddToList }: AddToListModalProps) {
  const [selectedList, setSelectedList] = useState<ListType | null>(null)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedList) return

    setIsSubmitting(true)
    try {
      await onAddToList(puzzle.id, selectedList, priority)
      onClose()
      // Reset state for next use
      setSelectedList(null)
      setPriority('medium')
    } catch (error) {
      console.error('Failed to add to list:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            Add to List
          </DialogTitle>
          <DialogDescription>
            Choose where to save this puzzle for later
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Puzzle Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            {puzzle.main_image_url ? (
              <Image
                src={puzzle.main_image_url}
                alt={puzzle.title}
                width={48}
                height={48}
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                <Plus className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-900 truncate">{puzzle.title}</h3>
              <p className="text-sm text-slate-600">{puzzle.brand} • {puzzle.piece_count} pieces</p>
            </div>
          </div>

          {/* List Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">Choose a list:</h4>
            <div className="grid gap-2">
              {LIST_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = selectedList === option.id
                
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedList(option.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? `${option.bgColor} ${option.borderColor} ring-2 ring-opacity-50`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${isSelected ? option.bgColor : 'bg-slate-100'}`}>
                        <Icon className={`w-4 h-4 ${isSelected ? option.color : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isSelected ? option.color : 'text-slate-900'}`}>
                            {option.name}
                          </span>
                          {isSelected && (
                            <CheckCircle className={`w-4 h-4 ${option.color}`} />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{option.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Priority Selection (for want-to-solve and backlog) */}
          {(selectedList === 'want-to-solve' || selectedList === 'backlog') && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Priority:</h4>
              <div className="flex gap-2">
                {[
                  { value: 'low', label: 'Low', color: 'bg-slate-100 text-slate-700' },
                  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
                  { value: 'high', label: 'High', color: 'bg-red-100 text-red-700' }
                ].map((priorityOption) => (
                  <button
                    key={priorityOption.value}
                    onClick={() => setPriority(priorityOption.value as 'low' | 'medium' | 'high')}
                    className={`flex-1 p-2 rounded text-sm font-medium transition-all ${
                      priority === priorityOption.value
                        ? priorityOption.color + ' ring-2 ring-opacity-50'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {priorityOption.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedList || isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? 'Adding...' : 'Add to List'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 