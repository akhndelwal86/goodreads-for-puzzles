"use client"

import { useState } from "react"
import { SlidersHorizontal, ChevronDown, ChevronUp, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FilterState {
  search: string
  pieceMin: number
  pieceMax: number
  ratingMin: number
  brands: string[]
  status: string
  sortBy: 'recent' | 'popular' | 'rating'
  sortOrder: 'asc' | 'desc'
  // New premium filters
  difficulties: string[]
  themes: string[]
  categories: string[]
  priceRange: [number, number]
  minRating: number
  yearRange: [number, number]
}

interface AdvancedFilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  availableBrands?: Array<{id: string, name: string, count: number}>
}

export function AdvancedFilterPanel({ filters, onFiltersChange, onClearFilters, availableBrands = [] }: AdvancedFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    difficulty: true,
    pieces: true,
    brand: true,
    rating: true,
    status: false,
    theme: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }))
  }

  // Premium filter options
  const difficulties = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" }, 
    { label: "Hard", value: "hard" },
    { label: "Expert", value: "expert" }
  ]

  const pieceRanges = [
    { label: "Under 500", value: "0-499" },
    { label: "500-999", value: "500-999" },
    { label: "1000-1499", value: "1000-1499" },
    { label: "1500-1999", value: "1500-1999" },
    { label: "2000+", value: "2000+" },
  ]

  const statusOptions = [
    { label: "Want to Do", value: "wishlist" },
    { label: "In Library", value: "library" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Abandoned", value: "abandoned" },
    { label: "Not Added", value: "not-added" }
  ]

  const categories = [
    { id: "nature", name: "Nature" },
    { id: "art", name: "Art" },
    { id: "animals", name: "Animals" },
    { id: "architecture", name: "Architecture" },
    { id: "fantasy", name: "Fantasy" },
    { id: "vintage", name: "Vintage" },
    { id: "cities", name: "Cities" },
    { id: "food", name: "Food" },
  ]

  const handleArrayFilterChange = (filterType: keyof FilterState, value: string, checked: boolean) => {
    const currentArray = (filters[filterType] as string[]) || []
    const newArray = checked 
      ? [...currentArray, value] 
      : currentArray.filter((item: string) => item !== value)

    onFiltersChange({ ...filters, [filterType]: newArray })
  }

  const handleStatusFilterChange = (statusValue: string, checked: boolean) => {
    // Convert status to array for multiple selection
    const currentStatuses = filters.status ? filters.status.split(',') : []
    const newStatuses = checked
      ? [...currentStatuses, statusValue]
      : currentStatuses.filter(s => s !== statusValue)
    
    onFiltersChange({ ...filters, status: newStatuses.join(',') })
  }

  const getActiveFilterCount = () => {
    return (
      (filters.difficulties?.length || 0) +
      (filters.categories?.length || 0) +
      (filters.brands?.length || 0) +
      (filters.pieceMin !== 0 || filters.pieceMax !== 5000 ? 1 : 0) +
      (filters.ratingMin > 0 ? 1 : 0) +
      (filters.status ? 1 : 0)
    )
  }

  const FilterSection = ({ title, isExpanded, onToggle, children }: any) => {
    return (
      <div className="border rounded-lg overflow-hidden">
        <button 
          onClick={onToggle}
          className="flex items-center justify-between w-full p-3 hover:bg-violet-50/50 rounded-lg transition-colors group"
        >
          <span className="font-medium text-slate-700 group-hover:text-violet-700">{title}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-500 group-hover:text-violet-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500 group-hover:text-violet-600" />
          )}
        </button>
        {isExpanded && (
          <div className="pb-3">
            <div className="px-3">{children}</div>
          </div>
        )}
      </div>
    )
  }

  const filterContent = (
    <div className="space-y-2">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600">
            <SlidersHorizontal className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Advanced Filters</h2>
            <p className="text-sm text-slate-500">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
            </p>
          </div>
        </div>
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="glass-card p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {filters.difficulties?.map((difficulty) => (
              <Badge key={difficulty} variant="secondary" className="bg-violet-100 text-violet-700">
                {difficulty}
                <button
                  onClick={() => handleArrayFilterChange('difficulties', difficulty, false)}
                  className="ml-1 hover:text-violet-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.status && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {statusOptions.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => onFiltersChange({ ...filters, status: "" })}
                  className="ml-1 hover:text-emerald-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.categories?.map((category) => (
              <Badge key={category} variant="secondary" className="bg-emerald-100 text-emerald-700">
                {categories.find(c => c.id === category)?.name}
                <button
                  onClick={() => handleArrayFilterChange('categories', category, false)}
                  className="ml-1 hover:text-emerald-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {/* Difficulty Filter */}
        <FilterSection
          title="Difficulty Level"
          isExpanded={expandedSections.difficulty}
          onToggle={() => toggleSection('difficulty')}
        >
          <div className="space-y-3">
            {difficulties.map((difficulty) => (
              <div key={difficulty.value} className="flex items-center space-x-3">
                <Checkbox
                  id={difficulty.value}
                  checked={filters.difficulties?.includes(difficulty.value) || false}
                  onCheckedChange={(checked: boolean) =>
                    handleArrayFilterChange('difficulties', difficulty.value, checked)
                  }
                  className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <label
                  htmlFor={difficulty.value}
                  className="text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                >
                  {difficulty.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <Separator className="my-1" />

        {/* Piece Count Filter */}
        <FilterSection
          title="Piece Count"
          isExpanded={expandedSections.pieces}
          onToggle={() => toggleSection('pieces')}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{filters.pieceMin} pieces</span>
                <span>{filters.pieceMax === 5000 ? '5000+' : filters.pieceMax} pieces</span>
              </div>
              <Slider
                value={[filters.pieceMin, filters.pieceMax]}
                onValueChange={([min, max]) =>
                  onFiltersChange({ ...filters, pieceMin: min, pieceMax: max })
                }
                max={5000}
                min={0}
                step={100}
                className="w-full"
              />
            </div>
          </div>
        </FilterSection>

        <Separator className="my-1" />

        {/* Rating Filter */}
        <FilterSection
          title="Rating"
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{filters.ratingMin === 0 ? 'Any' : `${filters.ratingMin}+`} stars</span>
                <span>5 stars</span>
              </div>
              <Slider
                value={[filters.ratingMin]}
                onValueChange={([min]) =>
                  onFiltersChange({ ...filters, ratingMin: min })
                }
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>
        </FilterSection>

        <Separator className="my-1" />

        {/* Brand Filter */}
        <FilterSection
          title="Brands"
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <div className="space-y-3">
            {availableBrands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-3">
                <Checkbox
                  id={brand.id}
                  checked={filters.brands?.includes(brand.name) || false}
                  onCheckedChange={(checked: boolean) =>
                    handleArrayFilterChange('brands', brand.name, checked)
                  }
                  className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <label
                  htmlFor={brand.id}
                  className="text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                >
                  {brand.name}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <Separator className="my-1" />

        {/* Status Filter */}
        <FilterSection
          title="My Collection Status"
          isExpanded={expandedSections.status}
          onToggle={() => toggleSection('status')}
        >
          <div className="space-y-3">
            {statusOptions.map((status) => (
              <div key={status.value} className="flex items-center space-x-3">
                <Checkbox
                  id={status.value}
                  checked={filters.status?.split(',').includes(status.value) || false}
                  onCheckedChange={(checked: boolean) =>
                    handleStatusFilterChange(status.value, checked)
                  }
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <label
                  htmlFor={status.value}
                  className="text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                >
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <Separator className="my-1" />

        {/* Theme Filter */}
        <FilterSection
          title="Categories"
          isExpanded={expandedSections.theme}
          onToggle={() => toggleSection('theme')}
        >
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-3">
                <Checkbox
                  id={category.id}
                  checked={filters.categories?.includes(category.id) || false}
                  onCheckedChange={(checked: boolean) =>
                    handleArrayFilterChange('categories', category.id, checked)
                  }
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <label
                  htmlFor={category.id}
                  className="text-sm text-slate-600 cursor-pointer hover:text-slate-900"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Premium CTA */}
      <div className="mt-8 glass-card p-4 bg-gradient-to-br from-violet-50 to-emerald-50 border-violet-200/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-emerald-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI-Powered Discovery</h3>
            <p className="text-xs text-slate-600">Get personalized recommendations</p>
          </div>
        </div>
        <Button 
          size="sm" 
          className="w-full glass-button text-xs"
        >
          Try AI Search
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Card className="glass-card border-white/30 sticky top-6">
          <CardContent className="p-6">
            {filterContent}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative glass-card border-violet-200">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full bg-violet-600 text-xs flex items-center justify-center p-0">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto bg-gradient-to-br from-slate-50 via-violet-50/30 to-emerald-50/20">
            <SheetHeader>
              <SheetTitle className="text-slate-900">Advanced Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
} 

// Export with both names for compatibility
export default AdvancedFilterPanel
export { AdvancedFilterPanel as BrowseFilterSidebar } 