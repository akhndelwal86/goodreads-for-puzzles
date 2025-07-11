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

export function BrandSelector({ value, onChange, className }: BrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)

  // Load brands from API
  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/brands')
        const data = await response.json()
        if (data.brands) {
          setBrands(data.brands.map((brand: any) => ({
            id: brand.id,
            name: brand.name,
            isPopular: brand.puzzle_count > 5 // Mark brands with 5+ puzzles as popular
          })))
        }
      } catch (error) {
        console.error('Error loading brands:', error)
        // Fallback to default brands if API fails
        setBrands([
          { id: 'ravensburger', name: 'Ravensburger', isPopular: true },
          { id: 'buffalo-games', name: 'Buffalo Games', isPopular: true },
          { id: 'trefl', name: 'Trefl', isPopular: true }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadBrands()
  }, [])

  // Filter brands based on search query
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBrandSelect = (brandName: string) => {
    onChange(brandName)
    setSearchQuery('')
    setIsOpen(false)
    setShowCustomInput(false)
  }

  const handleCustomBrandSubmit = () => {
    const brandName = (customBrand || searchQuery).trim()
    console.log('Adding custom brand:', brandName, { customBrand, searchQuery })
    if (brandName) {
      console.log('Calling onChange with brand:', brandName)
      onChange(brandName)
      setCustomBrand('')
      setShowCustomInput(false)
      setIsOpen(false)
      setSearchQuery('')
      
      // Add to local brands list for immediate visibility
      setBrands(prev => [...prev, { 
        id: brandName.toLowerCase().replace(/\s+/g, '-'), 
        name: brandName, 
        isPopular: false 
      }])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setIsOpen(true)
    
    // If no exact match found in brands, show option to add custom
    const hasExactMatch = brands.some(
      brand => brand.name.toLowerCase() === query.toLowerCase()
    )
    setShowCustomInput(query.length > 0 && !hasExactMatch)
  }

  return (
    <div className="relative">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Brand/Manufacturer *
        </label>
        <div className="relative">
          <Input
            value={isOpen ? searchQuery : (value || searchQuery)}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsOpen(false)
                setSearchQuery('')
              }, 200) // Delay to allow click events
            }}
            placeholder="Search for a brand or type to add new..."
            className={cn("pr-8", className?.includes('text-destructive') && "border-destructive")}
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
          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading brands...
            </div>
          )}
          
          {/* Popular Brands */}
          {!loading && filteredBrands.length > 0 && (
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
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-violet-600 text-white rounded-sm hover:bg-violet-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add "{customBrand || searchQuery}" as New Brand
                </button>
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && filteredBrands.length === 0 && !showCustomInput && (
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