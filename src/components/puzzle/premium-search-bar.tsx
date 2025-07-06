"use client"

import { useState } from "react"
import { Search, Sparkles, Mic, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PremiumSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showAISearch?: boolean
  onAISearchToggle?: () => void
  className?: string
}

export function PremiumSearchBar({
  value,
  onChange,
  placeholder = "Search puzzles by title, brand, theme...",
  showAISearch = false,
  onAISearchToggle,
  className
}: PremiumSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isAIMode, setIsAIMode] = useState(false)

  const handleClear = () => {
    onChange("")
  }

  const toggleAIMode = () => {
    setIsAIMode(!isAIMode)
    onAISearchToggle?.()
  }

  const aiSuggestions = [
    "puzzles with beautiful landscapes",
    "challenging 2000+ piece puzzles",
    "animal puzzles perfect for kids",
    "vintage art collections",
    "space and astronomy themes"
  ]

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Main Search Container */}
      <div className={cn(
        "relative glass-card border-white/30 rounded-2xl transition-all duration-300",
        isFocused && "border-violet-300/50 shadow-glass-lg",
        isAIMode && "bg-gradient-to-r from-violet-50/80 to-emerald-50/80"
      )}>
        <div className="flex items-center gap-3 p-4">
          {/* Search Icon */}
          <div className={cn(
            "p-2 rounded-lg transition-colors",
            isAIMode 
              ? "bg-gradient-to-r from-violet-500 to-emerald-500" 
              : "bg-slate-100",
            isFocused && !isAIMode && "bg-violet-100"
          )}>
            {isAIMode ? (
              <Sparkles className="h-4 w-4 text-white" />
            ) : (
              <Search className={cn(
                "h-4 w-4",
                isFocused ? "text-violet-600" : "text-slate-500"
              )} />
            )}
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isAIMode ? "Ask me anything about puzzles..." : placeholder}
              className={cn(
                "border-0 bg-transparent text-base placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto",
                isAIMode && "placeholder:text-violet-400"
              )}
            />
            
            {/* AI Mode Indicator */}
            {isAIMode && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-violet-500 to-emerald-500 text-white text-xs">
                AI
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Voice Search */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-violet-100"
            >
              <Mic className="h-4 w-4 text-slate-500" />
            </Button>

            {/* Clear Button */}
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 hover:bg-red-100 text-slate-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* AI Toggle */}
            {showAISearch && (
              <Button
                variant={isAIMode ? "default" : "outline"}
                size="sm"
                onClick={toggleAIMode}
                className={cn(
                  "h-8 px-3 text-xs font-medium transition-all",
                  isAIMode 
                    ? "bg-gradient-to-r from-violet-500 to-emerald-500 text-white shadow-glass" 
                    : "border-violet-200 text-violet-700 hover:bg-violet-50"
                )}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Button>
            )}
          </div>
        </div>

        {/* AI Suggestions */}
        {isAIMode && isFocused && !value && (
          <div className="border-t border-violet-200/50 p-4 bg-gradient-to-r from-violet-50/50 to-emerald-50/50">
            <p className="text-xs font-medium text-slate-600 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onChange(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/80 border border-violet-200/50 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-colors"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Results Meta */}
      {value && (
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Searching for: <span className="font-medium text-slate-800">"{value}"</span>
            </span>
            {isAIMode && (
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 text-xs">
                AI Enhanced
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  )
} 