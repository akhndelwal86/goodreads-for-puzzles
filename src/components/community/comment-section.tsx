'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { MessageCircle, Edit3, Trash2, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CommentForm } from './comment-form'

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

interface CommentSectionProps {
  activityId: string
  activityType: string
  initialCommentCount: number
  onCommentCountChange?: (newCount: number) => void
}

export function CommentSection({ 
  activityId, 
  activityType, 
  initialCommentCount,
  onCommentCountChange
}: CommentSectionProps) {
  const { user } = useUser()
  const [comments, setComments] = useState<Comment[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [replyingToId, setReplyingToId] = useState<string | null>(null)

  const fetchComments = async () => {
    if (!isOpen || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/activities/${activityId}/comments?activityType=${activityType}&limit=20`
      )
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen])

  const handleToggleComments = () => {
    setIsOpen(!isOpen)
  }

  const handleNewComment = (comment: Comment) => {
    setComments(prev => [...prev, comment])
    const newCount = commentCount + 1
    setCommentCount(newCount)
    onCommentCountChange?.(newCount)
    
    // Hide the comment form after successful submission
    setShowCommentForm(false)
    setReplyingToId(null)
  }

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent })
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: data.comment.content, updatedAt: data.comment.updatedAt }
            : comment
        ))
        setEditingCommentId(null)
      }
    } catch (error) {
      console.error('Error editing comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => prev.filter(comment => comment.id !== commentId))
        setCommentCount(data.commentCount)
        onCommentCountChange?.(data.commentCount)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const commentTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - commentTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <div className="mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleComments}
        className="h-8 px-3 text-slate-600 hover:text-blue-600"
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        <span className="text-sm">{commentCount}</span>
      </Button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {/* Comment Form */}
          {user && !showCommentForm && (
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => setShowCommentForm(true)}
                className="flex-1 text-left px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500"
              >
                Write a comment...
              </button>
            </div>
          )}
          
          {user && showCommentForm && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CommentForm
                  activityId={activityId}
                  activityType={activityType}
                  onCommentSubmit={handleNewComment}
                  onCancel={() => setShowCommentForm(false)}
                  placeholder="Write a comment..."
                />
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>{comment.user.username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-slate-800">
                          {comment.user.username}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(comment.createdAt)}
                          {comment.updatedAt !== comment.createdAt && ' (edited)'}
                        </span>
                      </div>
                      
                      {editingCommentId === comment.id ? (
                        <CommentForm
                          activityId={activityId}
                          activityType={activityType}
                          initialContent={comment.content}
                          onCommentSubmit={(updatedComment) => {
                            setComments(prev => prev.map(c => 
                              c.id === comment.id 
                                ? { ...c, content: updatedComment.content, updatedAt: updatedComment.updatedAt }
                                : c
                            ))
                            setEditingCommentId(null)
                          }}
                          onCancel={() => setEditingCommentId(null)}
                          isEditing={true}
                          commentId={comment.id}
                        />
                      ) : (
                        <p className="text-sm text-slate-700">{comment.content}</p>
                      )}
                    </div>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
                        onClick={() => setReplyingToId(comment.id)}
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                      
                      {user && comment.user.id === user.id && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
                            onClick={() => setEditingCommentId(comment.id)}
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-slate-500 hover:text-red-600"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Reply Form */}
                    {replyingToId === comment.id && user && (
                      <div className="mt-2 ml-4">
                        <CommentForm
                          activityId={activityId}
                          activityType={activityType}
                          parentCommentId={comment.id}
                          onCommentSubmit={handleNewComment}
                          onCancel={() => setReplyingToId(null)}
                          placeholder={`Reply to ${comment.user.username}...`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}