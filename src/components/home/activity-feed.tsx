'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, MessageCircle, Star, CheckCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'

interface ActivityItem {
  id: string
  type: 'review' | 'completion' | 'follow' | 'like'
  user: {
    name: string
    username: string
    avatar: string
  }
  puzzle?: {
    id: string
    title: string
    brand: string
    image: string
    pieceCount: number
    difficulty: string
    rating: number
  }
  content?: string
  timestamp: string
  stats?: {
    hours: number
    likes: number
    comments: number
  }
}

export function ActivityFeed() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'review',
      user: {
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face'
      },
      puzzle: {
        id: '1',
        title: 'Sunset Mountains',
        brand: 'Ravensburger',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
        pieceCount: 1000,
        difficulty: 'Medium',
        rating: 4.8
      },
      content: 'Absolutely stunning puzzle! The colors are vibrant and the pieces fit perfectly. Took me about 9 hours over a weekend.',
      timestamp: 'over 1 year ago',
      stats: {
        hours: 9,
        likes: 12,
        comments: 3
      }
    },
    {
      id: '2',
      type: 'completion',
      user: {
        name: 'Mike Rodriguez',
        username: 'mikerod',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
      },
      puzzle: {
        id: '2',
        title: 'Ocean Waves',
        brand: 'Buffalo Games',
        image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=80&h=80&fit=crop',
        pieceCount: 750,
        difficulty: 'Easy',
        rating: 4.6
      },
      timestamp: 'over 1 year ago'
    },
    {
      id: '3',
      type: 'follow',
      user: {
        name: 'Alex Chen',
        username: 'alexchen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      },
      content: 'started following Sarah Johnson',
      timestamp: 'over 1 year ago'
    }
  ]

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <Star className="w-3 h-3 text-amber-500" />
      case 'completion':
        return <CheckCircle className="w-3 h-3 text-emerald-500" />
      case 'follow':
        return <UserPlus className="w-3 h-3 text-blue-500" />
      default:
        return <Heart className="w-3 h-3 text-rose-500" />
    }
  }

  const renderActivity = (activity: ActivityItem) => {
    if (activity.type === 'review' && activity.puzzle) {
      return (
        <div key={activity.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
          <div className="flex items-start space-x-3">
            <Avatar className="w-7 h-7 border border-white shadow-sm">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-medium text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                {renderActivityIcon(activity.type)}
                <span className="font-medium text-sm text-slate-900">{activity.user.name}</span>
                <span className="text-slate-500 text-xs">reviewed</span>
                <span className="font-medium text-sm text-violet-600">"{activity.puzzle.title}"</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{activity.timestamp}</p>
              
              {/* Puzzle Info */}
              <div className="bg-slate-50/50 rounded-lg p-2.5 mb-2">
                <div className="flex items-center space-x-2.5">
                  <img 
                    src={activity.puzzle.image} 
                    alt={activity.puzzle.title}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-slate-900">{activity.puzzle.title}</h4>
                    <p className="text-xs text-slate-600">{activity.puzzle.brand} • {activity.puzzle.pieceCount} pieces</p>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        activity.puzzle.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                        activity.puzzle.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {activity.puzzle.difficulty}
                      </span>
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                      <span className="text-xs text-slate-600">{activity.puzzle.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-2">
                <div className="flex items-center space-x-1.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                  ))}
                  <span className="text-xs text-slate-700">Solved in {activity.stats?.hours} hours</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{activity.content}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-slate-600 hover:text-rose-600 text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-slate-600 hover:text-blue-600 text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activity.type === 'completion' && activity.puzzle) {
      return (
        <div key={activity.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
          <div className="flex items-start space-x-3">
            <Avatar className="w-7 h-7 border border-white shadow-sm">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-medium text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-1.5 mb-1">
                {renderActivityIcon(activity.type)}
                <span className="font-medium text-sm text-slate-900">{activity.user.name}</span>
                <span className="text-slate-500 text-xs">completed</span>
                <span className="font-medium text-sm text-emerald-600">"{activity.puzzle.title}"</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{activity.timestamp}</p>
              
              <div className="bg-slate-50/50 rounded-lg p-2.5 mb-2">
                <div className="flex items-center space-x-2.5">
                  <img 
                    src={activity.puzzle.image} 
                    alt={activity.puzzle.title}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-slate-900">{activity.puzzle.title}</h4>
                    <p className="text-xs text-slate-600">{activity.puzzle.brand} • {activity.puzzle.pieceCount} pieces</p>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium mt-0.5 ${
                      activity.puzzle.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {activity.puzzle.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-slate-600 hover:text-rose-600 text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-slate-600 hover:text-blue-600 text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activity.type === 'follow') {
      return (
        <div key={activity.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
          <div className="flex items-start space-x-3">
            <Avatar className="w-7 h-7 border border-white shadow-sm">
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium text-xs">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-1.5 mb-1">
                {renderActivityIcon(activity.type)}
                <span className="font-medium text-sm text-slate-900">{activity.user.name}</span>
                <span className="text-slate-500 text-xs">{activity.content}</span>
              </div>
              <p className="text-slate-500 text-xs mb-2">{activity.timestamp}</p>

              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-slate-600 hover:text-rose-600 text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-slate-600 hover:text-blue-600 text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Card className="glass-card border-white/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-slate-800">Activity Feed</CardTitle>
          <Link href="/activity" className="text-xs font-medium text-violet-600 hover:text-violet-700">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map(renderActivity)}
      </CardContent>
    </Card>
  )
}
