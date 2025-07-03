// Database Types for Goodreads for Jigsaw Puzzles

export interface User {
    id: string;
    clerk_id: string;
    username: string | null;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface Brand {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    website_url: string | null;
    created_at: string;
  }
  
  export interface Puzzle {
    id: string;
    title: string;
    brand_id: string | null;
    brand?: Brand; // For joined queries
    image_url: string | null;
    piece_count: number | null;
    material: string | null;
    year: number | null;
    theme: string | null;
    description: string | null;
    purchase_link: string | null;
    uploader_id: string | null;
    uploader?: User; // For joined queries
    approval_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    tags?: Tag[]; // For joined queries
    stats?: PuzzleStats; // For aggregated data
  }
  
  export interface PuzzleStats {
    solve_count: number;
    want_to_solve_count: number;
    want_to_buy_count: number;
    avg_solve_time_seconds: number | null;
    avg_rating: number | null;
    review_count: number;
  }
  
  export interface List {
    id: string;
    user_id: string;
    user?: User; // For joined queries
    name: string;
    description: string | null;
    type: 'standard' | 'custom';
    created_at: string;
    puzzle_count?: number; // For aggregated data
  }
  
  export interface ListItem {
    id: string;
    list_id: string;
    puzzle_id: string;
    puzzle?: Puzzle; // For joined queries
    added_at: string;
  }
  
  export interface Review {
    id: string;
    user_id: string;
    user?: User; // For joined queries
    puzzle_id: string;
    puzzle?: Puzzle; // For joined queries
    rating: number;
    review_text: string | null;
    loose_fit: number | null;
    loose_fit_explanation: string | null;
    false_fit: number | null;
    false_fit_explanation: string | null;
    shape_versatility: number | null;
    shape_versatility_explanation: string | null;
    finish: number | null;
    finish_explanation: string | null;
    pick_test: boolean | null;
    pick_test_explanation: string | null;
    other_metadata_notes: string | null;
    created_at: string;
  }
  
  export interface PuzzleLog {
    id: string;
    user_id: string;
    user?: User; // For joined queries
    puzzle_id: string;
    puzzle?: Puzzle; // For joined queries
    solve_time_seconds: number | null;
    note: string | null;
    photo_urls: string[];
    video_urls: string[];
    logged_at: string;
  }
  
  export interface Tag {
    id: string;
    name: string;
    type: string | null;
    created_at: string;
  }
  
  export interface Follow {
    id: string;
    follower_id: string;
    followed_user_id: string;
    follower?: User; // For joined queries
    followed_user?: User; // For joined queries
    created_at: string;
  }
  
  export interface FeedItem {
    id: string;
    user_id: string;
    user?: User; // For joined queries
    type: 'review' | 'solved' | 'add_to_list' | 'puzzle_upload' | 'added_purchase_link' | 'puzzle_log';
    target_puzzle_id: string | null;
    target_puzzle?: Puzzle; // For joined queries
    target_list_id: string | null;
    target_list?: List; // For joined queries
    target_review_id: string | null;
    target_review?: Review; // For joined queries
    target_puzzle_log_id: string | null;
    target_puzzle_log?: PuzzleLog; // For joined queries
    image_url: string | null;
    media_urls: string[];
    text: string | null;
    created_at: string;
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    data: T;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }
  
  // Form Types
  export interface CreatePuzzleForm {
    title: string;
    brand_id: string;
    image_url?: string;
    piece_count?: number;
    material?: string;
    year?: number;
    theme?: string;
    description?: string;
    purchase_link?: string;
    tag_ids: string[];
  }
  
  export interface CreateReviewForm {
    puzzle_id: string;
    rating: number;
    review_text?: string;
    loose_fit?: number;
    loose_fit_explanation?: string;
    false_fit?: number;
    false_fit_explanation?: string;
    shape_versatility?: number;
    shape_versatility_explanation?: string;
    finish?: number;
    finish_explanation?: string;
    pick_test?: boolean;
    pick_test_explanation?: string;
    other_metadata_notes?: string;
  }
  
  export interface CreatePuzzleLogForm {
    puzzle_id: string;
    solve_time_seconds?: number;
    note?: string;
    photo_files?: File[];
    video_files?: File[];
  }
  
  // Search and Filter Types
  export interface PuzzleFilters {
    search?: string;
    brand_id?: string;
    piece_count_min?: number;
    piece_count_max?: number;
    tag_ids?: string[];
    difficulty?: string;
    theme?: string;
    sort?: 'popularity' | 'rating' | 'newest' | 'piece_count' | 'solve_time';
    page?: number;
    limit?: number;
  }
  
  export interface SmartListType {
    id: string;
    name: string;
    description: string;
    query: PuzzleFilters;
    icon?: string;
  }

