import Link from 'next/link'
import { 
  BookOpen, 
  MessageSquare, 
  HelpCircle, 
  Users,
  Video,
  FileText,
  ArrowRight,
  Star,
  Mail,
  Clock,
  Sparkles
} from 'lucide-react'

export default function HelpPage() {
  const helpResources = [
    {
      title: 'Getting Started',
      description: 'New to Puzzlr? Learn the basics of tracking your puzzle journey',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      href: '/help/getting-started',
      isNew: false
    },
    {
      title: 'Frequently Asked Questions',
      description: 'Find quick answers to common questions about using Puzzlr',
      icon: HelpCircle,
      color: 'from-green-500 to-green-600',
      href: '/faq',
      isNew: false
    },
    {
      title: 'Contact Support',
      description: 'Get personalized help from our support team',
      icon: MessageSquare,
      color: 'from-violet-500 to-violet-600',
      href: '/contact',
      isNew: false
    },
    {
      title: 'Community Guidelines',
      description: 'Learn how to be a great member of the puzzle community',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      href: '/community-guidelines',
      isNew: false
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides for using Puzzlr features',
      icon: Video,
      color: 'from-orange-500 to-orange-600',
      href: '/help/videos',
      isNew: false
    },
    {
      title: 'What\'s New',
      description: 'Latest features and updates to the Puzzlr platform',
      icon: Sparkles,
      color: 'from-pink-500 to-pink-600',
      href: '/help/updates',
      isNew: false
    }
  ]

  const quickLinks = [
    {
      question: 'How do I add a puzzle to my collection?',
      href: '/faq',
      category: 'Getting Started'
    },
    {
      question: 'How do I track my puzzle progress?',
      href: '/faq',
      category: 'Puzzle Tracking'
    },
    {
      question: 'How do I write a helpful review?',
      href: '/faq',
      category: 'Community'
    },
    {
      question: 'How do I create a collection?',
      href: '/faq',
      category: 'Collections'
    },
    {
      question: 'How do I find new puzzles to try?',
      href: '/faq',
      category: 'Discovery'
    },
    {
      question: 'How do I change my privacy settings?',
      href: '/faq',
      category: 'Account'
    }
  ]


  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to get the most out of Puzzlr. Find answers, learn new features, 
            and connect with our support team.
          </p>
        </div>


        {/* Main Help Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Help Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpResources.map((resource, index) => (
              <Link key={index} href={resource.href}>
                <div className="glass-card border border-white/40 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <resource.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors duration-200">
                      {resource.title}
                    </h3>
                    {resource.isNew && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {resource.description}
                  </p>
                  <div className="flex items-center text-violet-600 group-hover:translate-x-1 transition-transform duration-200">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Help Links */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Help
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Looking for something specific? Here are the most common questions:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div>
                  <span className="text-gray-700 group-hover:text-violet-600 transition-colors duration-200">
                    {link.question}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">{link.category}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="text-center glass-card border border-white/40 rounded-xl p-8">
          <Mail className="w-12 h-12 text-violet-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Still Need Help?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help you with any questions.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Browse FAQ
            </Link>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>
              <strong>Email:</strong> support@puzzlr.in • <strong>Response time:</strong> Usually within 24 hours
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}