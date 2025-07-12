'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react'

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Puzzlr?',
        a: 'Puzzlr is a social platform for jigsaw puzzle enthusiasts. Think of it as "Goodreads for puzzles" - you can track your puzzle progress, discover new puzzles, read and write reviews, and connect with other puzzle lovers.'
      },
      {
        q: 'How do I get started?',
        a: 'Simply sign up for a free account, then start by adding puzzles to your collection. You can browse our extensive puzzle database, add puzzles you own or want to do, and start tracking your progress.'
      },
      {
        q: 'Is Puzzlr free to use?',
        a: 'Yes! Puzzlr is completely free to use. You can track unlimited puzzles, write reviews, upload photos, and participate in the community without any cost.'
      },
      {
        q: 'Do I need to download an app?',
        a: 'No download required! Puzzlr works perfectly in your web browser on any device - desktop, tablet, or mobile. We may release mobile apps in the future.'
      }
    ]
  },
  {
    category: 'Tracking Puzzles',
    questions: [
      {
        q: 'How do I add a puzzle to my collection?',
        a: 'You can add puzzles in several ways: browse our database and click "Add to My Puzzles", use the "Add Puzzle" button in the navigation, or create a new puzzle entry if it doesn\'t exist yet.'
      },
      {
        q: 'What puzzle statuses can I track?',
        a: 'You can track puzzles with these statuses: Want to Do, In Progress, Completed, and Abandoned. This helps you organize your puzzle journey and see your progress over time.'
      },
      {
        q: 'Can I upload photos of my puzzles?',
        a: 'Absolutely! You can upload progress photos and completion photos for any puzzle. This is a great way to document your journey and share your achievements with the community.'
      },
      {
        q: 'How do I track completion times?',
        a: 'When you log a puzzle as "In Progress", you can start timing your session. Puzzlr will track your total time spent and display it when you mark the puzzle as complete.'
      },
      {
        q: 'Can I add notes to my puzzles?',
        a: 'Yes! Each puzzle log allows you to add personal notes. You can record thoughts about difficulty, quality, where you worked on it, or any other memories you want to keep.'
      }
    ]
  },
  {
    category: 'Community Features',
    questions: [
      {
        q: 'How do reviews work?',
        a: 'You can write detailed reviews for any puzzle you\'ve completed. Rate the puzzle from 1-5 stars and share insights about image quality, piece fit, difficulty, and overall experience to help other puzzlers.'
      },
      {
        q: 'Can I follow other users?',
        a: 'Yes! You can follow other puzzlers to see their activity in your feed. This is a great way to discover new puzzles and see what the community is working on.'
      },
      {
        q: 'What appears in my activity feed?',
        a: 'Your feed shows recent activity from users you follow, including puzzle completions, new reviews, photo uploads, and puzzle additions. You can also view the global community feed.'
      },
      {
        q: 'How do I find other puzzlers to follow?',
        a: 'Visit the "Community" section to discover active users, or check out who\'s reviewing puzzles you\'re interested in. You can also find users through their puzzle activity and reviews.'
      }
    ]
  },
  {
    category: 'Puzzle Database',
    questions: [
      {
        q: 'How many puzzles are in the database?',
        a: 'Our database contains thousands of puzzles from popular brands like Ravensburger, Buffalo Games, Cobble Hill, and many more. We\'re constantly adding new puzzles as they\'re released.'
      },
      {
        q: 'What if I can\'t find my puzzle?',
        a: 'If a puzzle isn\'t in our database yet, you can easily add it! Use the "Add Puzzle" feature to create a new entry with details like brand, piece count, theme, and images.'
      },
      {
        q: 'How do I search for puzzles?',
        a: 'Use our browse page to search by title, brand, piece count, theme, or difficulty. You can filter results to find exactly what you\'re looking for.'
      },
      {
        q: 'Are puzzle specifications accurate?',
        a: 'We strive for accuracy and rely on our community to help maintain correct information. If you notice an error, please let us know so we can fix it.'
      }
    ]
  },
  {
    category: 'Collections & Lists',
    questions: [
      {
        q: 'What are collections?',
        a: 'Collections are curated groups of puzzles organized by themes, difficulty, brands, or any criteria you choose. You can create your own collections or follow collections made by others.'
      },
      {
        q: 'How do I create a collection?',
        a: 'Click "Browse" → "Collections" → "Create Collection". Choose a theme, set filters for puzzle criteria, and our system will automatically include matching puzzles.'
      },
      {
        q: 'What are Smart Lists?',
        a: 'Smart Lists are automatically generated based on puzzle data and community activity. Examples include "Trending Puzzles", "Most Completed", and "Recently Added".'
      },
      {
        q: 'Can I make my collections private?',
        a: 'When creating collections, you can set them as public (visible to everyone) or private (only visible to you). You can change this setting anytime.'
      }
    ]
  },
  {
    category: 'Account & Privacy',
    questions: [
      {
        q: 'How do I change my profile information?',
        a: 'Click on your profile avatar in the top navigation, then select "Profile Settings" to update your display name, bio, and other profile information.'
      },
      {
        q: 'Can I make my profile private?',
        a: 'Yes, you can adjust your privacy settings to control what information is visible to other users and whether people can follow you.'
      },
      {
        q: 'How do I delete my account?',
        a: 'If you need to delete your account, please contact us through the Contact page. We\'ll be sad to see you go, but we\'ll help you remove your data.'
      },
      {
        q: 'Is my data safe?',
        a: 'We take data security seriously. Read our Privacy Policy for full details on how we protect and use your information.'
      }
    ]
  },
  {
    category: 'Technical Support',
    questions: [
      {
        q: 'I found a bug. How do I report it?',
        a: 'We appreciate bug reports! Use the "Submit Bug Report" link in our footer, or contact us directly with details about what you experienced.'
      },
      {
        q: 'Can I suggest new features?',
        a: 'Absolutely! We love hearing feature ideas from our community. Use the "Feature Requests" link in the footer to share your suggestions.'
      },
      {
        q: 'Why are my photos not uploading?',
        a: 'Make sure your photos are in JPG, PNG, or WebP format and under 10MB. If you\'re still having trouble, try refreshing the page or contact support.'
      },
      {
        q: 'The site seems slow. What should I do?',
        a: 'Try refreshing your browser or clearing your cache. If problems persist, please let us know your browser type and device so we can investigate.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about using Puzzlr
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 glass-card border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {filteredFAQ.map((category, categoryIndex) => (
            <div key={categoryIndex} className="glass-card border border-white/40 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const itemId = `${categoryIndex}-${itemIndex}`
                  const isOpen = openItems.includes(itemId)
                  
                  return (
                    <div key={itemIndex} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                      >
                        <span className="font-semibold text-gray-900 pr-4">
                          {item.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4 text-gray-700 leading-relaxed border-t border-gray-100">
                          <div className="pt-4">
                            {item.a}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQ.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No FAQ items found matching "{searchTerm}"
            </p>
            <p className="text-gray-500 mt-2">
              Try a different search term or <a href="/contact" className="text-violet-600 hover:underline">contact us</a> for help.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 text-center glass-card border border-white/40 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-violet-600 hover:to-emerald-600 transition-all duration-200"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  )
}