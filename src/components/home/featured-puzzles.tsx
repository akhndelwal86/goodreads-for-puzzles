import { PuzzleGrid } from '@/components/puzzle/puzzle-grid'
import type { Puzzle } from '@/types/database'

interface FeaturedPuzzlesProps {
  puzzles: Puzzle[]
}

export function FeaturedPuzzles({ puzzles }: FeaturedPuzzlesProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Featured Puzzles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most loved puzzles from our community
          </p>
        </div>
        
        <PuzzleGrid puzzles={puzzles} />
      </div>
    </section>
  )
} 