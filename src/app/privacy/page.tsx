import { Metadata } from 'next'
import { Shield, Eye, Lock, Database, Share2, Mail, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - Puzzlr',
  description: 'Learn how Puzzlr collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 15, 2024'

  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Account Information',
          details: [
            'Email address and username when you create an account',
            'Profile information you choose to provide (display name, bio, avatar)',
            'Authentication data managed securely through Clerk'
          ]
        },
        {
          subtitle: 'Puzzle Activity Data',
          details: [
            'Puzzles you add to your collection and their status',
            'Reviews and ratings you write',
            'Photos you upload of your puzzle progress and completions',
            'Completion times and puzzle logs',
            'Collections you create and follow'
          ]
        },
        {
          subtitle: 'Usage Information',
          details: [
            'How you interact with our platform (pages visited, features used)',
            'Device and browser information for technical optimization',
            'IP address for security and fraud prevention',
            'Usage analytics to improve our service'
          ]
        }
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        {
          subtitle: 'Core Service Functionality',
          details: [
            'Provide and maintain your Puzzlr account and profile',
            'Enable puzzle tracking, reviews, and community features',
            'Display your content to other users based on your privacy settings',
            'Send important account and service notifications'
          ]
        },
        {
          subtitle: 'Personalization and Recommendations',
          details: [
            'Suggest puzzles based on your preferences and activity',
            'Customize your experience and content feeds',
            'Provide relevant collections and community recommendations'
          ]
        },
        {
          subtitle: 'Platform Improvement',
          details: [
            'Analyze usage patterns to improve our features',
            'Develop new functionality based on user needs',
            'Ensure platform security and prevent abuse',
            'Provide customer support when needed'
          ]
        }
      ]
    },
    {
      title: 'Information Sharing',
      icon: Share2,
      content: [
        {
          subtitle: 'What We Share Publicly',
          details: [
            'Your profile information (as configured in your privacy settings)',
            'Puzzle reviews, ratings, and collections you make public',
            'Photos and content you choose to share with the community',
            'Activity that you set to be visible to followers or everyone'
          ]
        },
        {
          subtitle: 'What We Never Share',
          details: [
            'Your email address or other private contact information',
            'Private messages or personal notes',
            'Detailed analytics about your usage patterns',
            'Any information with third parties for marketing purposes'
          ]
        },
        {
          subtitle: 'Limited Sharing for Service Operations',
          details: [
            'With Supabase (our database provider) to store and manage your data',
            'With Clerk (our authentication provider) to manage your account security',
            'With cloud storage providers to host your uploaded images',
            'With law enforcement if required by legal obligation'
          ]
        }
      ]
    },
    {
      title: 'Your Privacy Controls',
      icon: Lock,
      content: [
        {
          subtitle: 'Profile Privacy Settings',
          details: [
            'Control who can see your profile and puzzle activity',
            'Choose whether your collections are public or private',
            'Decide if other users can follow you',
            'Manage what appears in your public activity feed'
          ]
        },
        {
          subtitle: 'Content Controls',
          details: [
            'Edit or delete your reviews and ratings at any time',
            'Remove photos you\'ve uploaded',
            'Update or delete collections you\'ve created',
            'Control notifications and email preferences'
          ]
        },
        {
          subtitle: 'Data Access and Portability',
          details: [
            'Download a copy of your puzzle data and activity',
            'Request correction of inaccurate information',
            'Delete your account and associated data',
            'Contact us for any privacy-related questions'
          ]
        }
      ]
    },
    {
      title: 'Data Security',
      icon: Shield,
      content: [
        {
          subtitle: 'Technical Safeguards',
          details: [
            'Encryption of data in transit and at rest',
            'Secure authentication powered by Clerk',
            'Regular security audits and monitoring',
            'Access controls and permission systems'
          ]
        },
        {
          subtitle: 'Operational Security',
          details: [
            'Limited employee access to personal data',
            'Regular backup and disaster recovery procedures',
            'Incident response protocols for security events',
            'Compliance with industry security standards'
          ]
        },
        {
          subtitle: 'Your Role in Security',
          details: [
            'Keep your account credentials secure',
            'Report suspicious activity immediately',
            'Review your privacy settings regularly',
            'Be mindful of what you share publicly'
          ]
        }
      ]
    }
  ]

  const rights = [
    'Access your personal data we have stored',
    'Correct inaccurate or incomplete information',
    'Delete your account and associated data',
    'Download your data in a portable format',
    'Opt out of non-essential communications',
    'Restrict how we process your information'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            We're committed to protecting your privacy and being transparent about how we collect, 
            use, and share your information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Our Commitment to Your Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Puzzlr, we believe that your privacy is fundamental. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you use our platform. We are 
            committed to protecting your personal information and your right to privacy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using Puzzlr, you agree to the collection and use of information in accordance with this 
            Privacy Policy. If you have any questions or concerns, please don't hesitate to contact us.
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-12 mb-16">
          {sections.map((section, index) => (
            <div key={index} className="glass-card border border-white/40 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <section.icon className="w-8 h-8 text-violet-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>
              
              <div className="space-y-6">
                {section.content.map((subsection, subIndex) => (
                  <div key={subIndex}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {subsection.subtitle}
                    </h3>
                    <ul className="space-y-2">
                      {subsection.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Your Rights */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 text-blue-500 mr-3" />
            Your Rights and Choices
          </h2>
          <p className="text-gray-700 mb-6">
            You have several rights regarding your personal information. You can exercise these rights 
            by accessing your account settings or contacting us directly:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {rights.map((right, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600 mr-3" />
                <span className="text-blue-800 text-sm font-medium">{right}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cookies and Tracking */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cookies and Tracking Technologies
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              We use cookies and similar tracking technologies to enhance your experience on Puzzlr:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Essential Cookies:</strong> Required for basic platform functionality and security</li>
              <li>• <strong>Preference Cookies:</strong> Remember your settings and customizations</li>
              <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our platform to improve it</li>
            </ul>
            <p>
              You can control cookie preferences through your browser settings. Note that disabling 
              essential cookies may affect platform functionality.
            </p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Children's Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Puzzlr is designed for users aged 13 and older. We do not knowingly collect personal 
            information from children under 13. If you believe we have inadvertently collected 
            information from a child under 13, please contact us immediately and we will take 
            steps to remove that information from our systems.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices 
            or applicable laws. We will notify you of any material changes by posting the updated 
            policy on our platform and updating the "Last updated" date. We encourage you to 
            review this Privacy Policy regularly to stay informed about how we protect your information.
          </p>
        </div>

        {/* Contact */}
        <div className="text-center glass-card border border-white/40 rounded-xl p-8">
          <Mail className="w-12 h-12 text-violet-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Questions About This Privacy Policy?
          </h3>
          <p className="text-gray-600 mb-6">
            If you have questions about this Privacy Policy or how we handle your personal information, 
            we're here to help.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Contact Privacy Team
            </a>
            <a
              href="mailto:privacy@puzzlr.in"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              privacy@puzzlr.in
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}