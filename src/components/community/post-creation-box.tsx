'use client'

import { useState, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ImageIcon, X, Loader2, Plus } from 'lucide-react'

interface Activity {
  id: string
  type: 'review' | 'completion' | 'follow' | 'like' | 'post'
  user: {
    name: string
    username: string
    avatar: string
  }
  content?: string
  timestamp: string
  media_urls?: string[]
}

interface PostCreationBoxProps {
  onOptimisticPost: (post: Activity) => void
  onPostCreated: (realPost: Activity, tempId: string) => void
  onPostError: (tempId: string) => void
}

export function PostCreationBox({ onOptimisticPost, onPostCreated, onPostError }: PostCreationBoxProps) {
  const { user } = useUser()
  const [text, setText] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    ).slice(0, 4 - images.length) // Limit to 4 total images

    setImages(prev => [...prev, ...validFiles])
    if (!isExpanded) setIsExpanded(true)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    setText('')
    setImages([])
    setIsExpanded(false)
  }

  const handleSubmit = async () => {
    if ((!text.trim() && images.length === 0) || !user) return

    setIsSubmitting(true)

    // Store current values for potential retry
    const originalText = text.trim()
    const originalImages = [...images]

    // Create optimistic post
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create a proper name fallback
    const displayName = user.fullName || 
                       (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
                       user.firstName ||
                       user.username ||
                       user.emailAddresses[0]?.emailAddress.split('@')[0] ||
                       'User'
    
    const optimisticPost: Activity = {
      id: tempId,
      type: 'post',
      user: {
        name: displayName,
        username: user.username || user.emailAddresses[0]?.emailAddress.split('@')[0] || 'user',
        avatar: user.imageUrl || ''
      },
      content: originalText,
      timestamp: new Date().toISOString(),
      media_urls: originalImages.map(file => URL.createObjectURL(file)) // Temporary preview URLs
    }

    console.log('🚀 Creating optimistic post:', tempId)

    // Add optimistic post immediately
    onOptimisticPost(optimisticPost)

    // Clear form immediately for better UX
    setText('')
    setImages([])
    setIsExpanded(false)

    try {
      // Submit to API
      const formData = new FormData()
      formData.append('text', originalText)
      originalImages.forEach((image, index) => {
        formData.append(`image_${index}`, image)
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const result = await response.json()
      
      console.log('✅ Post created successfully:', result.post.id)
      
      // Replace optimistic post with real data
      const realPost: Activity = {
        id: result.post.id,
        type: 'post',
        user: {
          name: result.post.user.name || result.post.user.username || 'User',
          username: result.post.user.username || 'user',
          avatar: result.post.user.avatar || ''
        },
        content: result.post.text || result.post.content || '',
        timestamp: result.post.created_at || result.post.timestamp || new Date().toISOString(),
        media_urls: result.post.image_urls || result.post.media_urls || []
      }

      onPostCreated(realPost, tempId)

    } catch (error) {
      console.error('❌ Error creating post:', error)
      
      // Remove optimistic post on error
      onPostError(tempId)
      
      // Restore form data for user to retry
      setText(originalText)
      setImages(originalImages)
      setIsExpanded(true)
      
      // Show error message
      alert(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const characterCount = text.length
  const maxCharacters = 500
  const isOverLimit = characterCount > maxCharacters
  const canSubmit = (text.trim() || images.length > 0) && !isOverLimit && !isSubmitting

  if (!user) {
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Main Content */}
      <div className="p-4">
          <div className="space-y-4">
            {/* User Avatar and Input */}
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium">
                  {(user.fullName || 'U').split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <Textarea
                  placeholder={isExpanded ? "What's your puzzle story today? Share your progress, tips, or discoveries..." : "What's on your mind?"}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  className={`min-h-[${isExpanded ? '120px' : '56px'}] resize-none border-0 focus:outline-none focus:ring-0 transition-all duration-300 text-base placeholder:text-slate-400 p-0 bg-transparent hover:bg-slate-50/30 rounded-lg px-3 py-2 focus:bg-slate-50/50`}
                  disabled={isSubmitting}
                />
              </div>
            </div>
              
            {/* Character Counter */}
            {(isExpanded || characterCount > 0) && (
              <div className="flex justify-end">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isOverLimit ? 'bg-red-100 text-red-600' : 
                  characterCount > maxCharacters * 0.8 ? 'bg-amber-100 text-amber-600' : 
                  'bg-slate-100 text-slate-500'
                }`}>
                  {characterCount}/{maxCharacters}
                </span>
              </div>
            )}

            {/* Image Preview Grid - Only show when there are images */}
            {images.length > 0 && (
              <div className="space-y-3">
                <div className={`grid gap-3 ${
                  images.length === 1 ? 'grid-cols-1' :
                  images.length === 2 ? 'grid-cols-2' :
                  'grid-cols-2 md:grid-cols-3'
                }`}>
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full max-h-48 object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add More Button - Only show if under 4 images */}
                  {images.length < 4 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[120px] max-h-48 border-2 border-dashed border-violet-300 rounded-xl flex flex-col items-center justify-center space-y-2 text-violet-600 hover:bg-violet-50 hover:border-violet-400 transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Add More</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={isSubmitting || images.length >= 4}
            />

            {/* Action Buttons */}
            {isExpanded && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= 4 || isSubmitting}
                    className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-full transform hover:scale-105 transition-all duration-200"
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Photos
                  </Button>
                  {images.length > 0 && (
                    <span className="text-xs text-slate-500">({images.length}/4)</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-full transform hover:scale-105 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-4 py-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  )
} 
