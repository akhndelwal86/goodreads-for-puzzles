import { Metadata } from 'next'
import { 
  Puzzle, 
  Users, 
  Heart, 
  Star, 
  Camera, 
  BarChart3,
  Target,
  Globe,
  Award
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Puzzlr - The Social Platform for Puzzle Enthusiasts',
  description: 'Learn about Puzzlr, the community-driven platform where jigsaw puzzle enthusiasts discover, track, and share their puzzle journey.',
}

export default function AboutPage() {
  const features = [
    {
      title: 'Track Your Progress',
      description: 'Log your puzzle journey with status updates, completion times, and progress photos.',
      icon: BarChart3,
    },
    {
      title: 'Discover New Puzzles',
      description: 'Explore thousands of puzzles across brands, themes, and difficulty levels.',
      icon: Target,
    },
    {
      title: 'Connect with Community',
      description: 'Share experiences, read reviews, and connect with fellow puzzle enthusiasts.',
      icon: Globe,
    },
    {
      title: 'Rate & Review',
      description: 'Help others discover great puzzles with detailed reviews and ratings.',
      icon: Award,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🧩</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">Puzzlr</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The social platform where jigsaw puzzle enthusiasts discover, track, and share their puzzle journey. 
            Think Goodreads, but for puzzles.
          </p>
        </div>


        {/* Mission Section */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              We believe that jigsaw puzzles are more than just a hobby—they're a journey of patience, 
              creativity, and accomplishment. Puzzlr was created to build a community where puzzle 
              enthusiasts can share their passion, discover new challenges, and celebrate their achievements together.
            </p>
            <div className="flex justify-center">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Makes Puzzlr Special
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card border border-white/40 rounded-xl p-8">
                <feature.icon className="w-10 h-10 text-violet-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="glass-card border border-white/40 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
            <p className="mb-6">
              Puzzlr was born from a simple observation: while there are amazing platforms for tracking 
              books, movies, and music, there wasn't a dedicated space for jigsaw puzzle enthusiasts 
              to share their passion and discoveries.
            </p>
            <p className="mb-6">
              As avid puzzlers ourselves, we wanted to create a platform that would help us remember 
              which puzzles we've completed, discover new ones based on our preferences, and connect 
              with others who share our love for this meditative art form.
            </p>
            <p>
              Today, Puzzlr has grown into a thriving community of puzzle enthusiasts from around the 
              world, all united by their love for the satisfying click of pieces coming together and 
              the joy of completing a beautiful image.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card border border-white/40 rounded-xl p-6">
              <Users className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We believe in the power of community and the joy of sharing puzzle experiences with others.
              </p>
            </div>
            <div className="glass-card border border-white/40 rounded-xl p-6">
              <Target className="w-10 h-10 text-violet-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality & Accuracy</h3>
              <p className="text-gray-600">
                We're committed to providing accurate puzzle information and honest, helpful reviews.
              </p>
            </div>
            <div className="glass-card border border-white/40 rounded-xl p-6">
              <Heart className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Passion for Puzzles</h3>
              <p className="text-gray-600">
                Every feature we build comes from our genuine love for jigsaw puzzles and the puzzle community.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-violet-500 to-emerald-500 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Join the Puzzlr Community
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start tracking your puzzle journey and connect with fellow enthusiasts today.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/sign-up"
              className="inline-block bg-white text-violet-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Get Started Free
            </a>
            <a
              href="/puzzles/browse"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-violet-600 transition-colors duration-200"
            >
              Explore Puzzles
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}