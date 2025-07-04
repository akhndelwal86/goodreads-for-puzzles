'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Check, ChevronDown, Plus } from 'lucide-react'

interface Brand {
  id: string
  name: string
  isPopular?: boolean
}

interface BrandSelectorProps {
  value: string
  onChange: (brandName: string) => void
  className?: string
}

// Popular puzzle brands - this could come from API later
const POPULAR_BRANDS: Brand[] = [
  { id: 'ravensburger', name: 'Ravensburger', isPopular: true },
  { id: 'buffalo-games', name: 'Buffalo Games', isPopular: true },
  { id: 'trefl', name: 'Trefl', isPopular: true },
  { id: 'cobble-hill', name: 'Cobble Hill', isPopular: true },
  { id: 'springbok', name: 'Springbok', isPopular: true },
  { id: 'white-mountain', name: 'White Mountain', isPopular: true },
  { id: 'eurographics', name: 'Eurographics', isPopular: true },
  { id: 'masterpieces', name: 'MasterPieces', isPopular: true },
  { id: 'pomegranate', name: 'Pomegranate', isPopular: true },
  { id: 'galison', name: 'Galison', isPopular: true }
]

export function BrandSelector({ value, onChange, className }: BrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Filter brands based on search query
  const filteredBrands = POPULAR_BRANDS.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBrandSelect = (brandName: string) => {
    onChange(brandName)
    setSearchQuery('')
    setIsOpen(false)
    setShowCustomInput(false)
  }

  const handleCustomBrandSubmit = () => {
    if (customBrand.trim()) {
      onChange(customBrand.trim())
      setCustomBrand('')
      setShowCustomInput(false)
      setIsOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setIsOpen(true)
    
    // If no exact match found in popular brands, show option to add custom
    const hasExactMatch = POPULAR_BRANDS.some(
      brand => brand.name.toLowerCase() === query.toLowerCase()
    )
    setShowCustomInput(query.length > 0 && !hasExactMatch)
  }

  return (
    <div className={cn('relative', className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Brand/Manufacturer *
        </label>
        <div className="relative">
          <Input
            value={value || searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for a brand or type to add new..."
            className="pr-8"
          />
          <ChevronDown 
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Popular Brands */}
          {filteredBrands.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Popular Brands
              </div>
              {filteredBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-muted transition-colors",
                    value === brand.name && "bg-muted"
                  )}
                >
                  <span>{brand.name}</span>
                  {value === brand.name && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Custom Brand Option */}
          {showCustomInput && searchQuery && (
            <div className="p-2 border-t border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Add New Brand
              </div>
              <div className="space-y-2">
                <Input
                  value={customBrand || searchQuery}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="Enter brand name"
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCustomBrandSubmit()
                    }
                  }}
                />
                <button
                  onClick={handleCustomBrandSubmit}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add "{customBrand || searchQuery}"
                </button>
              </div>
            </div>
          )}

          {/* No results */}
          {filteredBrands.length === 0 && !showCustomInput && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No brands found. Type to add a new brand.
            </div>
          )}
        </div>
      )}

      {/* Selected Brand Display */}
      {value && !isOpen && (
        <div className="mt-2">
          <Badge variant="secondary" className="text-sm">
            {value}
          </Badge>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 