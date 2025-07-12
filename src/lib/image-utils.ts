/**
 * Image optimization utilities for Supabase Storage
 * Handles image transformations, format detection, and responsive URLs
 */

// Base64 blur placeholder for loading state
export const BLUR_PLACEHOLDER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

// Image size configurations
export const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 200 },
  card: { width: 400, height: 400 },
  medium: { width: 600, height: 600 },
  large: { width: 800, height: 800 }
} as const

export type ImageSize = keyof typeof IMAGE_SIZES

// Responsive sizes for Next.js Image component
export const RESPONSIVE_SIZES = {
  grid: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  list: "192px",
  card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('webp') > -1
}

/**
 * Check if browser supports AVIF format
 */
export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/avif').indexOf('avif') > -1
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalFormat(): 'avif' | 'webp' | 'jpeg' {
  if (supportsAVIF()) return 'avif'
  if (supportsWebP()) return 'webp'
  return 'jpeg'
}

/**
 * Generate optimized image URL with Supabase transformations
 */
export function getOptimizedImageUrl(
  originalUrl: string | null | undefined,
  size: ImageSize = 'card',
  quality: number = 80
): string {
  // Return placeholder if no URL provided
  if (!originalUrl) {
    return '/placeholder-puzzle.svg'
  }

  // If it's already a placeholder or external URL, return as-is
  if (originalUrl.startsWith('/') || !originalUrl.includes('supabase')) {
    return originalUrl
  }

  try {
    const url = new URL(originalUrl)
    const { width, height } = IMAGE_SIZES[size]
    
    // Add Supabase image transformation parameters
    url.searchParams.set('width', width.toString())
    url.searchParams.set('height', height.toString())
    url.searchParams.set('quality', quality.toString())
    url.searchParams.set('resize', 'cover')
    
    // Add format optimization for supported browsers
    const format = getOptimalFormat()
    if (format !== 'jpeg') {
      url.searchParams.set('format', format)
    }
    
    return url.toString()
  } catch (error) {
    console.warn('Failed to optimize image URL:', error)
    return originalUrl
  }
}

/**
 * Generate responsive srcSet for different image sizes
 */
export function generateSrcSet(
  originalUrl: string | null | undefined,
  quality: number = 80
): string {
  if (!originalUrl) return ''

  const sizes: ImageSize[] = ['thumbnail', 'card', 'medium', 'large']
  
  return sizes
    .map(size => {
      const url = getOptimizedImageUrl(originalUrl, size, quality)
      const { width } = IMAGE_SIZES[size]
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Get image URL with specific dimensions
 */
export function getImageUrlWithDimensions(
  originalUrl: string | null | undefined,
  width: number,
  height: number,
  quality: number = 80
): string {
  if (!originalUrl) {
    return '/placeholder-puzzle.svg'
  }

  if (originalUrl.startsWith('/') || !originalUrl.includes('supabase')) {
    return originalUrl
  }

  try {
    const url = new URL(originalUrl)
    
    url.searchParams.set('width', width.toString())
    url.searchParams.set('height', height.toString())
    url.searchParams.set('quality', quality.toString())
    url.searchParams.set('resize', 'cover')
    
    const format = getOptimalFormat()
    if (format !== 'jpeg') {
      url.searchParams.set('format', format)
    }
    
    return url.toString()
  } catch (error) {
    console.warn('Failed to optimize image URL:', error)
    return originalUrl
  }
}

/**
 * Preload critical images for performance
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload multiple images
 */
export async function preloadImages(urls: string[]): Promise<void> {
  const promises = urls.map(url => preloadImage(url))
  await Promise.allSettled(promises)
}

/**
 * Generate blur placeholder from image URL
 * This is a simple implementation - in production you might want to
 * generate actual blur data URLs from the images
 */
export function getBlurPlaceholder(imageUrl?: string): string {
  return BLUR_PLACEHOLDER
}

/**
 * Check if image URL is valid and accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}