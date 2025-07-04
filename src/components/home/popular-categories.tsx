import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function PopularCategories() {
  // Mock data - in real app this would come from API
  const categories = [
    {
      id: 1,
      name: "Landscapes",
      count: 2847,
      trend: "+23%",
      gradient: "from-emerald-500 to-teal-600",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      description: "Breathtaking views from around the world"
    },
    {
      id: 2,
      name: "Animals",
      count: 1956,
      trend: "+18%",
      gradient: "from-amber-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop",
      description: "Adorable pets and wildlife"
    },
    {
      id: 3,
      name: "Art & Culture",
      count: 1743,
      trend: "+35%",
      gradient: "from-purple-500 to-violet-600",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop",
      description: "Famous paintings and cultural treasures"
    },
    {
      id: 4,
      name: "Cities",
      count: 1432,
      trend: "+12%",
      gradient: "from-blue-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=300&h=200&fit=crop",
      description: "Urban scenes and cityscapes"
    },
    {
      id: 5,
      name: "Fantasy",
      count: 987,
      trend: "+42%",
      gradient: "from-pink-500 to-rose-600",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      description: "Dragons, castles, and magical worlds"
    },
    {
      id: 6,
      name: "Food & Drink",
      count: 856,
      trend: "+28%",
      gradient: "from-red-500 to-pink-600",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
      description: "Delicious treats and beverages"
    }
  ]

  const quickFilters = [
    "Easy (100-500 pieces)",
    "Medium (500-1000 pieces)",
    "Hard (1000+ pieces)",
    "New Releases",
    "Bestsellers",
    "Under $20",
    "Premium Quality"
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-slate-600 bg-clip-text text-transparent">
            Explore by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find puzzles that match your interests and skill level
          </p>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {quickFilters.map((filter) => (
            <Button
              key={filter}
              variant="outline"
              size="sm"
              className="bg-white/60 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-200"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.name.toLowerCase()}`}>
              <div className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Trend Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`bg-gradient-to-r ${category.gradient} text-white border-0`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {category.trend}
                    </Badge>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-cyan-200 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {category.count.toLocaleString()} puzzles
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 bg-gradient-to-r ${category.gradient} rounded-full`} />
                      <span className="text-sm font-medium text-gray-700">
                        {category.count.toLocaleString()} options
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Row */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-2">50+</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-2">12K+</div>
              <div className="text-sm text-gray-600">Unique Puzzles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-2">200+</div>
              <div className="text-sm text-gray-600">Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 mb-2">99%</div>
              <div className="text-sm text-gray-600">Happy Puzzlers</div>
            </div>
          </div>
        </div>

        {/* Browse All Button */}
        <div className="text-center mt-8">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white border-0"
            asChild
          >
            <Link href="/categories">
              Browse All Categories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 