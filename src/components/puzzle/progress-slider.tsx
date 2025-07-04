'use client'

import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

interface ProgressSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  className?: string
  disabled?: boolean
}

export function ProgressSlider({ 
  value, 
  onChange, 
  label = "Progress", 
  className,
  disabled = false 
}: ProgressSliderProps) {
  const handleChange = (values: number[]) => {
    onChange(values[0])
  }

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'text-gray-500'
    if (progress < 25) return 'text-red-600'
    if (progress < 50) return 'text-orange-600'
    if (progress < 75) return 'text-yellow-600'
    if (progress < 100) return 'text-blue-600'
    return 'text-green-600'
  }

  const getProgressMessage = (progress: number) => {
    if (progress === 0) return 'Not started'
    if (progress < 25) return 'Just getting started'
    if (progress < 50) return 'Making progress'
    if (progress < 75) return 'More than halfway'
    if (progress < 100) return 'Almost there!'
    return 'Complete! 🎉'
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          <span className={cn('text-2xl font-bold', getProgressColor(value))}>
            {value}%
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Slider
          value={[value]}
          onValueChange={handleChange}
          max={100}
          step={5}
          disabled={disabled}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span className={cn('font-medium', getProgressColor(value))}>
            {getProgressMessage(value)}
          </span>
          <span>100%</span>
        </div>
      </div>
      
      {/* Visual progress indicator */}
      <div className="flex space-x-1">
        {Array.from({ length: 20 }, (_, index) => {
          const segmentValue = (index + 1) * 5
          const isActive = value >= segmentValue
          
          return (
            <div
              key={index}
              className={cn(
                'h-2 flex-1 rounded-sm transition-colors duration-200',
                isActive 
                  ? 'bg-primary' 
                  : 'bg-gray-200'
              )}
            />
          )
        })}
      </div>
    </div>
  )
} 