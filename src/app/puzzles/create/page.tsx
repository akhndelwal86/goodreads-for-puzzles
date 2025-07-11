'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Database, Users, BookOpen, Plus, Eye, Search, Share2, LogIn } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PuzzleCreationForm } from '@/components/puzzle/creation'

export default function CreatePuzzlePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdPuzzleId, setCreatedPuzzleId] = useState<string | null>(null)

  const handleSuccess = (puzzle: any) => {
    setCreatedPuzzleId(puzzle.id)
    setIsSubmitting(false)
  }

  const handleError = () => {
    setIsSubmitting(false)
  }

  const handleShare = async () => {
    if (createdPuzzleId) {
      const url = `${window.location.origin}/puzzles/${createdPuzzleId}`
      try {
        await navigator.clipboard.writeText(url)
        // Could add a toast notification here
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  if (createdPuzzleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Puzzle Added Successfully! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your puzzle has been added to our community database! Ready to start tracking your progress with this puzzle?
          </p>

          <div className="space-y-4">
            {/* Primary CTA - Log This Puzzle */}
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Link href={`/puzzles/${createdPuzzleId}/log`}>
                <LogIn className="w-5 h-5 mr-3" />
                Log This Puzzle to My Collection
              </Link>
            </Button>
            
            {/* Secondary CTA */}
            <Button 
              asChild 
              variant="outline"
              className="w-full border-2 border-violet-200 text-violet-700 hover:bg-violet-50 font-medium py-3 rounded-xl"
            >
              <Link href="/puzzles/add">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Puzzle
              </Link>
            </Button>
            
            {/* Tertiary Options */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                onClick={handleShare}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Puzzle
              </Button>
              
              <Button 
                asChild 
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <Link href={`/puzzles/${createdPuzzleId}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Thanks for contributing to our puzzle community! 🧩
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <Link href="/puzzles/add" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Add Puzzle
              </Link>
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
              <Database className="w-4 h-4" />
              Platform Contribution
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium mb-4">
            <Users className="w-4 h-4" />
            Contributing to Community Database
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Add New Puzzle
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help fellow puzzlers discover new favorites by adding puzzle details and official product photos to our community database.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <PuzzleCreationForm
              onSubmitStart={() => setIsSubmitting(true)}
              onSuccess={handleSuccess}
              onError={handleError}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
          <p className="text-gray-600">
            <strong>After adding:</strong> Your puzzle will be available for the community to discover. 
            You can then log your own progress or let others find and log it too!
          </p>
        </div>
      </div>
    </div>
  )
} 