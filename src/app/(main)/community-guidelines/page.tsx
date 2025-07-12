import { Metadata } from 'next'
import { 
  Users, 
  Heart, 
  Shield, 
  MessageSquare, 
  Camera, 
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Community Guidelines - Puzzlr',
  description: 'Guidelines for being a respectful and helpful member of the Puzzlr community.',
}

export default function CommunityGuidelinesPage() {
  const guidelines = [
    {
      title: 'Be Kind and Respectful',
      icon: Heart,
      color: 'text-red-500',
      description: 'Treat all community members with kindness, respect, and empathy.',
      details: [
        'Use polite and constructive language in all interactions',
        'Respect different puzzle preferences, skill levels, and opinions',
        'Be patient with new members who are learning the platform',
        'Celebrate others\' achievements and puzzle completions'
      ],
      dos: [
        'Congratulate others on their puzzle completions',
        'Offer helpful suggestions when asked',
        'Share your puzzle experiences positively'
      ],
      donts: [
        'Use offensive, discriminatory, or hateful language',
        'Mock others for their puzzle choices or completion times',
        'Engage in personal attacks or harassment'
      ]
    },
    {
      title: 'Share Authentic Content',
      icon: Camera,
      color: 'text-blue-500',
      description: 'Post genuine puzzle photos and honest reviews to help the community.',
      details: [
        'Upload your own original photos of puzzles you\'re working on or have completed',
        'Write honest reviews based on your actual experience with puzzles',
        'Provide accurate information when adding new puzzles to the database',
        'Give credit where appropriate and respect others\' content'
      ],
      dos: [
        'Share progress photos of puzzles you\'re actually working on',
        'Write detailed, helpful reviews',
        'Include relevant details in puzzle submissions'
      ],
      donts: [
        'Post photos that aren\'t yours without permission',
        'Write fake reviews or rate puzzles you haven\'t done',
        'Spam the platform with irrelevant content'
      ]
    },
    {
      title: 'Provide Helpful Reviews',
      icon: Star,
      color: 'text-yellow-500',
      description: 'Write thoughtful reviews that help other puzzlers make informed decisions.',
      details: [
        'Base your reviews on puzzles you\'ve actually completed or attempted',
        'Include specific details about image quality, piece fit, and difficulty',
        'Be constructive in your criticism and highlight both positives and negatives',
        'Consider how your review will help others decide if a puzzle is right for them'
      ],
      dos: [
        'Mention specific aspects like piece quality, image clarity, and fun factor',
        'Include tips or warnings that might help other puzzlers',
        'Update reviews if your opinion changes over time'
      ],
      donts: [
        'Write reviews solely to boost or hurt a puzzle\'s rating',
        'Include spoilers about puzzle images without warning',
        'Base reviews on brand bias rather than the specific puzzle'
      ]
    },
    {
      title: 'Respect Privacy and Safety',
      icon: Shield,
      color: 'text-green-500',
      description: 'Protect your own privacy and respect others\' personal information.',
      details: [
        'Don\'t share personal information like full names, addresses, or phone numbers',
        'Be cautious about sharing location details in puzzle photos',
        'Respect others\' privacy settings and boundaries',
        'Report any suspicious or inappropriate behavior to moderators'
      ],
      dos: [
        'Use privacy settings to control who can see your content',
        'Report users who violate community guidelines',
        'Keep personal meetups safe by following basic safety precautions'
      ],
      donts: [
        'Share others\' personal information without permission',
        'Try to obtain personal information from other users',
        'Ignore privacy settings or try to circumvent them'
      ]
    },
    {
      title: 'Use Features Appropriately',
      icon: Users,
      color: 'text-purple-500',
      description: 'Use Puzzlr\'s features as intended to maintain a quality experience for everyone.',
      details: [
        'Follow and interact with users whose content you genuinely enjoy',
        'Use collections to organize puzzles in meaningful ways',
        'Tag and categorize content appropriately',
        'Use the platform\'s features for their intended purposes'
      ],
      dos: [
        'Create collections that are useful or interesting to others',
        'Use appropriate tags when adding puzzles',
        'Engage meaningfully with content you follow'
      ],
      donts: [
        'Create spam accounts or fake profiles',
        'Abuse the follow/unfollow system',
        'Misuse tags or categories to gain visibility'
      ]
    }
  ]

  const reportingInfo = [
    {
      issue: 'Inappropriate Content',
      description: 'Photos, reviews, or posts that violate our guidelines',
      action: 'Use the report button on the specific content'
    },
    {
      issue: 'Harassment or Bullying',
      description: 'Users who are targeting or harassing other members',
      action: 'Report the user profile and contact support immediately'
    },
    {
      issue: 'Spam or Fake Content',
      description: 'Fake reviews, spam posts, or inauthentic accounts',
      action: 'Report the content and user profile'
    },
    {
      issue: 'Privacy Violations',
      description: 'Someone sharing personal information without permission',
      action: 'Report immediately and contact support'
    }
  ]

  const consequences = [
    {
      level: 'Warning',
      description: 'First-time minor violations result in a friendly reminder',
      icon: AlertTriangle,
      color: 'text-yellow-500'
    },
    {
      level: 'Content Removal',
      description: 'Violating content may be removed with explanation',
      icon: XCircle,
      color: 'text-orange-500'
    },
    {
      level: 'Temporary Restriction',
      description: 'Repeated violations may result in temporary feature restrictions',
      icon: Shield,
      color: 'text-red-500'
    },
    {
      level: 'Account Suspension',
      description: 'Serious or repeated violations may result in account suspension',
      icon: XCircle,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Community Guidelines
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to the Puzzlr community! These guidelines help us maintain a positive, 
            helpful, and safe environment for all puzzle enthusiasts.
          </p>
        </div>

        {/* Guidelines */}
        <div className="space-y-12 mb-16">
          {guidelines.map((guideline, index) => (
            <div key={index} className="glass-card border border-white/40 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <guideline.icon className={`w-8 h-8 ${guideline.color} mr-4`} />
                <h2 className="text-2xl font-bold text-gray-900">
                  {guideline.title}
                </h2>
              </div>
              
              <p className="text-gray-700 text-lg mb-6">
                {guideline.description}
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Points:</h3>
                  <ul className="space-y-2">
                    {guideline.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Do:
                    </h4>
                    <ul className="space-y-1">
                      {guideline.dos.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-green-700 text-sm">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      <XCircle className="w-4 h-4 mr-2" />
                      Don't:
                    </h4>
                    <ul className="space-y-1">
                      {guideline.donts.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-red-700 text-sm">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reporting Section */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 text-blue-500 mr-3" />
            Reporting Issues
          </h2>
          <p className="text-gray-700 mb-6">
            If you encounter content or behavior that violates these guidelines, please report it. 
            Your reports help us maintain a safe and welcoming community.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {reportingInfo.map((info, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {info.issue}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {info.description}
                </p>
                <p className="text-violet-600 text-sm font-medium">
                  Action: {info.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Enforcement
          </h2>
          <p className="text-gray-700 mb-6">
            We enforce these guidelines fairly and consistently. Here's what may happen if guidelines are violated:
          </p>
          
          <div className="space-y-4">
            {consequences.map((consequence, index) => (
              <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                <consequence.icon className={`w-6 h-6 ${consequence.color} mr-4`} />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {consequence.level}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {consequence.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center glass-card border border-white/40 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Questions About These Guidelines?
          </h3>
          <p className="text-gray-600 mb-6">
            If you have questions about our community guidelines or need to report an issue, 
            we're here to help.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Read FAQ
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}