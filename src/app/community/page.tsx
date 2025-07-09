'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, MessageSquare, Heart, Star, Clock, Trophy, User, ChevronRight } from 'lucide-react'

export default function CommunityPage() {
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
              <div className="text-2xl font-bold text-slate-800">2,847</div>
              <div className="text-sm text-slate-600">Active Members</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">12,394</div>
              <div className="text-sm text-slate-600">Discussions</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">45,672</div>
              <div className="text-sm text-slate-600">Reviews</div>
            </CardContent>
          </Card>
          <Card className="glass-card border border-white/40">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-rose-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">1,283</div>
              <div className="text-sm text-slate-600">Challenges</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Discussions */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Recent Discussions</h2>
              <Button variant="outline" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Best 1000-piece puzzles for beginners?",
                  author: "PuzzleMaster92",
                  replies: 23,
                  likes: 45,
                  time: "2 hours ago",
                  tags: ["beginner", "1000-piece"]
                },
                {
                  title: "Organizing puzzle pieces - what's your strategy?",
                  author: "SortedSolver",
                  replies: 67,
                  likes: 128,
                  time: "4 hours ago",
                  tags: ["tips", "organization"]
                },
                {
                  title: "Ravensburger vs Buffalo Games - Quality comparison",
                  author: "BrandExplorer",
                  replies: 89,
                  likes: 203,
                  time: "6 hours ago",
                  tags: ["brands", "comparison"]
                },
                {
                  title: "Completed my first 2000-piece puzzle! 🎉",
                  author: "FirstTimer",
                  replies: 34,
                  likes: 156,
                  time: "8 hours ago",
                  tags: ["achievement", "2000-piece"]
                }
              ].map((discussion, index) => (
                <Card key={index} className="glass-card border border-white/40 hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">
                        {discussion.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {discussion.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {discussion.replies} replies
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {discussion.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {discussion.time}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {discussion.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
