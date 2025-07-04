import { Scroll } from 'lucide-react'

interface BrandCarouselProps {
  brands?: Array<{
    id: string
    name: string
    logo?: string
    puzzleCount?: number
  }>
}

export function BrandCarousel({ brands = [] }: BrandCarouselProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100">
          <Scroll className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Browse by Brand</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.length > 0 ? (
          brands.map((brand) => (
            <div
              key={brand.id}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 mb-2"></div>
              <h3 className="font-medium text-gray-900 text-center text-sm">{brand.name}</h3>
              {brand.puzzleCount && (
                <p className="text-xs text-gray-500">{brand.puzzleCount} puzzles</p>
              )}
            </div>
          ))
        ) : (
          // Default brand placeholders
          ['Ravensburger', 'Buffalo Games', 'Cobble Hill', 'White Mountain', 'Springbok', 'Clementoni'].map((name) => (
            <div
              key={name}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 mb-2"></div>
              <h3 className="font-medium text-gray-900 text-center text-sm">{name}</h3>
              <p className="text-xs text-gray-500">24 puzzles</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
} 