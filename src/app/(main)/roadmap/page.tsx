import { Metadata } from 'next'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  TrendingUp,
  Smartphone,
  Zap,
  Heart,
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  Vote
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Roadmap - Puzzlr',
  description: 'See what\'s coming next to Puzzlr and vote on features you want most.',
}

export default function RoadmapPage() {
  const roadmapItems = [
    {
      quarter: 'Recently Completed',
      status: 'in-progress',
      items: [
        {
          title: 'Enhanced Collections System',
          description: 'Theme-based collections with smart filtering and improved discovery',
          status: 'shipped',
          priority: 'high',
          category: 'Collections'
        },
        {
          title: 'Improved Authentication UX',
          description: 'Better sign-in prompts and authentication flow improvements',
          status: 'shipped',
          priority: 'medium',
          category: 'Platform'
        }
      ]
    },
    {
      quarter: 'In Development',
      status: 'in-progress',
      items: [
        {
          title: 'Mobile Apps (iOS & Android)',
          description: 'Native mobile apps for puzzle tracking on the go',
          status: 'in-development',
          priority: 'high',
          category: 'Mobile'
        },
        {
          title: 'Advanced Search & Filtering',
          description: 'More powerful search with multiple filters and saved searches',
          status: 'planned',
          priority: 'high',
          category: 'Discovery'
        },
        {
          title: 'Puzzle Wishlist & Gift Registry',
          description: 'Create wishlists and share them with friends and family',
          status: 'in-development',
          priority: 'medium',
          category: 'Social'
        }
      ]
    },
    {
      quarter: 'Planned Features',
      status: 'planned',
      items: [
        {
          title: 'Puzzle Marketplace',
          description: 'Buy, sell, and trade puzzles with other community members',
          status: 'planned',
          priority: 'high',
          category: 'Commerce'
        },
        {
          title: 'Enhanced Review System',
          description: 'More detailed review categories and helpful review features',
          status: 'planned',
          priority: 'medium',
          category: 'Community'
        },
        {
          title: 'Puzzle Clubs & Groups',
          description: 'Create and join puzzle clubs with shared collections and discussions',
          status: 'planned',
          priority: 'medium',
          category: 'Social'
        }
      ]
    },
    {
      quarter: 'Future Research',
      status: 'planned',
      items: [
        {
          title: 'AI Puzzle Recommendations',
          description: 'Personalized puzzle suggestions based on your preferences and history',
          status: 'research',
          priority: 'high',
          category: 'Discovery'
        },
        {
          title: 'Puzzle Competitions & Challenges',
          description: 'Monthly challenges, speed competitions, and community events',
          status: 'planned',
          priority: 'medium',
          category: 'Community'
        },
        {
          title: 'Advanced Analytics Dashboard',
          description: 'Detailed insights into your puzzle habits, preferences, and progress',
          status: 'planned',
          priority: 'low',
          category: 'Analytics'
        }
      ]
    },
    {
      quarter: 'Future',
      status: 'planned',
      items: [
        {
          title: 'Puzzle Creator Tools',
          description: 'Tools for puzzle manufacturers to showcase and manage their products',
          status: 'research',
          priority: 'medium',
          category: 'Business'
        },
        {
          title: 'Virtual Puzzle Rooms',
          description: 'Collaborative online spaces for working on puzzles together',
          status: 'research',
          priority: 'low',
          category: 'Social'
        },
        {
          title: 'Augmented Reality Features',
          description: 'AR tools to help with puzzle sorting and completion tracking',
          status: 'research',
          priority: 'low',
          category: 'Innovation'
        }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped': return 'bg-green-100 text-green-800'
      case 'in-development': return 'bg-blue-100 text-blue-800'
      case 'planned': return 'bg-yellow-100 text-yellow-800'
      case 'research': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped': return CheckCircle
      case 'in-development': return Zap
      case 'planned': return Calendar
      case 'research': return Target
      default: return Clock
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mobile': return 'bg-purple-100 text-purple-800'
      case 'Social': return 'bg-pink-100 text-pink-800'
      case 'Discovery': return 'bg-blue-100 text-blue-800'
      case 'Community': return 'bg-green-100 text-green-800'
      case 'Commerce': return 'bg-orange-100 text-orange-800'
      case 'Analytics': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Puzzlr Roadmap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what's coming next to Puzzlr and help shape our future by voting on the features 
            you want most. Your feedback drives our development priorities.
          </p>
        </div>


        {/* Roadmap Timeline */}
        <div className="space-y-12">
          {roadmapItems.map((quarter, quarterIndex) => (
            <div key={quarterIndex} className="glass-card border border-white/40 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{quarter.quarter}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  quarter.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  quarter.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {quarter.status === 'in-progress' ? 'In Progress' : 
                   quarter.status === 'planned' ? 'Planned' : 'Completed'}
                </span>
              </div>
              
              <div className="space-y-6">
                {quarter.items.map((item, itemIndex) => {
                  const StatusIcon = getStatusIcon(item.status)
                  return (
                    <div key={itemIndex} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <StatusIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{item.title}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                                {item.status.replace('-', ' ')}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                                {item.category}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                  {item.priority} priority
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 glass-card border border-white/40 rounded-xl p-8 text-center">
          <TrendingUp className="w-12 h-12 text-violet-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Help Shape Puzzlr's Future
          </h3>
          <p className="text-gray-600 mb-6">
            Have an idea that's not on our roadmap? We'd love to hear it! Community feedback 
            and feature requests directly influence our development priorities.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/feature-request"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Submit Feature Request
            </a>
            <a
              href="/contact"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Contact Team
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Roadmap Disclaimer</h4>
              <p className="text-blue-800 text-sm">
                This roadmap represents our current plans and priorities, but dates and features may change based on 
                community feedback, technical considerations, and business needs. Features marked as "research" are 
                being explored but not yet committed to development.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}