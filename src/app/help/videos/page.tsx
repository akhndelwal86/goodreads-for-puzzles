import { Metadata } from 'next'
import { 
  Video, 
  Play, 
  Clock, 
  User, 
  BookOpen, 
  Search,
  Star,
  Users,
  Settings,
  Camera,
  TrendingUp,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Video Tutorials - Puzzlr Help Center',
  description: 'Learn how to use Puzzlr with our comprehensive video tutorial library.',
}

export default function VideoTutorialsPage() {
  const tutorialCategories = [
    {
      title: 'Getting Started',
      description: 'Everything you need to know to begin your Puzzlr journey',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      videos: [
        {
          title: 'Welcome to Puzzlr: Your First Steps',
          duration: '3:45',
          description: 'Complete overview of Puzzlr and how to create your account',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        },
        {
          title: 'Adding Your First Puzzle',
          duration: '2:30',
          description: 'Learn how to add puzzles to your collection and set their status',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        },
        {
          title: 'Understanding Puzzle Statuses',
          duration: '4:15',
          description: 'Master the different puzzle statuses: Want to Do, In Progress, Completed, Abandoned',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        }
      ]
    },
    {
      title: 'Puzzle Tracking',
      description: 'Advanced features for tracking your puzzle progress',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      videos: [
        {
          title: 'Logging Puzzle Progress & Photos',
          duration: '5:20',
          description: 'How to document your puzzle journey with photos and notes',
          thumbnail: '/api/placeholder/320/180',
          level: 'Intermediate',
        },
        {
          title: 'Timing Your Puzzles',
          duration: '3:00',
          description: 'Track completion times and set personal records',
          thumbnail: '/api/placeholder/320/180',
          level: 'Intermediate',
        },
        {
          title: 'Advanced Progress Notes',
          duration: '4:45',
          description: 'Make the most of puzzle notes and memory tracking',
          thumbnail: '/api/placeholder/320/180',
          level: 'Advanced',
        }
      ]
    },
    {
      title: 'Community Features',
      description: 'Connect with other puzzle enthusiasts',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      videos: [
        {
          title: 'Writing Great Puzzle Reviews',
          duration: '6:30',
          description: 'How to write helpful reviews that guide other puzzlers',
          thumbnail: '/api/placeholder/320/180',
          level: 'Intermediate',
        },
        {
          title: 'Following Users & Activity Feeds',
          duration: '4:00',
          description: 'Stay connected with the puzzle community',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        },
        {
          title: 'Community Guidelines & Best Practices',
          duration: '3:15',
          description: 'Be a great community member and follow our guidelines',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        }
      ]
    },
    {
      title: 'Discovery & Search',
      description: 'Find your next favorite puzzle',
      icon: Search,
      color: 'from-orange-500 to-orange-600',
      videos: [
        {
          title: 'Advanced Search & Filtering',
          duration: '5:45',
          description: 'Master Puzzlr\'s search to find exactly what you\'re looking for',
          thumbnail: '/api/placeholder/320/180',
          level: 'Intermediate',
        },
        {
          title: 'Using Smart Lists Effectively',
          duration: '4:20',
          description: 'Discover trending puzzles and community favorites',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        },
        {
          title: 'Brand Pages & Manufacturer Info',
          duration: '3:30',
          description: 'Explore puzzles by your favorite manufacturers',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        }
      ]
    },
    {
      title: 'Collections & Organization',
      description: 'Organize your puzzles like a pro',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      videos: [
        {
          title: 'Creating Your First Collection',
          duration: '4:50',
          description: 'Organize puzzles by theme, difficulty, or any criteria you choose',
          thumbnail: '/api/placeholder/320/180',
          level: 'Intermediate',
        },
        {
          title: 'Advanced Collection Features',
          duration: '6:15',
          description: 'Privacy settings, collaboration, and smart collection rules',
          thumbnail: '/api/placeholder/320/180',
          level: 'Advanced',
        },
        {
          title: 'Following & Sharing Collections',
          duration: '3:40',
          description: 'Discover collections from other users and share your own',
          thumbnail: '/api/placeholder/320/180',
          level: 'Intermediate',
        }
      ]
    },
    {
      title: 'Settings & Customization',
      description: 'Personalize your Puzzlr experience',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      videos: [
        {
          title: 'Profile Setup & Privacy Settings',
          duration: '4:25',
          description: 'Customize your profile and control what others can see',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        },
        {
          title: 'Notification Preferences',
          duration: '2:45',
          description: 'Control when and how Puzzlr notifies you',
          thumbnail: '/api/placeholder/320/180',
          level: 'Beginner',
        },
        {
          title: 'Data Export & Account Management',
          duration: '3:55',
          description: 'Export your data and manage your account settings',
          thumbnail: '/api/placeholder/320/180',
          level: 'Advanced',
        }
      ]
    }
  ]

  const featuredVideos = [
    {
      title: 'Puzzlr in 5 Minutes: Complete Overview',
      duration: '5:00',
      description: 'Everything you need to know about Puzzlr in just 5 minutes',
      thumbnail: '/api/placeholder/400/225',
      featured: true,
    },
    {
      title: 'Pro Tips: Getting the Most from Puzzlr',
      duration: '8:30',
      description: 'Advanced tips and tricks from power users',
      thumbnail: '/api/placeholder/400/225',
      featured: true,
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Video Tutorials
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Learn how to use Puzzlr with our comprehensive video library. From basic setup to advanced features, 
            we've got you covered with step-by-step visual guides.
          </p>
          
          {/* Coming Soon Banner */}
          <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-center mb-3">
              <Video className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-blue-900">Coming Soon!</h3>
            </div>
            <p className="text-blue-800 text-sm mb-4">
              Our video tutorial library is currently in production. Below you can see the planned tutorial structure 
              and topics we'll be covering. We're working hard to create high-quality, helpful videos for you.
            </p>
            <div className="text-xs text-blue-600">
              Want to be notified when tutorials are available? <a href="/contact" className="underline hover:no-underline">Contact us</a> to join our update list.
            </div>
          </div>
        </div>

        {/* Featured Videos */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Featured Tutorials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredVideos.map((video, index) => (
              <div key={index} className="glass-card border border-white/40 rounded-xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-200">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white bg-black/50 rounded-full p-4 group-hover:bg-violet-600 transition-colors duration-200" />
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors duration-200">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Tutorial Video</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tutorial Categories */}
        <div className="space-y-12">
          {tutorialCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="glass-card border border-white/40 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.videos.map((video, videoIndex) => (
                  <div key={videoIndex} className="border border-gray-200 rounded-lg overflow-hidden group cursor-pointer hover:shadow-md transition-all duration-200">
                    <div className="relative">
                      <div className="w-full h-36 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white bg-black/50 rounded-full p-3 group-hover:bg-violet-600 transition-colors duration-200" />
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          video.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          video.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {video.level}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm group-hover:text-violet-600 transition-colors duration-200">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{video.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <span>Coming Soon</span>
                        </div>
                        <ArrowRight className="w-3 h-3 group-hover:text-violet-600 transition-colors duration-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 glass-card border border-white/40 rounded-xl p-8 text-center">
          <Video className="w-12 h-12 text-violet-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            More Videos Coming Soon!
          </h3>
          <p className="text-gray-600 mb-6">
            We're constantly creating new tutorials to help you master Puzzlr. 
            Have a specific topic you'd like to see covered?
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/feature-request"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Request a Tutorial
            </a>
            <a
              href="/contact"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>

        {/* Placeholder Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Video className="w-5 h-5 text-blue-600 mr-2" />
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Video tutorials are currently in development. This page shows the planned tutorial structure. 
              Actual videos will be added as they're created and produced.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}