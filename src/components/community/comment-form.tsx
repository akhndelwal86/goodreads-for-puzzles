'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, X } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  parentCommentId?: string
  user: {
    id: string
    username: string
    avatar?: string
  }
}

interface CommentFormProps {
  activityId: string
  activityType: string
  parentCommentId?: string
  initialContent?: string
  placeholder?: string
  onCommentSubmit: (comment: Comment) => void
  onCancel?: () => void
  isEditing?: boolean
  commentId?: string
}

export function CommentForm({
  activityId,
  activityType,
  parentCommentId,
  initialContent = '',
  placeholder = 'Write a comment...',
  onCommentSubmit,
  onCancel,
  isEditing = false,
  commentId
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      if (isEditing && commentId) {
        // Edit existing comment
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: content.trim() })
        })

        if (response.ok) {
          const data = await response.json()
          onCommentSubmit(data.comment)
          setContent('')
        } else {
          console.error('Failed to edit comment')
        }
      } else {
        // Create new comment
        const response = await fetch(`/api/activities/${activityId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content.trim(),
            activityType,
            parentCommentId
          })
        })

        if (response.ok) {
          const data = await response.json()
          onCommentSubmit(data.comment)
          setContent('')
        } else {
          console.error('Failed to create comment')
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setContent(initialContent)
    onCancel?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[120px] resize-none"
        disabled={isSubmitting}
      />
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isSubmitting}
          className="bg-violet-600 hover:bg-violet-700"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="ml-2">
            {isEditing ? 'Update' : 'Comment'}
          </span>
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}