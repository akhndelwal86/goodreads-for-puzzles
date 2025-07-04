import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Share2, Clock, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Helper function to create URL-friendly slugs
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Collapse multiple hyphens
    .trim()
}

export function ActivityFeed() {
  // Mock data - in real app this would come from API
  const activities = [
    {
      id: 1,
      type: "completion",
      user: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face",
        username: "sarahpuzzles"
      },
      puzzle: {
        title: "Japanese Cherry Blossoms",
        brand: "Buffalo Games",
        pieces: 1000
      },
      completionTime: "6h 42m",
      image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=300&fit=crop",
      caption: "Finally finished this beautiful cherry blossom puzzle! The pink gradients were challenging but so worth it. Perfect for spring! 🌸",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 7,
      rating: 5
    },
    {
      id: 2,
      type: "progress",
      user: {
        name: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        username: "mikesolves"
      },
      puzzle: {
        title: "Starry Night Van Gogh",
        brand: "Ravensburger",
        pieces: 1500
      },
      progress: 65,
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      caption: "Making great progress on this Van Gogh masterpiece! The swirls in the sky are incredibly detailed. Can't wait to see it finished!",
      timestamp: "5 hours ago",
      likes: 18,
      comments: 3
    },
    {
      id: 3,
      type: "review",
      user: {
        name: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        username: "emmapuzzles"
      },
      puzzle: {
        title: "Mountain Lake Reflection",
        brand: "Cobble Hill",
        pieces: 500
      },
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      caption: "Wonderful quality pieces and beautiful imagery! The reflection effect was tricky but rewarding. Highly recommend for intermediate puzzlers.",
      timestamp: "1 day ago",
      likes: 31,
      comments: 12,
      rating: 4
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completion":
        return "🎉"
      case "progress":
        return "🧩"
      case "review":
        return "⭐"
      default:
        return "📝"
    }
  }

  const getActivityAction = (type: string) => {
    switch (type) {
      case "completion":
        return "completed"
      case "progress":
        return "is working on"
      case "review":
        return "reviewed"
      default:
        return "posted about"
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Activity
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what fellow puzzlers are working on and sharing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{activity.user.name}</span>
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      <span className="text-sm text-gray-500">{getActivityAction(activity.type)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={activity.image}
                  alt={activity.puzzle.title}
                  fill
                  className="object-cover"
                />
                {/* Overlay info */}
                <div className="absolute top-3 left-3">
                  {activity.type === "completion" && activity.rating && (
                    <Badge className="bg-yellow-500 text-white border-0">
                      ⭐ {activity.rating}/5
                    </Badge>
                  )}
                  {activity.type === "progress" && activity.progress && (
                    <Badge className="bg-blue-500 text-white border-0">
                      {activity.progress}% Complete
                    </Badge>
                  )}
                </div>
                {activity.type === "completion" && activity.completionTime && (
                  <div className="absolute bottom-3 right-3">
                    <Badge className="bg-green-500 text-white border-0">
                      ⏱️ {activity.completionTime}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    {activity.puzzle.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {activity.puzzle.brand} • {activity.puzzle.pieces} pieces
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {activity.caption}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                      aria-label={`Like (${activity.likes} likes)`}
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{activity.likes}</span>
                    </button>
                    <button 
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                      aria-label={`Comment (${activity.comments} comments)`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{activity.comments}</span>
                    </button>
                    <button 
                      className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition-colors"
                      aria-label="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link 
                    href={`/puzzles/${slugify(activity.puzzle.title)}`}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Puzzle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="group border-blue-200 text-blue-700 hover:bg-blue-50"
            asChild
          >
            <Link href="/community/activity">
              View All Activity
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 