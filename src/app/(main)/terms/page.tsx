import { Metadata } from 'next'
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - Puzzlr',
  description: 'Terms and conditions for using the Puzzlr platform.',
}

export default function TermsOfServicePage() {
  const lastUpdated = 'January 15, 2024'
  const effectiveDate = 'January 15, 2024'

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            These terms govern your use of Puzzlr and describe the rights and responsibilities that apply to all users.
          </p>
          <div className="text-sm text-gray-500 space-x-4">
            <span>Last updated: {lastUpdated}</span>
            <span>•</span>
            <span>Effective date: {effectiveDate}</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Puzzlr
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            These Terms of Service ("Terms") govern your use of the Puzzlr platform and services provided by Puzzlr, Inc. ("we," "us," or "our"). By accessing or using Puzzlr, you agree to be bound by these Terms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you don't agree with these Terms, please don't use our service. We may update these Terms from time to time, and your continued use constitutes acceptance of any changes.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            Acceptance and Eligibility
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Age Requirements</h3>
              <p>You must be at least 13 years old to use Puzzlr. If you are under 18, you must have permission from a parent or guardian.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Responsibility</h3>
              <p>You are responsible for maintaining the security of your account and all activities that occur under your account.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Accurate Information</h3>
              <p>You agree to provide accurate, current, and complete information when creating your account and using our services.</p>
            </div>
          </div>
        </div>

        {/* Use of Service */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Scale className="w-6 h-6 text-blue-500 mr-3" />
            Permitted Use
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                You May:
              </h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Track your puzzle progress and collections</li>
                <li>• Write honest reviews and ratings</li>
                <li>• Upload your own puzzle photos</li>
                <li>• Connect with other puzzle enthusiasts</li>
                <li>• Create and share collections</li>
                <li>• Use our platform for personal, non-commercial purposes</li>
              </ul>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                You May Not:
              </h3>
              <ul className="space-y-2 text-red-700 text-sm">
                <li>• Post false, misleading, or spam content</li>
                <li>• Upload images you don't own or have permission to use</li>
                <li>• Harass, abuse, or harm other users</li>
                <li>• Attempt to hack or compromise our systems</li>
                <li>• Use automated tools to access our service</li>
                <li>• Violate any applicable laws or regulations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content and Intellectual Property */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Content and Intellectual Property
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Your Content</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• You retain ownership of content you upload (photos, reviews, etc.)</li>
                <li>• You grant us a license to display and distribute your content on Puzzlr</li>
                <li>• You're responsible for ensuring you have rights to any content you upload</li>
                <li>• You can delete your content at any time</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Our Content</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Puzzlr platform, design, and features are our intellectual property</li>
                <li>• Puzzle database information is aggregated from public sources and user contributions</li>
                <li>• You may not copy, reproduce, or distribute our platform or content</li>
                <li>• Our trademarks and logos are protected intellectual property</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Third-Party Content</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Puzzle images and information may be owned by puzzle manufacturers</li>
                <li>• We respect intellectual property rights and respond to valid takedown requests</li>
                <li>• Report copyright infringement to our designated agent</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy and Data */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 text-purple-500 mr-3" />
            Privacy and Data Protection
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using Puzzlr, you also agree to our Privacy Policy.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Key Points:</strong> We don't sell your personal data, we use secure authentication through Clerk, and you control your privacy settings.
              </p>
            </div>
            <p>
              <a href="/privacy" className="text-violet-600 hover:underline">Read our full Privacy Policy →</a>
            </p>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            Prohibited Activities
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              To maintain a safe and positive community, the following activities are strictly prohibited:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Content Violations</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Posting copyrighted images without permission</li>
                  <li>• Creating fake reviews or ratings</li>
                  <li>• Uploading inappropriate or offensive content</li>
                  <li>• Spamming or posting irrelevant content</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Behavioral Violations</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Harassing or bullying other users</li>
                  <li>• Creating multiple fake accounts</li>
                  <li>• Attempting to circumvent platform restrictions</li>
                  <li>• Engaging in any illegal activities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Account Termination
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Right to Terminate</h3>
              <p>You may delete your account at any time through your account settings or by contacting us.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Our Right to Terminate</h3>
              <p>We reserve the right to suspend or terminate accounts that violate these Terms or our Community Guidelines. We'll provide notice when possible, except in cases of serious violations.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Effect of Termination</h3>
              <p>Upon termination, your access to Puzzlr will cease, and we may delete your account data in accordance with our Privacy Policy.</p>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Disclaimers and Limitations
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Availability</h3>
              <p>We strive to keep Puzzlr available 24/7, but we don't guarantee uninterrupted service. We may need to perform maintenance or updates that temporarily affect availability.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Content Accuracy</h3>
              <p>While we work to maintain accurate puzzle information, we rely on user contributions and can't guarantee the accuracy of all content on our platform.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Third-Party Links</h3>
              <p>Our service may contain links to third-party websites or services. We're not responsible for the content or practices of these external sites.</p>
            </div>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Changes to These Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update these Terms from time to time to reflect changes in our service or applicable laws. We'll notify you of material changes by posting the updated Terms on our platform and updating the effective date. Your continued use of Puzzlr after changes take effect constitutes acceptance of the updated Terms.
          </p>
        </div>

        {/* Contact Information */}
        <div className="text-center glass-card border border-white/40 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Questions About These Terms?
          </h3>
          <p className="text-gray-600 mb-6">
            If you have questions about these Terms of Service, please don't hesitate to contact us.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
            >
              Contact Legal Team
            </a>
            <a
              href="mailto:legal@puzzlr.in"
              className="inline-block border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              legal@puzzlr.in
            </a>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>
              <strong>Puzzlr, Inc.</strong><br/>
              [Company Address]<br/>
              [City, State, ZIP]<br/>
              United States
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}