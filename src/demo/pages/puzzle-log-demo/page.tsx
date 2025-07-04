'use client'

import { useState } from 'react'
import { PuzzleLogForm } from '@/components/puzzle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUserSync } from '@/lib/auth-utils'
import { UserPuzzle, Puzzle } from '@/lib/supabase'

export default function PuzzleLogDemoPage() {
  const { user, isLoaded, syncStatus } = useUserSync()
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [currentLog, setCurrentLog] = useState<UserPuzzle | null>(null)
  const [isCreatingPuzzle, setIsCreatingPuzzle] = useState(false)

  // Create a real puzzle for the demo
  const createDemoPuzzle = async () => {
    setIsCreatingPuzzle(true)
    try {
      const response = await fetch('/api/puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Mountain Lake Reflection',
          pieceCount: 1000,
          description: 'A beautiful mountain lake with perfect reflections of the surrounding peaks'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create demo puzzle')
      }

      const puzzle = await response.json()
      setCurrentPuzzle({
        id: puzzle.id,
        title: puzzle.title,
        brand: puzzle.brand || { id: 'unknown', name: 'Demo Brand' },
        pieceCount: puzzle.piece_count || 1000,
        description: puzzle.description,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        createdAt: puzzle.created_at,
        updatedAt: puzzle.updated_at
      })
    } catch (error) {
      console.error('Error creating demo puzzle:', error)
      alert('Failed to create demo puzzle. Please try again.')
    } finally {
      setIsCreatingPuzzle(false)
    }
  }

  const handleSuccess = (savedLog: UserPuzzle) => {
    console.log('Puzzle log saved successfully:', savedLog)
    alert(`Puzzle log ${mode === 'create' ? 'created' : 'updated'} successfully!`)
    setCurrentLog(savedLog)
    
    // Switch to edit mode to show editing capability
    if (mode === 'create') {
      setMode('edit')
    }
  }

  const handleCancel = () => {
    console.log('Form cancelled')
    setMode('create')
    setCurrentLog(null)
  }

  if (!isLoaded || syncStatus !== 'synced') {
    return (
      <div className="container mx-auto p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              {syncStatus === 'syncing' ? 'Syncing your account...' : 'Please wait'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Puzzle Logging Demo</h1>
        <p className="text-gray-600">
          Test the complete puzzle logging workflow with a real puzzle.
        </p>
        
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">Signed in as: {user?.id}</Badge>
          <Badge variant="outline" className="text-green-600">User Synced ✓</Badge>
        </div>
      </div>

      {!currentPuzzle ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Step 1: Create Demo Puzzle</CardTitle>
            <CardDescription>
              First, let's create a real puzzle in the database to use for logging.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={createDemoPuzzle} 
              disabled={isCreatingPuzzle}
              className="w-full"
            >
              {isCreatingPuzzle ? 'Creating Demo Puzzle...' : 'Create Demo Puzzle'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Puzzle Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Puzzle</CardTitle>
              <CardDescription>
                This is the puzzle we'll be logging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Title:</strong> {currentPuzzle.title}</p>
                <p><strong>Pieces:</strong> {currentPuzzle.pieceCount}</p>
                <p><strong>Brand:</strong> {currentPuzzle.brand?.name || 'Unknown'}</p>
                <p><strong>ID:</strong> <code className="text-sm bg-gray-100 px-1 rounded">{currentPuzzle.id}</code></p>
              </div>
              
              <div className="mt-4 space-x-2">
                <Button 
                  variant={mode === 'create' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('create')}
                >
                  Create New Log
                </Button>
                {currentLog && (
                  <Button 
                    variant={mode === 'edit' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('edit')}
                  >
                    Edit Existing Log
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Puzzle Log Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {mode === 'create' ? 'Create Puzzle Log' : 'Edit Puzzle Log'}
              </CardTitle>
              <CardDescription>
                {mode === 'create' 
                  ? 'Log your puzzle experience with photos, ratings, and notes'
                  : 'Update your existing puzzle log'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PuzzleLogForm
                mode={mode}
                puzzle={currentPuzzle}
                existingLog={mode === 'edit' ? currentLog || undefined : undefined}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 