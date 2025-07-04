import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Upload, ArrowRight, Sparkles, Users, Database } from 'lucide-react'
import Link from 'next/link'

export default function PuzzleWorkflowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-2 mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Puzzle Workflow
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            What would you like to do?
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your path: contribute a new puzzle to our community database or log your progress on an existing puzzle
          </p>
        </div>

        {/* Two Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Add New Puzzle */}
          <Card className="group relative overflow-hidden border-2 border-blue-200/50 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-purple-50/50"></div>
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <CardHeader className="relative">
              <CardTitle className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                Add New Puzzle
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Contribute a puzzle that's not yet in our database. Help other puzzlers discover new favorites!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Upload official product photo
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Add puzzle details (brand, pieces, etc.)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Optional: Log your first progress entry
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mb-6">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">Contributing to Platform</span>
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200"
              >
                <Link href="/puzzles/create" className="flex items-center justify-center gap-2">
                  Start Contributing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Log Existing Puzzle */}
          <Card className="group relative overflow-hidden border-2 border-emerald-200/50 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-xl hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/50 to-teal-50/50"></div>
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            
            <CardHeader className="relative">
              <CardTitle className="text-2xl font-bold text-emerald-700 mb-2 flex items-center gap-2">
                <Search className="w-6 h-6" />
                Log Existing Puzzle
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Find a puzzle from our database and log your personal progress, photos, and experience.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Search our puzzle database
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Upload your progress photos
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Rate difficulty and quality
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg mb-6">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-700 font-medium">Personal Collection</span>
              </div>
              
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-6 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200"
              >
                <Link href="/puzzles/browse" className="flex items-center justify-center gap-2">
                  Browse Puzzles
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <div className="text-center mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
          <p className="text-gray-600">
            <strong>New to puzzles?</strong> Start by browsing our database to discover popular puzzles and see what the community recommends.
          </p>
        </div>
      </div>
    </div>
  )
} 