'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Database, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PuzzleCreationForm } from '@/components/puzzle/creation'

export default function CreatePuzzlePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdPuzzleId, setCreatedPuzzleId] = useState<string | null>(null)

  const handleSuccess = (puzzleId: string) => {
    setCreatedPuzzleId(puzzleId)
    setIsSubmitting(false)
  }

  const handleError = () => {
    setIsSubmitting(false)
  }

  if (createdPuzzleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Puzzle Added Successfully! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your puzzle has been added to our database and is now available for the community to discover and log.
          </p>

          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl"
            >
              <Link href={`/puzzles/${createdPuzzleId}/log`}>
                Log This Puzzle Myself
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl"
            >
              <Link href="/puzzles/add">
                Add Another Puzzle
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-3"
            >
              <Link href="/">
                Back to Home
              </Link>
            </Button>
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
                Back to Workflow
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