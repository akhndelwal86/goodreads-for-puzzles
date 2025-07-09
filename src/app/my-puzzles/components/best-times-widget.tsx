'use client'

import type { UserPuzzle } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BestTimesWidgetProps {
  puzzles: UserPuzzle[]
}

export function BestTimesWidget({ puzzles }: BestTimesWidgetProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours === 0 && minutes === 0) return '0m'
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  // Get best times by piece count
  const getBestTimes = () => {
    const pieceCounts = [250, 500, 750, 1000, 1500, 2000]
    const bestTimes: Record<number, number | null> = {}
    
    pieceCounts.forEach(count => {
      const relevantPuzzles = puzzles.filter(p => 
        p.status === 'completed' && 
        p.timeSpent && 
        p.timeSpent > 0 &&
        Math.abs(p.pieces - count) <= 50 // Allow some tolerance
      )
      
      if (relevantPuzzles.length > 0) {
        bestTimes[count] = Math.min(...relevantPuzzles.map(p => p.timeSpent!))
      } else {
        bestTimes[count] = null
      }
    })
    
    return bestTimes
  }

  const bestTimes = getBestTimes()
  const pieceCounts = [250, 500, 750, 1000, 1500, 2000]

  return (
    <Card className="glass-card border-white/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-800">Best Times</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {pieceCounts.map((count, index) => (
          <div key={count} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50/50 transition-all duration-200">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-[8px] font-medium">{count}</span>
              </div>
              <span className="text-xs font-medium text-slate-700">{count}pc</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">
                {bestTimes[count] ? formatTime(bestTimes[count]!) : '-'}
              </div>
              {bestTimes[count] && (
                <div className="text-xs text-slate-500">best</div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}