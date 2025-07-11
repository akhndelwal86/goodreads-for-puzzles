'use client'

import { useState } from 'react'
import { 
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon
} from 'react-share'
import { Button } from '@/components/ui/button'
import { Copy, Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PuzzleShareProps {
  puzzle: {
    id: string
    title: string
    brand: string
    piece_count: number
    description?: string
    image_url?: string
  }
  className?: string
}

export function PuzzleShare({ puzzle, className }: PuzzleShareProps) {
  const [copied, setCopied] = useState(false)
  
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/puzzles/${puzzle.id}`
  const shareTitle = `Check out this ${puzzle.piece_count}-piece puzzle: ${puzzle.title} by ${puzzle.brand}`
  const shareDescription = puzzle.description || `Discover this amazing ${puzzle.piece_count}-piece jigsaw puzzle from ${puzzle.brand} on Puzzlr!`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Share2 className="w-5 h-5" />
        Share this puzzle
      </div>
      
      {/* Social Media Buttons */}
      <div className="flex flex-wrap gap-3">
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        
        <TwitterShareButton url={shareUrl} title={shareTitle}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        
        <WhatsappShareButton url={shareUrl} title={shareTitle}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>
        
        <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareDescription}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>
        
        <EmailShareButton url={shareUrl} subject={shareTitle} body={shareDescription}>
          <EmailIcon size={40} round />
        </EmailShareButton>
      </div>
      
      {/* Copy Link Button */}
      <div className="flex gap-2">
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="flex-1"
          disabled={copied}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
      </div>
      
      {/* Share URL Display */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <p className="font-medium mb-1">Share URL:</p>
        <p className="break-all">{shareUrl}</p>
      </div>
    </div>
  )
}