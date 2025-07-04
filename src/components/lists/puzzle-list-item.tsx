import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PuzzleListItemProps {
  puzzle: {
    id: string
    title: string
    brand: string
    pieces: number
    image: string
    metric?: string
  }
  rank: number
  onClick?: (puzzleId: string) => void
  className?: string
}

export function PuzzleListItem({ puzzle, rank, onClick, className }: PuzzleListItemProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer",
        className
      )}
      onClick={() => onClick?.(puzzle.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(puzzle.id)
        }
      }}
      tabIndex={onClick ? 0 : -1}
      role="button"
      aria-label={`View details for ${puzzle.title} puzzle`}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
        {rank}
      </div>

      {/* Puzzle Image */}
      {/* Puzzle Image */}
      <img 
        src={puzzle.image} 
        alt={`${puzzle.title} puzzle by ${puzzle.brand}`}
        className="w-12 h-12 rounded-lg object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/placeholder-puzzle.jpg' // Add fallback image
        }}
        loading="lazy"
      />

      {/* Puzzle Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{puzzle.title}</h3>
        <p className="text-sm text-gray-500">
          {puzzle.brand} • {puzzle.pieces} pieces
        </p>
      </div>

      {/* Metric Badge */}
      {puzzle.metric && (
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
          {puzzle.metric}
        </Badge>
      )}
    </div>
  )
} 