import { Clock } from 'lucide-react'

export function Collections() {
  const collections = [
    { title: "Beginner Friendly", description: "Perfect puzzles to start your journey", count: "150+ puzzles", gradient: "from-green-500 to-emerald-600" },
    { title: "Expert Challenge", description: "For seasoned puzzle masters", count: "75+ puzzles", gradient: "from-red-500 to-pink-600" },
    { title: "Nature & Landscapes", description: "Beautiful scenes from around the world", count: "200+ puzzles", gradient: "from-blue-500 to-cyan-600" },
    { title: "Art & Culture", description: "Famous paintings and cultural icons", count: "120+ puzzles", gradient: "from-purple-500 to-violet-600" },
    { title: "Animals & Wildlife", description: "Adorable and majestic creatures", count: "180+ puzzles", gradient: "from-amber-500 to-orange-600" },
    { title: "Fantasy & Sci-Fi", description: "Imagination knows no bounds", count: "90+ puzzles", gradient: "from-indigo-500 to-purple-600" }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Curated Collections
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked puzzle collections for every mood and skill level
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div key={collection.title} className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className={`w-12 h-12 bg-gradient-to-r ${collection.gradient} rounded-lg mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-emerald-600 transition-colors">
                {collection.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {collection.description}
              </p>
              <p className={`text-sm font-semibold bg-gradient-to-r ${collection.gradient} bg-clip-text text-transparent`}>
                {collection.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 