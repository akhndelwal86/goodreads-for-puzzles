import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star, Heart, BookmarkPlus, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function PuzzleOfTheDay() {
  // Mock data - in real app this would come from API
  const puzzleOfTheDay = {
    id: "daily-123",
    title: "Sunset Over Santorini",
    brand: "Ravensburger",
    pieces: 1000,
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
    description: "Experience the breathtaking beauty of Santorini's famous sunset with this stunning 1000-piece puzzle. Rich blues and warm oranges create a challenging yet rewarding puzzle experience.",
    avgTime: "8-12 hours",
    rating: 4.8,
    completions: 1247,
    tags: ["Landscapes", "Sunset", "Travel", "Mediterranean"],
    price: "$19.99",
    inStock: true,
    features: [
      "Premium quality cardboard",
      "Anti-glare finish", 
      "Perfect piece fit",
      "Includes poster"
    ]
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Puzzle of the Day
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Today&apos;s Featured Puzzle
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked daily by our puzzle experts for the perfect challenge
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative aspect-[4/3] lg:aspect-auto">
              <Image
                src={puzzleOfTheDay.image}
                alt={puzzleOfTheDay.title}
                fill
                className="object-cover"
                priority
              />
              {/* Overlay Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                  Daily Pick
                </Badge>
              </div>
              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                  <BookmarkPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {puzzleOfTheDay.title}
                </h3>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span className="font-semibold">{puzzleOfTheDay.brand}</span>
                  <span>•</span>
                  <span>{puzzleOfTheDay.pieces} pieces</span>
                  <span>•</span>
                  <Badge variant="outline" className="font-medium">
                    {puzzleOfTheDay.difficulty}
                  </Badge>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {puzzleOfTheDay.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-600">Avg Time</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{puzzleOfTheDay.avgTime}</div>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-600">Rating</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{puzzleOfTheDay.rating}/5</div>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-600">Completed</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">{puzzleOfTheDay.completions.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-600">Price</span>
                  </div>
                  <div className="text-lg font-bold text-amber-600">{puzzleOfTheDay.price}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {puzzleOfTheDay.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">What makes this special:</h4>
                <ul className="space-y-1">
                  {puzzleOfTheDay.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
                  asChild
                >
                  <Link href={`/puzzles/${puzzleOfTheDay.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 