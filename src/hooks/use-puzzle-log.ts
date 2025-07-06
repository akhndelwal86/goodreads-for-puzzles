import { useState, useEffect, useCallback } from 'react'

interface PuzzleLog {
  id: string
  puzzleId: string
  puzzleTitle: string
  notes: string
  timeSpent: number | null
  photos: string[]
  progressPercentage: number
  rating: number
  difficulty: number
  private: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

interface UsePuzzleLogResult {
  hasLog: boolean
  log: PuzzleLog | null
  loading: boolean
  error: string | null
  checkForLog: (puzzleId: string) => Promise<void>
  refetch: () => Promise<void>
  invalidateCache: () => void
}

export function usePuzzleLog(puzzleId?: string): UsePuzzleLogResult {
  const [hasLog, setHasLog] = useState(false)
  const [log, setLog] = useState<PuzzleLog | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPuzzleId, setCurrentPuzzleId] = useState<string | undefined>(puzzleId)

  const checkForLog = useCallback(async (targetPuzzleId: string) => {
    if (!targetPuzzleId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/puzzle-logs/check?puzzleId=${targetPuzzleId}`)
      const data = await response.json()
      
      if (response.ok) {
        setHasLog(data.hasLog) // ✅ Fixed: was data.exists
        setLog(data.log)
      } else {
        setError(data.error || 'Failed to check for puzzle log')
        setHasLog(false)
        setLog(null)
      }
    } catch (err) {
      setError('Network error while checking for puzzle log')
      setHasLog(false)
      setLog(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    if (currentPuzzleId) {
      await checkForLog(currentPuzzleId)
    }
  }, [currentPuzzleId, checkForLog])

  const invalidateCache = useCallback(() => {
    setHasLog(false)
    setLog(null)
    setError(null)
  }, [])

  // Auto-fetch when puzzleId changes
  useEffect(() => {
    if (puzzleId && puzzleId !== currentPuzzleId) {
      setCurrentPuzzleId(puzzleId)
      checkForLog(puzzleId)
    }
  }, [puzzleId, currentPuzzleId, checkForLog])

  return {
    hasLog,
    log,
    loading,
    error,
    checkForLog,
    refetch,
    invalidateCache
  }
} 