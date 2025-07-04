'use client'

import { useState } from 'react'
import { PuzzleCreationForm } from '@/components/puzzle/creation'
import { PuzzleLogForm } from '@/components/puzzle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUserSync } from '@/lib/auth-utils'
import { ArrowRight, ArrowLeft } from 'lucide-react'

type Stage = 'select-flow' | 'create-puzzle' | 'log-puzzle'

export default function PuzzleCreationDemoPage() {
  const { user, isLoaded, syncStatus } = useUserSync()
  const [currentStage, setCurrentStage] = useState<Stage>('select-flow')
  const [createdPuzzle, setCreatedPuzzle] = useState<any>(null)

  const handlePuzzleCreated = (puzzle: any) => {
    setCreatedPuzzle(puzzle)
    setCurrentStage('log-puzzle')
  }

  const handleLogSuccess = (log: any) => {
    console.log('Puzzle log created:', log)
    // Could redirect to my-puzzles or show success
    setCurrentStage('select-flow')
    setCreatedPuzzle(null)
  }

  const goBack = () => {
    if (currentStage === 'log-puzzle') {
      setCurrentStage('create-puzzle')
    } else if (currentStage === 'create-puzzle') {
      setCurrentStage('select-flow')
    }
  }

  const reset = () => {
    setCurrentStage('select-flow')
    setCreatedPuzzle(null)
  }

  if (!isLoaded || syncStatus !== 'synced') {
    const getLoadingMessage = () => {
      if (!isLoaded) return 'Loading authentication...'
      if (syncStatus === 'syncing') return 'Syncing your account...'
      if (syncStatus === 'error') return 'Error syncing account. Please refresh.'
      return 'Setting up your account...'
    }

    return (
      <div className="container mx-auto p-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Two-Stage Puzzle System Demo</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{getLoadingMessage()}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Two-Stage Puzzle System</h1>
        <p className="text-muted-foreground mb-4">
          Experience the complete puzzle logging workflow
        </p>
        
        {/* Stage Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`flex items-center gap-2 ${
            currentStage === 'select-flow' ? 'text-primary' : 'text-muted-foreground'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStage === 'select-flow' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>1</div>
            <span className="text-sm font-medium">Choose Flow</span>
          </div>
          
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          
          <div className={`flex items-center gap-2 ${
            currentStage === 'create-puzzle' ? 'text-primary' : 'text-muted-foreground'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStage === 'create-puzzle' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>2</div>
            <span className="text-sm font-medium">Add Puzzle</span>
          </div>
          
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          
          <div className={`flex items-center gap-2 ${
            currentStage === 'log-puzzle' ? 'text-primary' : 'text-muted-foreground'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStage === 'log-puzzle' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>3</div>
            <span className="text-sm font-medium">Log Progress</span>
          </div>
        </div>
      </div>

      {/* Flow Selection */}
      {currentStage === 'select-flow' && (
        <div className="space-y-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>How do you want to start?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => setCurrentStage('create-puzzle')}
                  variant="outline"
                  className="h-24 flex-col gap-2"
                >
                  <div className="text-lg font-semibold">🧩 New Puzzle</div>
                  <div className="text-sm text-muted-foreground">
                    Add a puzzle that's not in our database yet
                  </div>
                </Button>
                
                <Button
                  onClick={() => {
                    // In real app, this would go to puzzle search
                    alert('In the real app, this would show puzzle search to find existing puzzles')
                  }}
                  variant="outline"
                  className="h-24 flex-col gap-2"
                >
                  <div className="text-lg font-semibold">🔍 Find Existing</div>
                  <div className="text-sm text-muted-foreground">
                    Search for a puzzle already in our database
                  </div>
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                This demo focuses on the "New Puzzle" flow showing both stages
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stage 1: Puzzle Creation */}
      {currentStage === 'create-puzzle' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button onClick={goBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary">Stage 1: Platform Contribution</Badge>
          </div>
          
          <PuzzleCreationForm
            onSuccess={handlePuzzleCreated}
            onCancel={reset}
          />
        </div>
      )}

      {/* Stage 2: Puzzle Logging */}
      {currentStage === 'log-puzzle' && createdPuzzle && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button onClick={goBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary">Stage 2: Personal Collection</Badge>
          </div>
          
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  ✅
                </div>
                <div>
                  <p className="font-medium">Puzzle Added Successfully!</p>
                  <p className="text-sm text-muted-foreground">
                    "{createdPuzzle.title}" is now available for everyone to discover
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <PuzzleLogForm
            mode="create"
            puzzle={createdPuzzle}
            onSuccess={handleLogSuccess}
            onCancel={reset}
          />
        </div>
      )}
    </div>
  )
} 