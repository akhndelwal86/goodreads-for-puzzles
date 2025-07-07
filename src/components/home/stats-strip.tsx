'use client'

import { TrendingUp, Users, Star, PuzzleIcon, Calendar, Target } from 'lucide-react'
import { useEffect, useState } from 'react'

// Animation hook for counting up numbers
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const startCount = 0
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration])

  return count
}

export function StatsStrip() {
  const puzzleCount = useCountUp(1247)
  const userCount = useCountUp(5834) 
  const reviewCount = useCountUp(12651)
  const solvedToday = useCountUp(89)
  const activeUsers = useCountUp(234)

  const stats = [
    { 
      icon: PuzzleIcon, 
      label: "Total Puzzles", 
      value: puzzleCount.toLocaleString(),
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50"
    },
    { 
      icon: Users, 
      label: "Community Members", 
      value: userCount.toLocaleString(),
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    { 
      icon: Star, 
      label: "Reviews Shared", 
      value: reviewCount.toLocaleString(),
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50"
    },
    { 
      icon: Target, 
      label: "Solved Today", 
      value: solvedToday.toString(),
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-50 to-pink-50"
    },
    { 
      icon: TrendingUp, 
      label: "Active Now", 
      value: activeUsers.toString(),
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    }
  ]

  return (
    <div className="py-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className={`glass-card hover-lift bg-gradient-to-br ${stat.bgGradient} border border-white/30 rounded-2xl p-3 lg:p-4 text-center group transition-all duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-r ${stat.gradient} mb-2 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div className={`text-lg lg:text-xl font-medium mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-slate-600 text-xs lg:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
