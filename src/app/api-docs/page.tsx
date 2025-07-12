import { Metadata } from 'next'
import { 
  Code, 
  Database, 
  Key, 
  Globe, 
  BookOpen, 
  Shield,
  Zap,
  Users,
  Star,
  Camera,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'API Documentation - Puzzlr',
  description: 'Comprehensive API documentation for Puzzlr platform developers.',
}

export default function APIDocsPage() {
  const endpoints = [
    {
      category: 'Authentication',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      description: 'Secure authentication endpoints using Clerk',
      apis: [
        {
          method: 'GET',
          endpoint: '/api/auth/user',
          description: 'Get current user information',
          auth: true
        },
        {
          method: 'POST',
          endpoint: '/api/auth/sync',
          description: 'Sync user data with Supabase',
          auth: true
        }
      ]
    },
    {
      category: 'Puzzles',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      description: 'Manage puzzle data and information',
      apis: [
        {
          method: 'GET',
          endpoint: '/api/puzzles',
          description: 'Get paginated list of approved puzzles',
          auth: false
        },
        {
          method: 'GET',
          endpoint: '/api/puzzles/[id]',
          description: 'Get specific puzzle details',
          auth: false
        },
        {
          method: 'POST',
          endpoint: '/api/puzzles',
          description: 'Create new puzzle entry',
          auth: true
        },
        {
          method: 'PUT',
          endpoint: '/api/puzzles/[id]',
          description: 'Update puzzle information',
          auth: true
        }
      ]
    },
    {
      category: 'Puzzle Logs',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      description: 'Track user puzzle progress and status',
      apis: [
        {
          method: 'GET',
          endpoint: '/api/puzzle-logs',
          description: 'Get user\'s puzzle logs',
          auth: true
        },
        {
          method: 'POST',
          endpoint: '/api/puzzle-logs',
          description: 'Create new puzzle log entry',
          auth: true
        },
        {
          method: 'PUT',
          endpoint: '/api/puzzle-logs/[id]',
          description: 'Update puzzle log status/notes',
          auth: true
        },
        {
          method: 'DELETE',
          endpoint: '/api/puzzle-logs/[id]',
          description: 'Remove puzzle from user collection',
          auth: true
        }
      ]
    },
    {
      category: 'Reviews',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Puzzle reviews and ratings system',
      apis: [
        {
          method: 'GET',
          endpoint: '/api/reviews',
          description: 'Get reviews with filters',
          auth: false
        },
        {
          method: 'POST',
          endpoint: '/api/reviews',
          description: 'Submit puzzle review',
          auth: true
        },
        {
          method: 'PUT',
          endpoint: '/api/reviews/[id]',
          description: 'Update user\'s review',
          auth: true
        },
        {
          method: 'DELETE',
          endpoint: '/api/reviews/[id]',
          description: 'Delete user\'s review',
          auth: true
        }
      ]
    },
    {
      category: 'Collections',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      description: 'Puzzle collections and curation',
      apis: [
        {
          method: 'GET',
          endpoint: '/api/collections',
          description: 'Get public collections',
          auth: false
        },
        {
          method: 'POST',
          endpoint: '/api/collections',
          description: 'Create new collection',
          auth: true
        },
        {
          method: 'GET',
          endpoint: '/api/collections/[id]',
          description: 'Get collection details',
          auth: false
        },
        {
          method: 'POST',
          endpoint: '/api/collections/[id]/follow',
          description: 'Follow/unfollow collection',
          auth: true
        }
      ]
    },
    {
      category: 'Media Upload',
      icon: Camera,
      color: 'from-pink-500 to-pink-600',
      description: 'Image upload and management',
      apis: [
        {
          method: 'POST',
          endpoint: '/api/upload-photos',
          description: 'Upload puzzle progress photos',
          auth: true
        },
        {
          method: 'DELETE',
          endpoint: '/api/upload-photos/[id]',
          description: 'Delete uploaded photo',
          auth: true
        }
      ]
    }
  ]

  const quickStart = [
    {
      step: 1,
      title: 'Authentication Setup',
      description: 'Configure Clerk authentication for your application',
      code: `import { ClerkProvider } from '@clerk/nextjs'

export default function App({ children }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  )
}`
    },
    {
      step: 2,
      title: 'Make API Calls',
      description: 'Use authenticated requests to access Puzzlr API',
      code: `const response = await fetch('/api/puzzles', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})

const puzzles = await response.json()`
    },
    {
      step: 3,
      title: 'Handle Responses',
      description: 'Process API responses and handle errors',
      code: `if (response.ok) {
  const data = await response.json()
  // Handle success
} else {
  const error = await response.json()
  console.error('API Error:', error.message)
}`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build amazing puzzle applications with the Puzzlr API. Access puzzle data, 
            user progress, reviews, and more through our RESTful API.
          </p>
        </div>

        {/* Quick Start */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="w-6 h-6 text-yellow-500 mr-3" />
            Quick Start Guide
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {quickStart.map((item, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-semibold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 text-xs overflow-x-auto">
                    <code>{item.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            API Reference
          </h2>
          
          <div className="space-y-8">
            {endpoints.map((category, index) => (
              <div key={index} className="glass-card border border-white/40 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{category.category}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {category.apis.map((api, apiIndex) => (
                    <div key={apiIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            api.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            api.method === 'POST' ? 'bg-green-100 text-green-800' :
                            api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {api.method}
                          </span>
                          <code className="text-gray-800 font-mono text-sm">{api.endpoint}</code>
                        </div>
                        {api.auth && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Key className="w-3 h-3 mr-1" />
                            Auth Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{api.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authentication */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 text-red-500 mr-3" />
            Authentication
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Clerk Integration</h3>
              <p className="text-gray-700 mb-4">
                Puzzlr uses Clerk for authentication. All authenticated requests require a valid Clerk session token.
              </p>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-green-400 text-sm">
                  <code>{`// Get auth token in your frontend
import { useAuth } from '@clerk/nextjs'

const { getToken } = useAuth()
const token = await getToken()

// Include in API requests
fetch('/api/puzzle-logs', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
})`}</code>
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
              <p className="text-gray-700 mb-2">All API requests should be made to:</p>
              <div className="bg-gray-100 rounded-lg p-3">
                <code className="text-gray-800">https://puzzlr.in/api/</code>
              </div>
            </div>
          </div>
        </div>

        {/* Response Format */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Response Format
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Success Response</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-green-400 text-sm">
                  <code>{`{
  "success": true,
  "data": {
    // Response data here
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}`}</code>
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Error Response</h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-red-400 text-sm">
                  <code>{`{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Rate Limits & Guidelines
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Rate Limits</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Authenticated requests:</strong> 1000 requests/hour</li>
                <li>• <strong>Public endpoints:</strong> 100 requests/hour</li>
                <li>• <strong>File uploads:</strong> 50 uploads/hour</li>
                <li>• <strong>Bulk operations:</strong> 10 requests/minute</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Best Practices</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Cache responses when possible</li>
                <li>• Use pagination for large datasets</li>
                <li>• Handle rate limit responses gracefully</li>
                <li>• Respect data privacy and community guidelines</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SDKs and Tools */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            SDKs & Tools
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">JavaScript SDK</h3>
              <p className="text-gray-600 text-sm mb-3">Official SDK for web applications</p>
              <span className="inline-flex items-center text-gray-500 text-sm">
                <Clock className="w-3 h-3 mr-1" />
                Coming Soon
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Postman Collection</h3>
              <p className="text-gray-600 text-sm mb-3">Ready-to-use API collection</p>
              <span className="inline-flex items-center text-gray-500 text-sm">
                <Clock className="w-3 h-3 mr-1" />
                Coming Soon
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">OpenAPI Spec</h3>
              <p className="text-gray-600 text-sm mb-3">Machine-readable API specification</p>
              <span className="inline-flex items-center text-gray-500 text-sm">
                <Clock className="w-3 h-3 mr-1" />
                Coming Soon
              </span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-3">
              These developer tools are currently in development. 
            </p>
            <a
              href="/contact"
              className="inline-flex items-center text-violet-600 hover:underline text-sm"
            >
              Contact us for early access or specific API needs
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Support */}
        <div className="text-center glass-card border border-white/40 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help with the API?
          </h3>
          <p className="text-gray-600 mb-6">
            Our developer community and support team are here to help you build amazing puzzle applications.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Contact Developer Support
            </a>
            <a
              href="mailto:api@puzzlr.in"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              api@puzzlr.in
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}