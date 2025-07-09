'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

type SortOption = 'recent' | 'title' | 'brand' | 'pieces'

interface PuzzleFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  brandFilter: string
  onBrandChange: (brand: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  availableBrands: string[]
}

export function PuzzleFilters({
  searchTerm,
  onSearchChange,
  brandFilter,
  onBrandChange,
  sortBy,
  onSortChange,
  availableBrands
}: PuzzleFiltersProps) {
  return (
    <div className="glass-card border-white/30 rounded-xl p-3">
      <div className="space-y-3">
        <h3 className="text-base font-medium text-slate-700">Search & Filter</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Premium Search */}
          <div className="flex-1">
            <div className="relative glass-card border-white/30 rounded-lg transition-all duration-300 focus-within:border-violet-300 focus-within:shadow-lg">
              <div className="p-3 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600">
                  <Search className="h-4 w-4 text-white" />
                </div>
              <Input
                placeholder="Search your puzzles..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                  className="border-0 bg-transparent text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              />
              </div>
            </div>
          </div>

          {/* Premium Brand Filter */}
          <div className="w-full sm:w-48">
            <Select value={brandFilter} onValueChange={onBrandChange}>
              <SelectTrigger className="glass-card border-white/30 bg-transparent text-slate-700 h-10 rounded-lg">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/40">
                <SelectItem value="all">All Brands</SelectItem>
                {availableBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Premium Sort */}
          <div className="w-full sm:w-40">
            <Select value={sortBy} onValueChange={(value) => {
              if (['recent', 'title', 'brand', 'pieces'].includes(value)) {
                onSortChange(value as SortOption)
              }
            }}>
              <SelectTrigger className="glass-card border-white/30 bg-transparent text-slate-700 h-10 rounded-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/40">
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="pieces">Pieces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
} 