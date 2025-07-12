'use client'

import { useState } from 'react'
import { FollowButton } from '@/components/shared/follow-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FollowProvider } from '@/contexts/follow-context'

const testUsers = [
  {
    id: 'user_2example1',
    name: 'Puzzle Master',
    username: 'puzzlemaster',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 'user_2example2',
    name: 'Jigsaw Jenny',
    username: 'jigsawjenny',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
  },
  {
    id: 'user_2example3',
    name: 'Puzzle Pro',
    username: 'puzzlepro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
  }
]

export default function TestFollowPage() {
  const [apiResults, setApiResults] = useState<any[]>([])

  const testAPI = async (endpoint: string, method: string = 'GET', userId?: string) => {
    try {
      const response = await fetch(endpoint, { method })
      const data = await response.json()
      
      setApiResults(prev => [...prev, {
        endpoint,
        method,
        status: response.status,
        data,
        timestamp: new Date().toISOString()
      }])
      
      return data
    } catch (error) {
      setApiResults(prev => [...prev, {
        endpoint,
        method,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }])
    }
  }

  return (
    <FollowProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Follow System Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-600">
                This page tests the follow functionality with mock users. 
                Note: You need to be authenticated with Clerk for the API calls to work.
              </p>
              
              <div className="grid gap-4">
                {testUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-slate-600">@{user.username}</p>
                        <p className="text-xs text-slate-400">ID: {user.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FollowButton 
                        userId={user.id}
                        size="sm"
                        variant="outline"
                      />
                      <button
                        onClick={() => testAPI(`/api/users/${user.id}/follow-status`)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Test Status API
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {apiResults.length === 0 ? (
                <p className="text-slate-500 italic">No API calls made yet</p>
              ) : (
                apiResults.map((result, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs">{result.method} {result.endpoint}</span>
                      <span className="text-xs text-slate-500">{new Date(result.timestamp).toLocaleTimeString()}</span>
                    </div>
                    {result.status && (
                      <div className={`text-xs mb-1 ${result.status < 400 ? 'text-green-600' : 'text-red-600'}`}>
                        Status: {result.status}
                      </div>
                    )}
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(result.data || result.error, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setApiResults([])}
              className="mt-4 px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
            >
              Clear Results
            </button>
          </CardContent>
        </Card>
      </div>
      </div>
    </FollowProvider>
  )
}