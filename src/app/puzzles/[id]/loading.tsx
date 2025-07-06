export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        </div>

        {/* Hero Section skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>

            {/* Info skeleton */}
            <div>
              <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
              
              {/* Action buttons skeleton */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Purchase Links skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="w-36 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Reviews skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
} 