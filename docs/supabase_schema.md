// Your Exact Database Structure
interface DatabaseSchema {
  // Core Tables
  users: {
    id: string                    // UUID PK
    clerk_id: string             // Required for auth
    username?: string            // Optional display name
    email: string                // Required
    avatar_url?: string          // Optional profile pic
    bio?: string                 // Optional bio
    created_at: string           // Auto timestamp
    updated_at: string           // Auto timestamp
  }

  brands: {
    id: string                   // UUID PK
    name: string                 // Required brand name
    description?: string         // Optional brand info
    image_url?: string          // Optional brand logo
    website_url?: string        // Optional brand website
    created_at: string          // Auto timestamp
  }

  puzzles: {
    id: string                   // UUID PK
    title: string                // Required puzzle name
    brand_id?: string           // FK to brands.id
    image_url?: string          // Optional puzzle image
    piece_count?: number        // Optional piece count
    material?: string           // Optional material type
    year?: number               // Optional release year
    theme?: string              // Optional theme/category
    description?: string        // Optional description
    purchase_link?: string      // Optional buy link
    uploader_id?: string        // FK to users.id
    approval_status: string     // Default: 'pending'
    created_at: string          // Auto timestamp
    updated_at: string          // Auto timestamp
  }

  puzzle_logs: {
    id: string                   // UUID PK
    user_id?: string            // FK to users.id
    puzzle_id?: string          // FK to puzzles.id
    solve_time_seconds?: number // Optional solve duration
    note?: string               // Optional user notes
    photo_urls: string[]        // JSONB array of images
    video_urls: string[]        // JSONB array of videos
    logged_at: string           // Auto timestamp
  }

  reviews: {
    id: string                   // UUID PK
    user_id?: string            // FK to users.id
    puzzle_id?: string          // FK to puzzles.id
    rating?: number             // 1-5 star rating
    review_text?: string        // Optional review text
    // Detailed puzzle quality metrics
    loose_fit?: number          // 1-5 rating
    loose_fit_explanation?: string
    false_fit?: number          // 1-5 rating
    false_fit_explanation?: string
    shape_versatility?: number  // 1-5 rating
    shape_versatility_explanation?: string
    finish?: number             // 1-5 rating
    finish_explanation?: string
    pick_test?: boolean         // Pass/fail test
    pick_test_explanation?: string
    other_metadata_notes?: string
    created_at: string          // Auto timestamp
  }

  puzzle_aggregates: {
    id: string                   // PK, FK to puzzles.id (1:1)
    title?: string              // Denormalized puzzle title
    avg_rating?: number         // Calculated average rating
    review_count: number        // Count of reviews (default: 0)
    // Aggregated quality metrics
    avg_loose_fit?: number
    avg_false_fit?: number
    avg_shape_versatility?: number
    avg_finish?: number
    pick_test_success_rate?: number
    // Individual metric counts
    loose_fit_count: number     // Default: 0
    false_fit_count: number     // Default: 0
    shape_versatility_count: number // Default: 0
    finish_count: number        // Default: 0
    pick_test_count: number     // Default: 0
    last_updated: string        // Auto timestamp
  }
}