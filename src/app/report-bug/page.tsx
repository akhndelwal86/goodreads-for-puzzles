'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { 
  Bug, 
  Upload, 
  AlertCircle, 
  CheckCircle,
  Monitor,
  Smartphone,
  Tablet,
  Send
} from 'lucide-react'

export default function ReportBugPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    device: '',
    browser: '',
    operatingSystem: '',
    puzzlrPage: '',
    frequency: '',
    severity: '',
    userEmail: '',
    attachments: []
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [friendlyId, setFriendlyId] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const response = await fetch('/api/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit bug report')
      }

      setFriendlyId(result.friendlyId)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting bug report:', error)
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const severityLevels = [
    { value: 'low', label: 'Low - Minor inconvenience', color: 'text-green-600' },
    { value: 'medium', label: 'Medium - Affects some functionality', color: 'text-yellow-600' },
    { value: 'high', label: 'High - Major feature broken', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical - App unusable', color: 'text-red-600' }
  ]

  const frequencyOptions = [
    'Always (100% of the time)',
    'Very Often (75% of the time)',
    'Sometimes (50% of the time)',
    'Rarely (25% of the time)',
    'Once (happened only once)'
  ]

  const deviceTypes = [
    { value: 'desktop', label: 'Desktop Computer', icon: Monitor },
    { value: 'mobile', label: 'Mobile Phone', icon: Smartphone },
    { value: 'tablet', label: 'Tablet', icon: Tablet }
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="glass-card border border-white/40 rounded-2xl p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bug Report Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for helping us improve Puzzlr. We'll investigate this issue and get back to you soon.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Bug ID:</strong> #{friendlyId}
              </p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  title: '', description: '', stepsToReproduce: '', expectedBehavior: '',
                  actualBehavior: '', device: '', browser: '', operatingSystem: '',
                  puzzlrPage: '', frequency: '', severity: '', userEmail: '', attachments: []
                })
              }}
              className="bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Report Another Bug
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
              <Bug className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Report a Bug
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Found a bug in Puzzlr? Help us fix it by providing detailed information about the issue. 
            The more details you provide, the faster we can resolve it.
          </p>
        </div>

        {/* Tips */}
        <div className="glass-card border border-white/40 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
            Tips for Great Bug Reports
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <ul className="space-y-2">
              <li>• Be specific about what you were trying to do</li>
              <li>• Include exact error messages if any</li>
              <li>• Mention your browser and device type</li>
            </ul>
            <ul className="space-y-2">
              <li>• Describe what you expected to happen</li>
              <li>• Take screenshots if helpful</li>
              <li>• Note if this happens every time or just sometimes</li>
            </ul>
          </div>
        </div>

        {/* Bug Report Form */}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bug Details</h3>
              
              <div className="space-y-6">
                {/* Bug Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Bug Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="Brief, descriptive title for the bug"
                  />
                </div>

                {/* Severity */}
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                    Severity Level *
                  </label>
                  <select
                    id="severity"
                    name="severity"
                    required
                    value={formData.severity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">Select severity level</option>
                    {severityLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Bug Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    placeholder="Describe what's happening and what's wrong..."
                  />
                </div>
              </div>
            </div>

            {/* Reproduction Steps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Reproduce</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="stepsToReproduce" className="block text-sm font-medium text-gray-700 mb-2">
                    Steps to Reproduce *
                  </label>
                  <textarea
                    id="stepsToReproduce"
                    name="stepsToReproduce"
                    required
                    rows={5}
                    value={formData.stepsToReproduce}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Enter...&#10;4. Notice that..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="expectedBehavior" className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Behavior *
                    </label>
                    <textarea
                      id="expectedBehavior"
                      name="expectedBehavior"
                      required
                      rows={3}
                      value={formData.expectedBehavior}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      placeholder="What should have happened?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="actualBehavior" className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Behavior *
                    </label>
                    <textarea
                      id="actualBehavior"
                      name="actualBehavior"
                      required
                      rows={3}
                      value={formData.actualBehavior}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                      placeholder="What actually happened?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                    How Often Does This Happen? *
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    required
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    {frequencyOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Environment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Device Type *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {deviceTypes.map(device => (
                      <label key={device.value} className="relative">
                        <input
                          type="radio"
                          name="device"
                          value={device.value}
                          checked={formData.device === device.value}
                          onChange={handleInputChange}
                          className="sr-only"
                          required
                        />
                        <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                          formData.device === device.value 
                            ? 'border-violet-500 bg-violet-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <device.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">{device.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="browser" className="block text-sm font-medium text-gray-700 mb-2">
                      Browser & Version *
                    </label>
                    <input
                      type="text"
                      id="browser"
                      name="browser"
                      required
                      value={formData.browser}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="e.g., Chrome 120, Safari 17, Firefox 119"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="operatingSystem" className="block text-sm font-medium text-gray-700 mb-2">
                      Operating System *
                    </label>
                    <input
                      type="text"
                      id="operatingSystem"
                      name="operatingSystem"
                      required
                      value={formData.operatingSystem}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="e.g., Windows 11, macOS 14, iOS 17"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="puzzlrPage" className="block text-sm font-medium text-gray-700 mb-2">
                    Puzzlr Page/Section Where Bug Occurred *
                  </label>
                  <input
                    type="text"
                    id="puzzlrPage"
                    name="puzzlrPage"
                    required
                    value={formData.puzzlrPage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="e.g., My Puzzles page, Browse Puzzles, Puzzle Detail page, etc."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
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
                  placeholder="your@email.com (for follow-up questions)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We may contact you if we need more information about this bug.
                </p>
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
                    Submitting Bug Report...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Bug Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center glass-card border border-white/40 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Immediate Help?
          </h3>
          <p className="text-gray-600 mb-4">
            For urgent issues or if you need immediate assistance, please contact our support team directly.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center text-violet-600 hover:underline"
          >
            Contact Support Team →
          </a>
        </div>

      </div>
    </div>
  )
}