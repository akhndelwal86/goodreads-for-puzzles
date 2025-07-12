'use client'

import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600">
            The puzzle piece you're looking for seems to be missing from our collection.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/puzzles/browse">
              <Search className="w-4 h-4 mr-2" />
              Browse Puzzles
            </Link>
          </Button>
          <Button 
            onClick={() => window.history.back()} 
            variant="ghost" 
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}