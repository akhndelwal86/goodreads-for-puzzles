'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

interface PuzzleFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  brandFilter: string
  onBrandChange: (brand: string) => void
  sortBy: 'recent' | 'title' | 'brand' | 'pieces'
  onSortChange: (sort: 'recent' | 'title' | 'brand' | 'pieces') => void
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
    <Card className="bg-white/50 backdrop-blur-sm border-white/20">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your puzzles..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="w-full sm:w-48">
            <Select value={brandFilter} onValueChange={onBrandChange}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {availableBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="w-full sm:w-40">
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as 'recent' | 'title' | 'brand' | 'pieces')}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="pieces">Pieces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 