'use client'

import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Star, Camera } from 'lucide-react'
import type { UserPuzzle } from '@/lib/supabase'

interface PuzzleModalProps {
  puzzle: UserPuzzle | null
  isOpen: boolean
  onClose: () => void
}

export function PuzzleModal({ puzzle, isOpen, onClose }: PuzzleModalProps) {
  if (!puzzle) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">✅ Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">⏳ In Progress</Badge>
      case 'want-to-do':
        return <Badge className="bg-purple-100 text-purple-800">🎯 Want to Do</Badge>
      case 'abandoned':
        return <Badge className="bg-gray-100 text-gray-800">❌ Abandoned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'Not tracked'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours} hours ${minutes} minutes`
    }
    return `${minutes} minutes`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {puzzle.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Puzzle Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={puzzle.image || '/placeholder-puzzle.svg'}
                alt={puzzle.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Basic Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusBadge(puzzle.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">Brand</div>
                  <div className="text-gray-600">{puzzle.brand}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Pieces</div>
                  <div className="text-gray-600">{puzzle.pieces}</div>
                </div>
              </div>

              {/* Rating */}
              {puzzle.rating && (
                <div>
                  <div className="font-medium text-gray-900 mb-1">Your Rating</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= puzzle.rating! 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{puzzle.rating}/5</span>
                  </div>
                </div>
              )}

              {/* Difficulty */}
              {puzzle.difficulty && (
                <div>
                  <div className="font-medium text-gray-900 mb-1">Difficulty</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= puzzle.difficulty! ? 'text-red-400' : 'text-gray-300'
                        }`}
                      >
                        ●
                      </span>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{puzzle.difficulty}/5</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Time and Date Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {puzzle.startedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium">Started</div>
                      <div className="text-gray-600">
                        {new Date(puzzle.startedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                {puzzle.completedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium">Completed</div>
                      <div className="text-gray-600">
                        {new Date(puzzle.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Time Spent</div>
                    <div className="text-gray-600">{formatTime(puzzle.timeSpent)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {puzzle.notes && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{puzzle.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {puzzle.photos && puzzle.photos.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photos ({puzzle.photos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {puzzle.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={photo}
                        alt={`Puzzle photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                Edit Details
              </Button>
              <Button className="bg-violet-600 hover:bg-violet-700">
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 