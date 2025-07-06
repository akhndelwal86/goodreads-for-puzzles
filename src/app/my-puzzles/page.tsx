'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getUserPuzzleStats } from '@/lib/supabase'
import type { UserPuzzle, UserPuzzleStats, UserPuzzleStatus } from '@/lib/supabase'
import { StatsHeader } from './components/stats-header'
import { StatusTabs } from './components/status-tabs'
import { PuzzleFilters } from './components/puzzle-filters'
import { PuzzleGrid } from './components/puzzle-grid'
import { PuzzleLoggingModal } from './components/puzzle-logging-modal'
import { EmptyState } from './components/empty-state'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export default function MyPuzzlesPage() {
  // Get user from Clerk
  const { user, isLoaded } = useUser()
  
  // State management
  const [puzzles, setPuzzles] = useState<UserPuzzle[]>([])
  const [stats, setStats] = useState<UserPuzzleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'brand' | 'pieces'>('recent')
  const [selectedPuzzle, setSelectedPuzzle] = useState<UserPuzzle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Load user's puzzles via API
  const loadUserData = async () => {
    if (!isLoaded || !user) return
    
    setLoading(true)
    try {
      // Call our API route that uses service client
      const response = await fetch('/api/my-puzzles')
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      const puzzlesData = data.puzzles || []
      setPuzzles(puzzlesData)
      
      // Calculate proper stats from the actual puzzle data
      const completedPuzzles = puzzlesData.filter((p: any) => p.status === 'completed')
      const totalTimeSpent = completedPuzzles.reduce((sum: number, p: any) => sum + (p.timeSpent || 0), 0)
      
      // Calculate this month's completions
      const thisMonth = new Date()
      thisMonth.setDate(1) // First day of current month
      const thisMonthCompleted = completedPuzzles.filter((p: any) => {
        if (!p.completedAt) return false
        return new Date(p.completedAt) >= thisMonth
      }).length
      
      // Find favorite brand
      const brandCounts: Record<string, number> = {}
      completedPuzzles.forEach((p: any) => {
        const brand = p.brand || 'Unknown'
        brandCounts[brand] = (brandCounts[brand] || 0) + 1
      })
      
      const favoriteBrand = Object.entries(brandCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Unknown'
      
      // Create stats from the actual data
      setStats({
        totalCompleted: completedPuzzles.length,
        totalTimeSpent: totalTimeSpent,
        averageTimePerPuzzle: completedPuzzles.length > 0 ? Math.round(totalTimeSpent / completedPuzzles.length) : 0,
        totalPuzzles: puzzlesData.length,
        thisMonthCompleted: thisMonthCompleted,
        favoriteBrand: favoriteBrand
      })
      
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter puzzles based on current filters
  const filteredPuzzles = puzzles.filter(puzzle => {
    // Status filter
    if (activeTab !== 'all' && puzzle.status !== activeTab) {
      return false
    }

    // Search filter
    if (searchTerm && !puzzle.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Brand filter
    if (brandFilter !== 'all' && puzzle.brand !== brandFilter) {
      return false
    }

    return true
  })



  // Get unique brands for filter dropdown
  const availableBrands = Array.from(new Set(puzzles.map(p => p.brand))).sort()

  // Handle puzzle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    // Note: For now we'll just filter client-side
    // In production, this would call searchUserPuzzles API
  }

  // Handle puzzle click
  const handlePuzzleClick = (puzzle: UserPuzzle) => {
    setSelectedPuzzle(puzzle)
    setIsModalOpen(true)
  }

  // Handle log progress modal
  const handleLogProgress = (puzzle: UserPuzzle) => {
    setSelectedPuzzle(puzzle)
    setIsModalOpen(true)
  }

  // Handle successful logging
  const handleLoggingSuccess = () => {
    // Refresh the puzzles data
    loadUserData()
    
    // Close modal
    setIsModalOpen(false)
    setSelectedPuzzle(null)
  }

  // Handle status change - CLEAN ARCHITECTURE VERSION
  const handleStatusChange = async (puzzleId: string, newStatus: string, completionTime?: number) => {
    console.log('🔄 Status change requested (clean architecture):', { puzzleId, newStatus, completionTime })
    
    // Find the current puzzle to get its current status (outside try block for error handling)
    const currentPuzzle = puzzles.find(p => p.id === puzzleId)
    const currentStatus = currentPuzzle?.status
    
    try {
      console.log('🔄 Current puzzle status:', currentStatus, '→', newStatus)
      console.log('🔄 Puzzle details:', currentPuzzle?.title)

      // Optimistically update the UI first
      setPuzzles(prevPuzzles => 
        prevPuzzles.map(p => 
          p.id === puzzleId 
            ? { ...p, status: newStatus as any }
            : p
        )
      )

      // Call the new clean API endpoint
      const requestBody = {
        puzzleId,
        newStatus,
        completionTime
      }
      
      console.log('🔄 Request body (clean API):', requestBody)

      const response = await fetch('/api/puzzle-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      console.log('🔄 PATCH response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Status change failed:', errorData)
        
        // Revert optimistic update
        setPuzzles(prevPuzzles => 
          prevPuzzles.map(p => 
            p.id === puzzleId 
              ? { ...p, status: currentStatus as any }
              : p
          )
        )
        
        throw new Error(errorData.error || 'Failed to update puzzle status')
      }

      const result = await response.json()
      console.log('✅ Status change successful (clean architecture):', result)
      
      // Force a full refresh to ensure consistency
      await loadUserData()
      
    } catch (error) {
      console.error('❌ Error changing puzzle status:', error)
      
      // Revert optimistic update on error
      setPuzzles(prevPuzzles => 
        prevPuzzles.map(p => 
          p.id === puzzleId 
            ? { ...p, status: (currentPuzzle?.status || 'wishlist') as any }
            : p
        )
      )
    }
  }

  // Load data when component mounts
  useEffect(() => {
    loadUserData()
  }, [isLoaded, user]) // eslint-disable-line react-hooks/exhaustive-deps

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your puzzles</h2>
          <p className="text-gray-600">Please sign in to access your puzzle collection.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Header */}
        <StatsHeader 
          user={user} 
          stats={stats} 
        />

        {/* Filters and Search */}
        <div className="mb-8">
          <PuzzleFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            brandFilter={brandFilter}
            onBrandChange={setBrandFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            availableBrands={availableBrands}
          />
        </div>

        {/* Status Tabs */}
        <StatusTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          puzzles={puzzles}
        />

        {/* Puzzle Grid */}
        {filteredPuzzles.length > 0 ? (
          <PuzzleGrid
            puzzles={filteredPuzzles}
            onPuzzleClick={handlePuzzleClick}
            onStatusChange={handleStatusChange}
            onLogProgress={handleLogProgress}
          />
        ) : (
          <EmptyState 
            activeTab={activeTab}
            hasSearchTerm={!!searchTerm}
            onClearFilters={() => {
              setSearchTerm('')
              setBrandFilter('all')
              setActiveTab('all')
            }}
          />
        )}

        {/* Puzzle Logging Modal */}
        <PuzzleLoggingModal
          puzzle={selectedPuzzle}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPuzzle(null)
          }}
          onSuccess={handleLoggingSuccess}
        />
      </div>
    </div>
  )
} 