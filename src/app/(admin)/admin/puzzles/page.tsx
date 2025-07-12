'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Package,
  Image as ImageIcon,
  Clock,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react'

interface PendingPuzzle {
  id: string
  title: string
  piece_count: number
  theme: string
  material: string
  description: string
  image_url: string
  approval_status: string
  created_at: string
  updated_at: string
  brand_name: string
  uploader_email: string
  uploader_first_name: string
  uploader_last_name: string
  review_count: number
  avg_rating: number
}

interface ApprovalDialogProps {
  puzzle: PendingPuzzle | null
  isOpen: boolean
  onClose: () => void
  onApprove: (puzzleId: string, notes?: string) => void
  onReject: (puzzleId: string, reason: string, notes?: string) => void
}

const ApprovalDialog = ({ puzzle, isOpen, onClose, onApprove, onReject }: ApprovalDialogProps) => {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const rejectionReasons = [
    'Inappropriate content',
    'Poor image quality',
    'Duplicate puzzle',
    'Incorrect information',
    'Copyright violation',
    'Spam or fake submission',
    'Other (specify below)'
  ]

  const handleSubmit = async () => {
    if (!puzzle || !action) return

    setIsSubmitting(true)
    try {
      if (action === 'approve') {
        await onApprove(puzzle.id, adminNotes)
      } else {
        const finalReason = rejectionReason === 'Other (specify below)' ? customReason : rejectionReason
        await onReject(puzzle.id, finalReason, adminNotes)
      }
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setAction(null)
    setRejectionReason('')
    setAdminNotes('')
    setCustomReason('')
    onClose()
  }

  if (!puzzle) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Review Puzzle: {puzzle.title}</DialogTitle>
          <DialogDescription>
            Submitted by {puzzle.uploader_first_name} {puzzle.uploader_last_name} ({puzzle.uploader_email})
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Puzzle image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
              {puzzle.image_url ? (
                <img
                  src={puzzle.image_url}
                  alt={puzzle.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          {/* Puzzle details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800">{puzzle.title}</h3>
              <p className="text-sm text-slate-600">{puzzle.brand_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-slate-600">Pieces:</span>
                <p>{puzzle.piece_count?.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Theme:</span>
                <p>{puzzle.theme || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Material:</span>
                <p>{puzzle.material || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Submitted:</span>
                <p>{new Date(puzzle.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {puzzle.description && (
              <div>
                <span className="font-medium text-slate-600">Description:</span>
                <p className="text-sm mt-1">{puzzle.description}</p>
              </div>
            )}

            {/* Decision section */}
            <div className="border-t pt-4">
              <Label className="text-base font-medium">Decision</Label>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant={action === 'approve' ? 'default' : 'outline'}
                  className={action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  onClick={() => setAction('approve')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant={action === 'reject' ? 'destructive' : 'outline'}
                  onClick={() => setAction('reject')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>

            {/* Rejection reason */}
            {action === 'reject' && (
              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {rejectionReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {rejectionReason === 'Other (specify below)' && (
                  <div>
                    <Label>Custom Reason</Label>
                    <Input
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Enter custom rejection reason"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Admin notes */}
            <div className="space-y-2">
              <Label>Admin Notes (optional)</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this decision..."
                rows={3}
              />
            </div>

            {/* Submit buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!action || isSubmitting || (action === 'reject' && !rejectionReason)}
                className={action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                variant={action === 'approve' ? 'default' : 'destructive'}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  `${action === 'approve' ? 'Approve' : 'Reject'} Puzzle`
                )}
              </Button>
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const PuzzleCard = ({ 
  puzzle, 
  onReview 
}: { 
  puzzle: PendingPuzzle
  onReview: (puzzle: PendingPuzzle) => void 
}) => {
  const getDifficultyInfo = (pieceCount: number) => {
    if (pieceCount <= 300) return { level: 'Easy', color: 'bg-emerald-100 text-emerald-700' }
    if (pieceCount <= 1000) return { level: 'Medium', color: 'bg-amber-100 text-amber-700' }
    if (pieceCount <= 2000) return { level: 'Hard', color: 'bg-rose-100 text-rose-700' }
    return { level: 'Expert', color: 'bg-violet-100 text-violet-700' }
  }

  const difficulty = getDifficultyInfo(puzzle.piece_count)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{puzzle.title}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <span>{puzzle.brand_name}</span>
              <span>•</span>
              <span>{puzzle.piece_count?.toLocaleString()} pieces</span>
            </CardDescription>
          </div>
          <Badge className={`${difficulty.color} text-xs`}>
            {difficulty.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Puzzle image */}
        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
          {puzzle.image_url ? (
            <img
              src={puzzle.image_url}
              alt={puzzle.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </div>

        {/* Puzzle info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-slate-600">
            <User className="w-4 h-4" />
            <span>{puzzle.uploader_first_name} {puzzle.uploader_last_name}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(puzzle.created_at).toLocaleDateString()}</span>
          </div>
          {puzzle.theme && (
            <div className="flex items-center space-x-2 text-slate-600">
              <Package className="w-4 h-4" />
              <span>{puzzle.theme}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {puzzle.description && (
          <p className="text-sm text-slate-600 line-clamp-2">{puzzle.description}</p>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={() => onReview(puzzle)}
            className="flex-1"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminPuzzlesPage() {
  const [puzzles, setPuzzles] = useState<PendingPuzzle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [selectedPuzzle, setSelectedPuzzle] = useState<PendingPuzzle | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)

  useEffect(() => {
    fetchPuzzles()
  }, [statusFilter])

  const fetchPuzzles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/puzzles?status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setPuzzles(data)
      }
    } catch (error) {
      console.error('Error fetching puzzles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (puzzleId: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/puzzles/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzleId, adminNotes: notes })
      })

      if (response.ok) {
        // Remove from pending list
        setPuzzles(prev => prev.filter(p => p.id !== puzzleId))
      }
    } catch (error) {
      console.error('Error approving puzzle:', error)
    }
  }

  const handleReject = async (puzzleId: string, reason: string, notes?: string) => {
    try {
      const response = await fetch('/api/admin/puzzles/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzleId, rejectionReason: reason, adminNotes: notes })
      })

      if (response.ok) {
        // Remove from pending list
        setPuzzles(prev => prev.filter(p => p.id !== puzzleId))
      }
    } catch (error) {
      console.error('Error rejecting puzzle:', error)
    }
  }

  const handleReview = (puzzle: PendingPuzzle) => {
    setSelectedPuzzle(puzzle)
    setShowApprovalDialog(true)
  }

  const filteredPuzzles = puzzles.filter(puzzle =>
    puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puzzle.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${puzzle.uploader_first_name} ${puzzle.uploader_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Puzzle Management</h1>
          <p className="text-slate-600">Review and manage puzzle submissions</p>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search puzzles, brands, or submitters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{puzzles.length}</p>
                <p className="text-sm text-slate-600">Pending Review</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Puzzles grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading puzzles...</p>
            </div>
          </div>
        ) : filteredPuzzles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPuzzles.map((puzzle) => (
              <PuzzleCard
                key={puzzle.id}
                puzzle={puzzle}
                onReview={handleReview}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-12 h-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No puzzles found</h3>
              <p className="text-slate-600 text-center">
                {searchTerm 
                  ? 'No puzzles match your search criteria' 
                  : 'No puzzles awaiting review'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Approval dialog */}
        <ApprovalDialog
          puzzle={selectedPuzzle}
          isOpen={showApprovalDialog}
          onClose={() => {
            setShowApprovalDialog(false)
            setSelectedPuzzle(null)
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  )
}