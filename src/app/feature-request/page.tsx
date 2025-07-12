'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { 
  Lightbulb, 
  Users, 
  Star, 
  TrendingUp, 
  CheckCircle,
  Send,
  Heart,
  Zap,
  Target
} from 'lucide-react'

export default function FeatureRequestPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    problem: '',
    solution: '',
    alternativeSolutions: '',
    userType: '',
    priority: '',
    additionalContext: '',
    userEmail: '',
    willingToTest: false
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [friendlyId, setFriendlyId] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const response = await fetch('/api/feature-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit feature request')
      }

      setFriendlyId(result.friendlyId)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting feature request:', error)
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: 'puzzle-tracking', label: 'Puzzle Tracking & Logging', icon: Target },
    { value: 'social-features', label: 'Social & Community Features', icon: Users },
    { value: 'discovery', label: 'Puzzle Discovery & Search', icon: TrendingUp },
    { value: 'collections', label: 'Collections & Organization', icon: Star },
    { value: 'mobile-app', label: 'Mobile App Features', icon: Zap },
    { value: 'notifications', label: 'Notifications & Alerts', icon: Heart },
    { value: 'other', label: 'Other / General Improvement', icon: Lightbulb }
  ]

  const userTypes = [
    'Casual puzzler (1-5 puzzles per year)',
    'Regular puzzler (6-20 puzzles per year)',
    'Avid puzzler (21+ puzzles per year)',
    'Puzzle collector',
    'Puzzle reviewer/blogger',
    'Puzzle store owner/employee',
    'Developer/API user',
    'Other'
  ]

  const priorityLevels = [
    { value: 'nice-to-have', label: 'Nice to Have', description: 'Would be cool but not essential' },
    { value: 'helpful', label: 'Helpful', description: 'Would improve my experience' },
    { value: 'important', label: 'Important', description: 'Would significantly help my workflow' },
    { value: 'critical', label: 'Critical', description: 'Essential for my use of Puzzlr' }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="glass-card border border-white/40 rounded-2xl p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Feature Request Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for helping us improve Puzzlr! We'll review your suggestion and consider it for future updates.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Request ID:</strong> #{friendlyId}
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <p>• We'll evaluate your request with our product team</p>
              <p>• Popular requests get higher priority</p>
              <p>• We may contact you for additional details</p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  title: '', category: '', description: '', problem: '', solution: '',
                  alternativeSolutions: '', userType: '', priority: '', additionalContext: '',
                  userEmail: '', willingToTest: false
                })
              }}
              className="bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Feature Request
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have an idea to make Puzzlr even better? We'd love to hear it! Your suggestions help us 
            build features that matter most to puzzle enthusiasts.
          </p>
        </div>

        {/* Popular Requests Preview */}
        <div className="glass-card border border-white/40 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            Most Requested Features (Coming Soon!)
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <ul className="space-y-2">
              <li>• Mobile app for iOS and Android</li>
              <li>• Puzzle wishlist and gift registry</li>
              <li>• Advanced search and filtering</li>
            </ul>
            <ul className="space-y-2">
              <li>• Puzzle swap/trade marketplace</li>
              <li>• Competition and leaderboards</li>
              <li>• Puzzle recommendation engine</li>
            </ul>
          </div>
        </div>

        {/* Feature Request Form */}
        <div className="glass-card border border-white/40 rounded-2xl p-8">
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {submitError}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Overview</h3>
              
              <div className="space-y-6">
                {/* Feature Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Feature Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Brief, descriptive name for your feature idea"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Feature Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Feature Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    placeholder="Describe your feature idea in detail. What would it do? How would it work?"
                  />
                </div>
              </div>
            </div>

            {/* Problem & Solution */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem & Solution</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
                    What Problem Does This Solve? *
                  </label>
                  <textarea
                    id="problem"
                    name="problem"
                    required
                    rows={3}
                    value={formData.problem}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    placeholder="What current pain point, frustration, or limitation would this feature address?"
                  />
                </div>

                <div>
                  <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Solution *
                  </label>
                  <textarea
                    id="solution"
                    name="solution"
                    required
                    rows={4}
                    value={formData.solution}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    placeholder="How would your feature solve this problem? Be specific about functionality and user experience."
                  />
                </div>

                <div>
                  <label htmlFor="alternativeSolutions" className="block text-sm font-medium text-gray-700 mb-2">
                    Alternative Solutions (Optional)
                  </label>
                  <textarea
                    id="alternativeSolutions"
                    name="alternativeSolutions"
                    rows={3}
                    value={formData.alternativeSolutions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    placeholder="Are there other ways to solve this problem? Have you seen similar features elsewhere?"
                  />
                </div>
              </div>
            </div>

            {/* User Context */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Context</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    How Would You Describe Yourself? *
                  </label>
                  <select
                    id="userType"
                    name="userType"
                    required
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">Select user type</option>
                    {userTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    How Important Is This Feature to You? *
                  </label>
                  <div className="space-y-3">
                    {priorityLevels.map(level => (
                      <label key={level.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value={level.value}
                          checked={formData.priority === level.value}
                          onChange={handleInputChange}
                          className="mt-1 text-violet-600 focus:ring-violet-500"
                          required
                        />
                        <div>
                          <div className="font-medium text-gray-900">{level.label}</div>
                          <div className="text-sm text-gray-600">{level.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="additionalContext" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    id="additionalContext"
                    name="additionalContext"
                    rows={3}
                    value={formData.additionalContext}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    placeholder="Any additional context, use cases, or examples that might help us understand your request better?"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Testing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    We may contact you for clarification or to notify you when this feature is available.
                  </p>
                </div>

                <div>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="willingToTest"
                      checked={formData.willingToTest}
                      onChange={handleInputChange}
                      className="mt-1 text-violet-600 focus:ring-violet-500 rounded"
                    />
                    <div>
                      <div className="font-medium text-gray-900">I'd like to help test this feature</div>
                      <div className="text-sm text-gray-600">
                        Check this if you'd be willing to participate in beta testing when this feature is developed.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Feature Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Community Voting */}
        <div className="mt-12 glass-card border border-white/40 rounded-xl p-6">
          <div className="text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Community-Driven Development
            </h3>
            <p className="text-gray-600 mb-4">
              Features with the most community interest get prioritized. After submitting your request, 
              we'll add it to our public roadmap where other users can vote and comment.
            </p>
            <a
              href="/roadmap"
              className="inline-flex items-center text-violet-600 hover:underline"
            >
              View Current Roadmap →
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}