import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="text-6xl mb-4">🧩</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Puzzle Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the puzzle you're looking for. It may have been removed or the link might be incorrect.
        </p>
        <div className="space-y-4">
          <Link 
            href="/puzzles/browse"
            className="block w-full bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Browse Puzzles
          </Link>
          <Link 
            href="/"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
} 