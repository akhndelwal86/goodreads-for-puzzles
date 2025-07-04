'use client'

import { useAuth, SignInButton, SignOutButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUserSync } from '@/lib/auth-utils'

export default function TestLoggingPage() {
  const { isSignedIn, userId } = useAuth()
  const { user, isLoaded, syncStatus } = useUserSync() // Now includes syncStatus
  const [results, setResults] = useState<Array<{
    action: string
    timestamp: string
    status: 'success' | 'error'
    data: any
  }>>([])

  const addResult = (action: string, status: 'success' | 'error', data: any) => {
    const result = {
      action,
      timestamp: new Date().toLocaleTimeString(),
      status,
      data
    }
    setResults(prev => [result, ...prev])
  }

  const testCreateLog = async () => {
    try {
      // First, let's create a puzzle to use for the log
      const puzzleResponse = await fetch('/api/puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Puzzle for Log',
          pieceCount: 500,
          description: 'A test puzzle created specifically for logging test'
        })
      })
      
      const puzzleData = await puzzleResponse.json()
      
      if (!puzzleResponse.ok) {
        addResult('CREATE LOG (Step 1: Create Puzzle)', 'error', puzzleData)
        return
      }

      // Now create a log using the puzzle ID
      const response = await fetch('/api/puzzle-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: puzzleData.id,
          status: 'in-progress',
          progressPercentage: 25,
          notes: 'Test log from test page using real puzzle ID'
        })
      })
      
      const data = await response.json()
      addResult('CREATE LOG (Full Flow)', response.ok ? 'success' : 'error', {
        puzzle: puzzleData,
        log: data
      })
    } catch (error) {
      addResult('CREATE LOG', 'error', error)
    }
  }

  const testCreatePuzzle = async () => {
    try {
      const response = await fetch('/api/puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Puzzle from API',
          pieceCount: 1000,
          description: 'A test puzzle created via API'
        })
      })
      
      const data = await response.json()
      addResult('CREATE PUZZLE', response.ok ? 'success' : 'error', data)
    } catch (error) {
      addResult('CREATE PUZZLE', 'error', error)
    }
  }

  const testGetLogs = async () => {
    try {
      const response = await fetch('/api/puzzle-logs')
      const data = await response.json()
      addResult('GET LOGS', response.ok ? 'success' : 'error', data)
    } catch (error) {
      addResult('GET LOGS', 'error', error)
    }
  }

  const testHealthCheck = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      addResult('HEALTH CHECK', response.ok ? 'success' : 'error', data)
    } catch (error) {
      addResult('HEALTH CHECK', 'error', error)
    }
  }

  const testUserSync = async () => {
    try {
      // Test if we can find the user in Supabase
      const response = await fetch('/api/test-db')
      const data = await response.json()
      addResult('USER SYNC TEST', response.ok ? 'success' : 'error', {
        dbStatus: data,
        clerkUserId: userId,
        syncStatus: syncStatus
      })
    } catch (error) {
      addResult('USER SYNC TEST', 'error', error)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to test the puzzle logging API endpoints.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInButton mode="modal">
              <Button className="w-full">Sign In to Test API</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isLoaded || syncStatus !== 'synced') {
    const getLoadingMessage = () => {
      if (!isSignedIn) return 'Please sign in to continue'
      if (!isLoaded) return 'Loading authentication...'
      if (syncStatus === 'syncing') return 'Syncing your account to database...'
      if (syncStatus === 'error') return 'Error syncing account. Check console for details.'
      return 'Setting up your account...'
    }

    const getLoadingDescription = () => {
      if (syncStatus === 'error') {
        return 'There was an issue creating your account in the database. Please check browser console and try refreshing.'
      }
      return 'This will only take a moment.'
    }

    return (
      <div className="container mx-auto p-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{getLoadingMessage()}</CardTitle>
            <CardDescription>
              {getLoadingDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              {syncStatus === 'error' ? (
                <div className="text-center">
                  <div className="text-red-500 text-2xl mb-2">⚠️</div>
                  <p className="text-sm text-muted-foreground">
                    Check browser console for error details
                  </p>
                </div>
              ) : (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Test puzzle logging API endpoints with authentication
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">
              Signed in as: {userId}
            </Badge>
            <Badge variant="outline" className="text-green-600">
              User Synced ✓
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              Sync Status: {syncStatus}
            </Badge>
          </div>
        </div>
        <SignOutButton>
          <Button variant="outline">Sign Out</Button>
        </SignOutButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>API Test Controls</CardTitle>
            <CardDescription>
              Click buttons to test different API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testHealthCheck}
              variant="outline" 
              className="w-full"
            >
              Health Check
            </Button>

            <Button 
              onClick={testUserSync}
              variant="outline" 
              className="w-full"
            >
              Test User Sync
            </Button>
            
            <Button 
              onClick={testCreatePuzzle}
              className="w-full"
            >
              Create Puzzle
            </Button>
            
            <Button 
              onClick={testCreateLog}
              className="w-full"
            >
              Create Log
            </Button>
            
            <Button 
              onClick={testGetLogs}
              variant="secondary"
              className="w-full"
            >
              Get My Logs
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              API responses and data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No tests run yet. Click a button to start testing.
                </p>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.timestamp}
                      </span>
                    </div>
                    <Badge 
                      variant={result.status === 'success' ? 'secondary' : 'destructive'}
                      className="mb-2"
                    >
                      {result.status === 'success' ? 'Success' : 'Error'}
                    </Badge>
                    <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Documentation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Available Endpoints</CardTitle>
          <CardDescription>
            Documentation for the puzzle logging API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Puzzle Logs</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <code>POST /api/puzzle-logs</code> - Create log</li>
                <li>• <code>GET /api/puzzle-logs</code> - Get user logs</li>
                <li>• <code>PATCH /api/puzzle-logs/[id]</code> - Update log</li>
                <li>• <code>DELETE /api/puzzle-logs/[id]</code> - Delete log</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Puzzles</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <code>POST /api/puzzles</code> - Create puzzle</li>
                <li>• <code>GET /api/puzzles</code> - Search puzzles</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 