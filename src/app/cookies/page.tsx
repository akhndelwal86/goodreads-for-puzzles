import { Metadata } from 'next'
import { Cookie, Settings, BarChart3, Shield, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy - Puzzlr',
  description: 'Learn about how Puzzlr uses cookies and similar technologies.',
}

export default function CookiePolicyPage() {
  const lastUpdated = 'January 15, 2024'

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      icon: Shield,
      color: 'text-red-500',
      required: true,
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: [
        'Authentication cookies to keep you logged in',
        'Security cookies to protect against fraud',
        'Session cookies to maintain your browsing session',
        'Load balancing cookies for optimal performance'
      ],
      retention: 'Session or up to 1 year',
      canDisable: false
    },
    {
      name: 'Functionality Cookies',
      icon: Settings,
      color: 'text-blue-500',
      required: false,
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: [
        'Preference cookies to remember your settings',
        'Language and region preferences',
        'Theme and display preferences (dark/light mode)',
        'Recently viewed puzzles and collections'
      ],
      retention: 'Up to 1 year',
      canDisable: true
    },
    {
      name: 'Analytics Cookies',
      icon: BarChart3,
      color: 'text-green-500',
      required: false,
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: [
        'Google Analytics cookies for usage statistics',
        'Page performance and loading time metrics',
        'Feature usage and user behavior patterns',
        'Error tracking and debugging information'
      ],
      retention: 'Up to 2 years',
      canDisable: true
    }
  ]

  const thirdPartyServices = [
    {
      service: 'Clerk (Authentication)',
      purpose: 'Secure user authentication and account management',
      cookies: ['__session', '__clerk_*'],
      privacy: 'https://clerk.com/privacy'
    },
    {
      service: 'Supabase (Database)',
      purpose: 'Database operations and real-time features',
      cookies: ['sb-*'],
      privacy: 'https://supabase.com/privacy'
    },
    {
      service: 'Google Analytics',
      purpose: 'Website analytics and performance monitoring',
      cookies: ['_ga', '_ga_*', '_gid'],
      privacy: 'https://policies.google.com/privacy'
    },
    {
      service: 'Vercel (Hosting)',
      purpose: 'Website hosting and performance optimization',
      cookies: ['__vercel_*'],
      privacy: 'https://vercel.com/legal/privacy-policy'
    }
  ]

  const controlMethods = [
    {
      method: 'Browser Settings',
      description: 'Most browsers allow you to control cookies through their settings',
      steps: [
        'Access your browser\'s settings or preferences',
        'Look for "Privacy" or "Cookies" section',
        'Choose to block all cookies, allow only essential cookies, or customize by site',
        'Some browsers offer private/incognito mode for temporary sessions'
      ]
    },
    {
      method: 'Puzzlr Cookie Preferences',
      description: 'We provide cookie preference controls within our platform',
      steps: [
        'Look for cookie banner when you first visit',
        'Access cookie settings through your account preferences',
        'Choose which types of cookies to allow',
        'Update your preferences anytime'
      ]
    },
    {
      method: 'Third-Party Opt-Outs',
      description: 'Some services provide their own opt-out mechanisms',
      steps: [
        'Google Analytics opt-out: Use Google\'s opt-out browser add-on',
        'Visit service privacy pages for additional controls',
        'Some services respect "Do Not Track" browser signals',
        'Check individual service policies for specific instructions'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Cookie className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Learn about how Puzzlr uses cookies and similar technologies to enhance your experience and protect your privacy.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What Are Cookies?
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Cookies are small text files that are stored on your device when you visit a website. 
              They help websites remember information about your visit, which can make your next 
              visit easier and the site more useful to you.
            </p>
            <p>
              At Puzzlr, we use cookies and similar technologies to provide essential functionality, 
              improve your experience, and understand how our platform is used. This policy explains 
              what cookies we use, why we use them, and how you can control them.
            </p>
          </div>
        </div>

        {/* Cookie Types */}
        <div className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Types of Cookies We Use
          </h2>
          
          {cookieTypes.map((type, index) => (
            <div key={index} className="glass-card border border-white/40 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <type.icon className={`w-8 h-8 ${type.color} mr-4`} />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {type.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  {type.required ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Optional
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                {type.description}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Examples:</h4>
                  <ul className="space-y-1">
                    {type.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Retention Period:</h4>
                    <p className="text-sm text-gray-700">{type.retention}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Can be disabled:</h4>
                    <p className="text-sm text-gray-700">
                      {type.canDisable ? 'Yes, through browser or site settings' : 'No, required for basic functionality'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Third-Party Services */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Third-Party Services and Cookies
          </h2>
          <p className="text-gray-700 mb-6">
            We work with trusted third-party services that may also set cookies on your device. 
            Here are the main services we use:
          </p>
          
          <div className="space-y-4">
            {thirdPartyServices.map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{service.service}</h3>
                  <a
                    href={service.privacy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline text-sm"
                  >
                    Privacy Policy
                  </a>
                </div>
                <p className="text-gray-700 text-sm mb-2">{service.purpose}</p>
                <div className="text-xs text-gray-500">
                  <strong>Common cookies:</strong> {service.cookies.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cookie Controls */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How to Control Cookies
          </h2>
          <p className="text-gray-700 mb-6">
            You have several options for controlling how cookies are used on your device:
          </p>
          
          <div className="space-y-8">
            {controlMethods.map((method, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {method.method}
                </h3>
                <p className="text-gray-700 mb-3">{method.description}</p>
                <ul className="space-y-2">
                  {method.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start text-sm text-gray-700">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Impact of Disabling */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 text-amber-500 mr-3" />
            Impact of Disabling Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            While you can disable cookies, please note that this may affect your experience on Puzzlr:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3">If you disable essential cookies:</h3>
              <ul className="space-y-1 text-red-700 text-sm">
                <li>• You may not be able to log in or access your account</li>
                <li>• Security features may not work properly</li>
                <li>• Basic site functionality may be impaired</li>
                <li>• You may encounter errors or unexpected behavior</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-3">If you disable optional cookies:</h3>
              <ul className="space-y-1 text-amber-700 text-sm">
                <li>• Your preferences may not be remembered</li>
                <li>• Personalized features may not work</li>
                <li>• We can't improve the site based on usage data</li>
                <li>• Some convenience features may be unavailable</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Updates to Policy */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Updates to This Cookie Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices, 
            technology, or applicable laws. We will notify you of any material changes by posting 
            the updated policy on our platform and updating the "Last updated" date. We encourage 
            you to review this policy regularly to stay informed about our use of cookies.
          </p>
        </div>

        {/* Contact */}
        <div className="text-center glass-card border border-white/40 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Questions About Our Cookie Policy?
          </h3>
          <p className="text-gray-600 mb-6">
            If you have questions about how we use cookies or need help managing your cookie preferences, 
            please don't hesitate to contact us.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Contact Support
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