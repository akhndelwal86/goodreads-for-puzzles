// TypeScript interfaces for puzzle detail page data structures

export interface ReviewMetadata {
  looseFit: number | null
  looseFitExplanation: string | null
  falseFit: number | null
  falseFitExplanation: string | null
  shapeVersatility: number | null
  shapeVersatilityExplanation: string | null
  finish: number | null
  finishExplanation: string | null
  pickTest: number | null
  pickTestExplanation: string | null
  otherNotes: string | null
}

export interface ReviewUser {
  id: string
  username: string
  avatar: string | null
}

export interface Review {
  id: string
  user: ReviewUser
  rating: number
  title: string | null
  review: string
  date: string
  timeAgo: string
  verified: boolean
  helpful: number
  metadata: ReviewMetadata
}

export interface RatingBreakdownItem {
  stars: number
  count: number
  percentage: number
}

export interface QualityBreakdown {
  imageQuality: number
  pieceFit: number
  durability: number
  overallExperience: number
}

export interface ReviewSummary {
  totalReviews: number
  averageRating: number
  ratingBreakdown: RatingBreakdownItem[]
  qualityBreakdown: QualityBreakdown
}

export interface ReviewPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface ReviewsData {
  reviews: Review[]
  pagination: ReviewPagination
  summary: ReviewSummary
}

// Activity feed interfaces
export interface ActivityMetadata {
  rating?: number
  progress?: number
  solveTime?: string
}

export interface ActivityItem {
  id: string
  type: 'completed' | 'reviewed' | 'added_to_wishlist' | 'started_solving'
  user: string
  timeAgo: string
  metadata?: ActivityMetadata
}

// Related puzzles interfaces
export interface PuzzleBrand {
  name: string
}

export interface RelatedPuzzle {
  id: string
  title: string
  brand: PuzzleBrand
  imageUrl: string
  pieceCount: number
  avgRating?: number
  reviewCount?: number
  timesCompleted?: number
}

export interface RelatedPuzzlesData {
  relatedPuzzles: RelatedPuzzle[]
  brandName: string
}

// Browse similar interfaces
export interface SimilarPuzzle {
  id: string
  title: string
  brand: PuzzleBrand
  imageUrl: string
  pieceCount: number
  avgRating?: number
  reviewCount?: number
  type?: string
  enabled?: boolean
  filterValue?: string
  filterKey?: string
  label?: string
  description?: string
  count?: number
}

export interface BrowseSimilarData {
  similarities: SimilarPuzzle[]
}

// Type guards for runtime validation
export function isValidReviewsData(data: unknown): data is ReviewsData {
  return (
    data != null &&
    typeof data === 'object' &&
    'summary' in data &&
    'reviews' in data &&
    'pagination' in data
  )
}

export function isValidActivityData(data: unknown): data is ActivityItem[] {
  return Array.isArray(data)
}

export function isValidRelatedPuzzlesData(data: unknown): data is RelatedPuzzlesData {
  return (
    data != null &&
    typeof data === 'object' &&
    'relatedPuzzles' in data &&
    'brandName' in data
  )
}

export function isValidBrowseSimilarData(data: unknown): data is BrowseSimilarData {
  return (
    data != null &&
    typeof data === 'object' &&
    'similarities' in data
  )
}