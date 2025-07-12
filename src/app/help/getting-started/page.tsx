import { Metadata } from 'next'
import Link from 'next/link'
import { 
  BookOpen, 
  UserPlus, 
  Plus, 
  Camera, 
  Star,
  Users,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  Heart,
  MessageSquare
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Getting Started - Puzzlr Help Center',
  description: 'Learn the basics of using Puzzlr to track your jigsaw puzzle journey.',
}

export default function GettingStartedPage() {
  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up for free and set up your puzzle profile',
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
      details: [
        'Click "Sign Up" in the top navigation',
        'Create your account with email or social login',
        'Choose a username that represents you in the puzzle community',
        'Add a profile photo and bio (optional but recommended)'
      ],
      tips: 'Your username will be visible to other puzzle enthusiasts, so pick something you like!'
    },
    {
      number: 2,
      title: 'Add Your First Puzzle',
      description: 'Start building your puzzle collection',
      icon: Plus,
      color: 'from-green-500 to-green-600',
      details: [
        'Click "Add Puzzle" in the navigation or browse existing puzzles',
        'Search for a puzzle you own or want to do',
        'If it\'s not in our database, you can add it yourself',
        'Set the status: Want to Do, In Progress, Completed, or Abandoned'
      ],
      tips: 'Start with puzzles you\'ve already completed to get familiar with the system!'
    },
    {
      number: 3,
      title: 'Track Your Progress',
      description: 'Document your puzzle journey',
      icon: Camera,
      color: 'from-purple-500 to-purple-600',
      details: [
        'Upload progress photos as you work on puzzles',
        'Add notes about your experience, difficulty, or memories',
        'Track the time you spend working on each puzzle',
        'Mark puzzles as completed when you finish them'
      ],
      tips: 'Progress photos are a great way to remember your puzzle journey and inspire others!'
    },
    {
      number: 4,
      title: 'Write Reviews',
      description: 'Help other puzzlers with your insights',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      details: [
        'Rate puzzles from 1-5 stars based on your experience',
        'Write detailed reviews about image quality, piece fit, and difficulty',
        'Include specific details that would help others decide',
        'Be honest but constructive in your feedback'
      ],
      tips: 'Good reviews mention image clarity, piece quality, and whether you\'d recommend it!'
    },
    {
      number: 5,
      title: 'Connect with Community',
      description: 'Join the puzzle enthusiast community',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
      details: [
        'Follow other users whose puzzle taste you admire',
        'Check out the community activity feed for inspiration',
        'Browse collections created by other puzzle enthusiasts',
        'Join discussions and celebrate others\' completions'
      ],
      tips: 'Following active users is a great way to discover new puzzles and stay motivated!'
    },
    {
      number: 6,
      title: 'Discover New Puzzles',
      description: 'Find your next puzzle adventure',
      icon: Search,
      color: 'from-indigo-500 to-indigo-600',
      details: [
        'Use the browse page to filter by brand, piece count, or theme',
        'Check out trending puzzles and community favorites',
        'Explore curated collections for themed recommendations',
        'Read reviews to find puzzles that match your preferences'
      ],
      tips: 'The "Most Completed" smart list is great for finding popular, well-regarded puzzles!'
    }
  ]

  const quickActions = [
    {
      title: 'Browse Puzzles',
      description: 'Explore thousands of puzzles from top brands',
      href: '/puzzles/browse',
      icon: Search,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Read FAQ',
      description: 'Common questions and detailed answers',
      href: '/faq',
      icon: BookOpen,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Join Community',
      description: 'Connect with fellow puzzle enthusiasts',
      href: '/community',
      icon: Users,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our friendly support team',
      href: '/contact',
      icon: MessageSquare,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const essentialFeatures = [
    {
      name: 'Puzzle Statuses',
      description: 'Track puzzles as Want to Do, In Progress, Completed, or Abandoned',
      icon: CheckCircle
    },
    {
      name: 'Progress Photos',
      description: 'Upload photos of your work-in-progress and completed puzzles',
      icon: Camera
    },
    {
      name: 'Time Tracking',
      description: 'See how long puzzles take you to complete',
      icon: Clock
    },
    {
      name: 'Reviews & Ratings',
      description: 'Rate puzzles and write reviews to help the community',
      icon: Star
    },
    {
      name: 'Collections',
      description: 'Organize puzzles into themed collections or follow others',
      icon: Heart
    },
    {
      name: 'Activity Feed',
      description: 'See what the community is working on and celebrating',
      icon: MessageSquare
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Getting Started with Puzzlr
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to Puzzlr! Follow this guide to start tracking your jigsaw puzzle journey, 
            connect with fellow enthusiasts, and discover your next favorite puzzle.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="glass-card border border-white/40 rounded-2xl p-8">
              <div className="flex items-start">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mr-6 flex-shrink-0`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                      Step {step.number}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {step.tips && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 text-sm">
                        <strong>💡 Tip:</strong> {step.tips}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Essential Features */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Essential Features to Know
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {essentialFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <feature.icon className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Ready to Get Started?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="glass-card border border-white/40 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors duration-200">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{action.description}</p>
                  <div className="flex items-center text-violet-600 group-hover:translate-x-1 transition-transform duration-200">
                    <span className="text-sm font-medium">Get started</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center glass-card border border-white/40 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            What's Next?
          </h3>
          <p className="text-gray-600 mb-6">
            You're all set to start your puzzle journey! Remember, the best way to learn is by doing. 
            Start with a puzzle you already own and explore the features as you go.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/puzzles/add"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Add Your First Puzzle
            </Link>
            <Link
              href="/puzzles/browse"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Browse Puzzles
            </Link>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>
              Need help? Check out our <Link href="/faq" className="text-violet-600 hover:underline">FAQ</Link> or{' '}
              <Link href="/contact" className="text-violet-600 hover:underline">contact support</Link>.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}