import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { uploadMultipleFiles } from '@/lib/storage'
import { logger } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const folder = formData.get('folder') as string || 'puzzle-logs'
    
    // Extract files from form data
    const files: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    logger.info(`📸 Uploading ${files.length} files for user ${userId}`)

    // Upload files using server-side storage utilities
    const uploadResults = await uploadMultipleFiles(files, folder)
    
    // Extract public URLs from results
    const urls = uploadResults.map(result => result.publicUrl)

    logger.info(`✅ Successfully uploaded ${urls.length} photos`)
    
    return NextResponse.json({ 
      success: true, 
      urls,
      count: urls.length 
    })

  } catch (error) {
    logger.error('Error uploading photos:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload photos' },
      { status: 500 }
    )
  }
} 