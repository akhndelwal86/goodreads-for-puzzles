'use client'

import { useState, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ImageIcon, X, Loader2 } from 'lucide-react'

interface PostCreationBoxProps {
  onPostCreated?: (post: any) => void
}

export function PostCreationBox({ onPostCreated }: PostCreationBoxProps) {
  const { user } = useUser()
  const [text, setText] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxCharacters = 500
  const maxImages = 4
  const remainingChars = maxCharacters - text.length

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return

    const newImages = Array.from(files).slice(0, maxImages - images.length)
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!text.trim() && images.length === 0) return
    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('text', text.trim())
      
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image)
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post')
      }

      // Reset form
      setText('')
      setImages([])
      setIsExpanded(false)
      
      // Notify parent component
      onPostCreated?.(data.post)

    } catch (error) {
      console.error('Error creating post:', error)
      setError(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = (text.trim().length > 0 || images.length > 0) && !isSubmitting

  if (!user) {
    return null // Don't show post creation if user not logged in
  }

  return (
    <Card className="glass-card border-white/40 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
            <AvatarImage src={user.imageUrl} alt={user.fullName || user.username || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium">
              {(user.fullName || user.username || 'U').split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {/* Text Input */}
            <Textarea
              placeholder={isExpanded ? "Share your puzzle progress, ask questions, or connect with the community..." : "Share your puzzle progress..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className={`resize-none border-0 p-0 bg-transparent text-slate-700 placeholder:text-slate-500 focus:ring-0 focus:outline-none ${
                isExpanded ? 'min-h-[100px]' : 'min-h-[44px]'
              }`}
              maxLength={maxCharacters}
            />

            {/* Character Counter */}
            {isExpanded && (
              <div className="flex justify-between items-center mt-2 mb-3">
                <span className={`text-xs ${remainingChars < 50 ? 'text-rose-500' : 'text-slate-500'}`}>
                  {remainingChars} characters remaining
                </span>
              </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mb-4">
                <div className={`grid gap-2 ${
                  images.length === 1 ? 'grid-cols-1' :
                  images.length === 2 ? 'grid-cols-2' :
                  'grid-cols-2'
                }`}>
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 w-6 h-6 p-0 opacity-80 hover:opacity-100"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-3 text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions Row */}
            {isExpanded && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Image Upload Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= maxImages}
                    className="text-slate-600 hover:text-violet-600 hover:bg-violet-50"
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Photo ({images.length}/{maxImages})
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files)}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setText('')
                      setImages([])
                      setIsExpanded(false)
                      setError(null)
                    }}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
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
      </CardContent>
    </Card>
  )
} 