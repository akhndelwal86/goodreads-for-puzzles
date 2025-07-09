'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, MessageSquare, Heart, Star, Clock, Trophy, User, ChevronRight } from 'lucide-react'
import CommunityActivityFeed from '@/components/home/ActivityFeed'

interface CommunityStats {
  activeMembers: number
  discussions: number
  reviews: number
  challenges: number
}

export default function CommunityPage() {
  const [stats, setStats] = useState<CommunityStats>({
    activeMembers: 0,
    discussions: 0,
    reviews: 0,
    challenges: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Fetch community stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/community/stats')
        const data = await response.json()
        
        if (data.stats) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching community stats:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🧩 Puzzle Community
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Connect with fellow puzzle enthusiasts, share your experiences, and discover new challenges together.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-violet-600 mx-auto mb-2" />
              {isLoadingStats ? (
                <div className="h-8 bg-slate-200 rounded animate-pulse mb-1" />
              ) : (
                <div className="text-2xl font-bold text-slate-800">{stats.activeMembers.toLocaleString()}</div>
              )}
              <div className="text-sm text-slate-600">Active Members</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              {isLoadingStats ? (
                <div className="h-8 bg-slate-200 rounded animate-pulse mb-1" />
              ) : (
                <div className="text-2xl font-bold text-slate-800">{stats.discussions.toLocaleString()}</div>
              )}
              <div className="text-sm text-slate-600">Discussions</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              {isLoadingStats ? (
                <div className="h-8 bg-slate-200 rounded animate-pulse mb-1" />
              ) : (
                <div className="text-2xl font-bold text-slate-800">{stats.reviews.toLocaleString()}</div>
              )}
              <div className="text-sm text-slate-600">Reviews</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-rose-600 mx-auto mb-2" />
              {isLoadingStats ? (
                <div className="h-8 bg-slate-200 rounded animate-pulse mb-1" />
              ) : (
                <div className="text-2xl font-bold text-slate-800">{stats.challenges.toLocaleString()}</div>
              )}
              <div className="text-sm text-slate-600">Challenges</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Community Activity Feed */}
          <div className="lg:col-span-2">
            <CommunityActivityFeed limit={8} showHeader={true} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <Card className="glass-card border border-white/40">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {[
                    { name: "PuzzleGuru", points: 2847, avatar: "🏆" },
                    { name: "JigsawJen", points: 1923, avatar: "⭐" },
                    { name: "PieceByPiece", points: 1456, avatar: "🧩" },
                    { name: "SolveItAll", points: 1203, avatar: "🎯" }
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm">
                          {contributor.avatar}
                        </div>
                        <span className="font-medium text-slate-700">{contributor.name}</span>
                      </div>
                      <span className="text-sm text-slate-500">{contributor.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card className="glass-card border border-white/40">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "landscapes", "1000-piece", "ravensburger", "tips", 
                    "organization", "beginner", "vintage", "animals",
                    "art", "nature", "difficult", "family"
                  ].map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="glass-card border border-white/40">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Community Guidelines</h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Be respectful and helpful</li>
                  <li>• Share your puzzle experiences</li>
                  <li>• Ask questions freely</li>
                  <li>• Avoid spoilers in puzzle discussions</li>
                  <li>• Keep discussions puzzle-related</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