  // Database Types for Goodreads for Jigsaw Puzzles

export interface User {
    id: string;
    clerk_id: string;
    username: string | null;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface Brand {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    website_url: string | null;
    created_at: string;
  }
  
  export interface Puzzle {
    id: string;
    title: string;
    brand_id: string | null;
    brand?: Brand; // For joined queries
    image_url: string | null;
    piece_count: number | null;
    material: string | null;
    year: number | null;
    theme: string | null;
    description: string | null;
    purchase_link: string | null;
    uploader_id: string | null;
    uploader?: User; // For joined queries
    approval_status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    tags?: Tag[]; // For joined queries
    stats?: PuzzleStats; // For aggregated data
  }
  
  export interface PuzzleStats {
    solve_count: number;
    want_to_solve_count: number;
    want_to_buy_count: number;
    avg_solve_time_seconds: number | null;
    avg_rating: number | null;
    review_count: number;
  }
  
  export interface List {
    id: string;
    user_id: string;
    user?: User; // For joined queries
    name: string;
    description: string | null;
    type: 'standard' | 'custom';
    created_at: string;
    puzzle_count?: number; // For aggregated data
  }
  
  export interface ListItem {
    id: string;
    list_id: string;
    puzzle_id: string;
    puzzle?: Puzzle; // For joined queries
    added_at: string;
  }
  
  export interface Review {
    id: string;
    user_id: string;
    user?: User; // For joined queries
    puzzle_id: string;
    puzzle?: Puzzle; // For joined queries
    rating: number;
    review_text: string | null;
    loose_fit: number | null;
    loose_fit_explanation: string | null;
    false_fit: number | null;
    false_fit_explanation: string | null;
    shape_versatility: number | null;
    shape_versatility_explanation: string | null;
    finish: number | null;
    finish_explanation: string | null;
    pick_test: boolean | null;
    pick_test_explanation: string | null;
    other_metadata_notes: string | null;
    created_at: string;
  }
  
  export interface PuzzleLog {
    id: string;
    user_id: string;
    user?: User; // For joined queries
    puzzle_id: string;
    puzzle?: Puzzle; // For joined queries
    solve_time_seconds: number | null;
    note: string | null;
    photo_urls: string[];
    video_urls: string[];
    logged_at: string;
  }
  
  export interface Tag {
    id: string;
    name: string;
    type: string | null;
    created_at: string;
  }
  
  export interface Follow {
    id: string;
    follower_id: string;
    followed_user_id: string;
    follower?: User; // For joined queries
    followed_user?: User; // For joined queries
    created_at: string;
  }
  
  export interface FeedItem {
    id: string;
    user_id: string;
    user?: User; // For joined queries
    type: 'review' | 'solved' | 'add_to_list' | 'puzzle_upload' | 'added_purchase_link' | 'puzzle_log';
    target_puzzle_id: string | null;
    target_puzzle?: Puzzle; // For joined queries
    target_list_id: string | null;
    target_list?: List; // For joined queries
    target_review_id: string | null;
    target_review?: Review; // For joined queries
    target_puzzle_log_id: string | null;
    target_puzzle_log?: PuzzleLog; // For joined queries
    image_url: string | null;
    media_urls: string[];
    text: string | null;
    created_at: string;
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    data: T;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }
  
  // Form Types
  export interface CreatePuzzleForm {
    title: string;
    brand_id: string;
    image_url?: string;
    piece_count?: number;
    material?: string;
    year?: number;
    theme?: string;
    description?: string;
    purchase_link?: string;
    tag_ids: string[];
  }
  
  export interface CreateReviewForm {
    puzzle_id: string;
    rating: number;
    review_text?: string;
    loose_fit?: number;
    loose_fit_explanation?: string;
    false_fit?: number;
    false_fit_explanation?: string;
    shape_versatility?: number;
    shape_versatility_explanation?: string;
    finish?: number;
    finish_explanation?: string;
    pick_test?: boolean;
    pick_test_explanation?: string;
    other_metadata_notes?: string;
  }
  
  export interface CreatePuzzleLogForm {
    puzzle_id: string;
    solve_time_seconds?: number;
    note?: string;
    photo_files?: File[];
    video_files?: File[];
  }
  
  // Search and Filter Types
  export interface PuzzleFilters {
    search?: string;
    brand_id?: string;
    piece_count_min?: number;
    piece_count_max?: number;
    tag_ids?: string[];
    difficulty?: string;
    theme?: string;
    sort?: 'popularity' | 'rating' | 'newest' | 'piece_count' | 'solve_time';
    page?: number;
    limit?: number;
  }
  
  export interface SmartListType {
    id: string;
    name: string;
    description: string;
    query: PuzzleFilters;
    icon?: string;
  }