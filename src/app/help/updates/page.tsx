import { Metadata } from 'next'
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Zap,
  Users,
  Bug,
  Star,
  Shield,
  Smartphone,
  Database,
  TrendingUp,
  Heart
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Feature Updates & Changelog - Puzzlr',
  description: 'Stay up to date with the latest Puzzlr features, improvements, and bug fixes.',
}

export default function FeatureUpdatesPage() {
  const updates = [
    {
      version: '1.2.0',
      date: '2024-12-15',
      type: 'minor',
      title: 'Enhanced Collections & Authentication',
      summary: 'Improved collections system with better navigation and enhanced authentication flows.',
      features: [
        { type: 'new', text: 'Enhanced collections with improved filtering and discovery' },
        { type: 'new', text: 'Better authentication guards for protected features' },
        { type: 'improved', text: 'Navigation dropdown with better organization' },
        { type: 'improved', text: 'Type-safe collections API with proper error handling' },
        { type: 'fixed', text: 'Social sharing props and collection sorting issues' }
      ],
      icon: Star,
      color: 'from-purple-500 to-purple-600'
    },
    {
      version: '1.1.0',
      date: '2024-12-01',
      type: 'minor',
      title: 'Platform Foundation & Footer',
      summary: 'Comprehensive platform structure with complete footer, help system, and core pages.',
      features: [
        { type: 'new', text: 'Complete footer with all essential links and sections' },
        { type: 'new', text: 'Comprehensive help center with getting started guides' },
        { type: 'new', text: 'About page with mission, story, and values sections' },
        { type: 'new', text: 'FAQ system with interactive search and filtering' },
        { type: 'new', text: 'Contact page with multiple support channels' },
        { type: 'new', text: 'Privacy policy, terms of service, and legal pages' },
        { type: 'new', text: 'Product roadmap with feature planning' },
        { type: 'new', text: 'API documentation for developers' }
      ],
      icon: Sparkles,
      color: 'from-violet-500 to-emerald-500'
    }
  ]

  const upcomingFeatures = [
    {
      title: 'Mobile Apps',
      description: 'Native iOS and Android apps for puzzle tracking on the go',
      timeline: 'Coming Soon',
      icon: Smartphone
    },
    {
      title: 'Puzzle Marketplace',
      description: 'Buy, sell, and trade puzzles with other community members',
      timeline: 'Coming Soon',
      icon: TrendingUp
    },
    {
      title: 'AI Recommendations',
      description: 'Personalized puzzle recommendations based on your preferences',
      timeline: 'Coming Soon',
      icon: Zap
    },
    {
      title: 'Puzzle Competitions',
      description: 'Monthly challenges and leaderboards for the community',
      timeline: 'Coming Soon',
      icon: Star
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-green-100 text-green-800'
      case 'improved': return 'bg-blue-100 text-blue-800'
      case 'fixed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVersionBadge = (type: string) => {
    switch (type) {
      case 'major': return 'bg-purple-100 text-purple-800'
      case 'minor': return 'bg-blue-100 text-blue-800'
      case 'patch': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Feature Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay up to date with the latest Puzzlr features, improvements, and bug fixes. 
            We're constantly evolving to serve puzzle enthusiasts better.
          </p>
        </div>

        {/* Upcoming Features */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 text-violet-600 mr-3" />
            Coming Soon
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <feature.icon className="w-5 h-5 text-violet-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <span className="text-xs text-gray-500">{feature.timeline}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                <div className="flex items-center justify-end">
                  <a
                    href="/feature-request"
                    className="text-violet-600 hover:underline text-xs"
                  >
                    Suggest Ideas →
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <a
              href="/roadmap"
              className="inline-flex items-center text-violet-600 hover:underline"
            >
              View Full Roadmap
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Recent Updates
          </h2>
          
          {updates.map((update, index) => (
            <div key={index} className="glass-card border border-white/40 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${update.color} rounded-lg flex items-center justify-center mr-4`}>
                    <update.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{update.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVersionBadge(update.type)}`}>
                        v{update.version}
                      </span>
                    </div>
                    <p className="text-gray-600">{update.summary}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(update.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {update.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium mr-3 ${getTypeColor(feature.type)}`}>
                      {feature.type === 'new' ? 'NEW' : 
                       feature.type === 'improved' ? 'IMPROVED' : 
                       feature.type === 'fixed' ? 'FIXED' : 'UPDATED'}
                    </span>
                    <span className="text-gray-700 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 glass-card border border-white/40 rounded-xl p-8 text-center">
          <Sparkles className="w-12 h-12 text-violet-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-6">
            Want to be the first to know about new features and updates? 
            Follow our development progress and get notified of major releases.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/roadmap"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              View Roadmap
            </a>
            <a
              href="/feature-request"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Suggest Features
            </a>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Database className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Help Shape Puzzlr's Future</h4>
              <p className="text-blue-800 text-sm mb-3">
                Your feedback drives our development. Found a bug? Have a feature idea? We want to hear from you!
              </p>
              <div className="space-x-4">
                <a
                  href="/report-bug"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Report Bug
                </a>
                <a
                  href="/feature-request"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Request Feature
                </a>
                <a
                  href="/contact"
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}