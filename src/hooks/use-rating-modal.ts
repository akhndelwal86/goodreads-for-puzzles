import { useState } from 'react'

interface Puzzle {
  id: string
  title: string
  brand?: { name: string }
  pieceCount: number
  imageUrl?: string
}

export function useRatingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)

  const openModal = (puzzle: Puzzle) => {
    setSelectedPuzzle(puzzle)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedPuzzle(null)
  }

  return {
    isOpen,
    puzzle: selectedPuzzle,
    openModal,
    closeModal
  }
}

export type { Puzzle }
