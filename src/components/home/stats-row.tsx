import { TrendingUp, Users, Star } from 'lucide-react'

export function StatsRow() {
  const stats = [
    { icon: TrendingUp, label: "Puzzles Tracked", value: "12,000+", gradient: "from-violet-500 to-purple-600" },
    { icon: Users, label: "Active Puzzlers", value: "5,000+", gradient: "from-emerald-500 to-teal-600" },
    { icon: Star, label: "Reviews Shared", value: "25,000+", gradient: "from-amber-500 to-orange-600" }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <stat.icon className={`w-8 h-8 mx-auto mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
          <div className={`text-2xl font-bold mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
            {stat.value}
          </div>
          <div className="text-gray-600 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  )
} 