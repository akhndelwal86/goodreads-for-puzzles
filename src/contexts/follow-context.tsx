'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface FollowState {
  [userId: string]: boolean
}

interface FollowContextType {
  followState: FollowState
  updateFollowState: (userId: string, isFollowing: boolean) => void
  clearFollowState: () => void
}

const FollowContext = createContext<FollowContextType | undefined>(undefined)

export function FollowProvider({ children }: { children: ReactNode }) {
  const [followState, setFollowState] = useState<FollowState>({})

  const updateFollowState = (userId: string, isFollowing: boolean) => {
    setFollowState(prev => ({
      ...prev,
      [userId]: isFollowing
    }))
  }

  const clearFollowState = () => {
    setFollowState({})
  }

  return (
    <FollowContext.Provider value={{
      followState,
      updateFollowState,
      clearFollowState
    }}>
      {children}
    </FollowContext.Provider>
  )
}

export function useFollowContext() {
  const context = useContext(FollowContext)
  if (context === undefined) {
    throw new Error('useFollowContext must be used within a FollowProvider')
  }
  return context
}