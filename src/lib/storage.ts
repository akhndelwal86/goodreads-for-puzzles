import { createServiceClient } from './supabase'
import { logger } from './utils'

// ============================
// STORAGE CONFIGURATION
// ============================

export const STORAGE_BUCKETS = {
  PUZZLE_PHOTOS: 'puzzle-photos',
  PROFILE_PHOTOS: 'profile-photos'
} as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// ============================
// PHOTO UPLOAD FUNCTIONS
// ============================

export type UploadResult = {
  url: string
  path: string
  publicUrl: string
}

/**
 * Validate file before upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    }
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} not allowed. Use JPG, PNG, or WebP.` 
    }
  }

  return { valid: true }
}

/**
 * Generate unique file path
 */
export const generateFilePath = (
  userId: string, 
  fileName: string, 
  folder: 'puzzles' | 'profiles' = 'puzzles'
): string => {
  const timestamp = Date.now()
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg'
  const sanitizedName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
  
  return `${folder}/${userId}/${timestamp}_${sanitizedName}`
}

/**
 * Upload file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  userId: string,
  folder: 'puzzles' | 'profiles' = 'puzzles'
): Promise<UploadResult> => {
  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const supabase = createServiceClient()
    
    // Generate unique file path
    const filePath = generateFilePath(userId, file.name, folder)
    
    // Determine bucket
    const bucket = folder === 'puzzles' ? STORAGE_BUCKETS.PUZZLE_PHOTOS : STORAGE_BUCKETS.PROFILE_PHOTOS
    
    logger.debug('Uploading file:', { filePath, bucket, size: file.size })

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // Don't overwrite existing files
      })

    if (error) {
      logger.error('Storage upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    if (!publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    logger.success('File uploaded successfully:', filePath)

    return {
      url: publicUrlData.publicUrl,
      path: filePath,
      publicUrl: publicUrlData.publicUrl
    }

  } catch (error) {
    logger.error('Error uploading file:', error)
    throw error
  }
}

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (
  files: File[],
  userId: string,
  folder: 'puzzles' | 'profiles' = 'puzzles'
): Promise<UploadResult[]> => {
  try {
    logger.debug('Uploading multiple files:', files.length)

    const uploadPromises = files.map(file => uploadFile(file, userId, folder))
    const results = await Promise.allSettled(uploadPromises)

    const successfulUploads: UploadResult[] = []
    const errors: string[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulUploads.push(result.value)
      } else {
        errors.push(`File ${index + 1}: ${result.reason.message}`)
      }
    })

    if (errors.length > 0) {
      logger.warning('Some uploads failed:', errors)
    }

    logger.success(`Successfully uploaded ${successfulUploads.length}/${files.length} files`)
    return successfulUploads

  } catch (error) {
    logger.error('Error uploading multiple files:', error)
    throw error
  }
}

/**
 * Delete file from storage
 */
export const deleteFile = async (
  filePath: string,
  folder: 'puzzles' | 'profiles' = 'puzzles'
): Promise<boolean> => {
  try {
    const supabase = createServiceClient()
    const bucket = folder === 'puzzles' ? STORAGE_BUCKETS.PUZZLE_PHOTOS : STORAGE_BUCKETS.PROFILE_PHOTOS

    logger.debug('Deleting file:', { filePath, bucket })

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      logger.error('Storage delete error:', error)
      return false
    }

    logger.success('File deleted successfully:', filePath)
    return true

  } catch (error) {
    logger.error('Error deleting file:', error)
    return false
  }
}

/**
 * Delete multiple files
 */
export const deleteMultipleFiles = async (
  filePaths: string[],
  folder: 'puzzles' | 'profiles' = 'puzzles'
): Promise<{ success: string[]; failed: string[] }> => {
  try {
    const supabase = createServiceClient()
    const bucket = folder === 'puzzles' ? STORAGE_BUCKETS.PUZZLE_PHOTOS : STORAGE_BUCKETS.PROFILE_PHOTOS

    logger.debug('Deleting multiple files:', filePaths.length)

    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(filePaths)

    if (error) {
      logger.error('Storage delete error:', error)
      return { success: [], failed: filePaths }
    }

    const deletedFiles = data || []
    const success = deletedFiles.map(file => file.name)
    const failed = filePaths.filter(path => !success.includes(path))

    logger.success(`Deleted ${success.length}/${filePaths.length} files`)
    return { success, failed }

  } catch (error) {
    logger.error('Error deleting multiple files:', error)
    return { success: [], failed: filePaths }
  }
}

/**
 * Get file info from URL
 */
export const getFilePathFromUrl = (url: string): string | null => {
  try {
    // Extract the file path from the public URL
    const urlParts = url.split('/storage/v1/object/public/')
    if (urlParts.length !== 2) return null
    
    const [, pathWithBucket] = urlParts
    const pathParts = pathWithBucket.split('/')
    if (pathParts.length < 2) return null
    
    // Remove bucket name and return the file path
    const [, ...pathSegments] = pathParts
    return pathSegments.join('/')
  } catch (error) {
    logger.error('Error extracting file path from URL:', error)
    return null
  }
}

/**
 * Resize image (client-side using Canvas API)
 */
export const resizeImage = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            reject(new Error('Canvas toBlob failed'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Image load failed'))
    img.src = URL.createObjectURL(file)
  })
}

// ============================
// PUZZLE PHOTO UTILITIES
// ============================

/**
 * Upload puzzle photos with automatic resizing
 */
export const uploadPuzzlePhotos = async (
  files: File[],
  userId: string,
  resize: boolean = true
): Promise<UploadResult[]> => {
  try {
    logger.debug('Uploading puzzle photos:', files.length)

    // Optionally resize images before upload
    const processedFiles = resize 
      ? await Promise.all(files.map(file => resizeImage(file)))
      : files

    return await uploadMultipleFiles(processedFiles, userId, 'puzzles')

  } catch (error) {
    logger.error('Error uploading puzzle photos:', error)
    throw error
  }
}

/**
 * Clean up old photos when updating puzzle log
 */
export const cleanupOldPhotos = async (
  oldUrls: string[],
  newUrls: string[]
): Promise<void> => {
  try {
    // Find URLs that are no longer needed
    const urlsToDelete = oldUrls.filter(oldUrl => !newUrls.includes(oldUrl))
    
    if (urlsToDelete.length === 0) return

    // Extract file paths and delete
    const pathsToDelete = urlsToDelete
      .map(url => getFilePathFromUrl(url))
      .filter(path => path !== null) as string[]

    if (pathsToDelete.length > 0) {
      await deleteMultipleFiles(pathsToDelete, 'puzzles')
    }

  } catch (error) {
    logger.error('Error cleaning up old photos:', error)
    // Don't throw - this is a cleanup operation
  }
}

/**
 * Upload photos for puzzle logging (client-side version)
 * This calls an API endpoint to handle the actual upload server-side
 */
export const uploadPhotos = async (
  files: File[],
  folder: string = 'puzzle-logs'
): Promise<string[]> => {
  try {
    if (files.length === 0) return []

    // Create FormData to send files to API
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file)
    })
    formData.append('folder', folder)

    // Call API endpoint to handle upload server-side
    const response = await fetch('/api/upload-photos', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload photos')
    }

    const { urls } = await response.json()
    return urls
  } catch (error) {
    logger.error('Error uploading photos:', error)
    throw error
  }
} 