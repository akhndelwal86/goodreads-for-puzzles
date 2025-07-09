import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()

    // Get user data from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, avatar_url')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      console.error('Error fetching user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse form data
    const formData = await request.formData()
    const text = formData.get('text') as string
    
    // Process uploaded images first to check if we have content
    const imageEntries = Array.from(formData.entries()).filter(([key]) => key.startsWith('image_'))

    // Validate that we have either text or images
    if ((!text || text.trim().length === 0) && imageEntries.length === 0) {
      return NextResponse.json({ error: 'Post must contain either text or images' }, { status: 400 })
    }

    if (text.length > 500) {
      return NextResponse.json({ error: 'Post text exceeds 500 characters' }, { status: 400 })
    }

    // Process uploaded images
    const uploadedImages: string[] = []

    if (imageEntries.length > 4) {
      return NextResponse.json({ error: 'Maximum 4 images allowed' }, { status: 400 })
    }

    // Upload images to Supabase Storage
    for (const [key, file] of imageEntries) {
      if (!(file instanceof File)) continue

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json({ 
          error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
        }, { status: 400 })
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          error: `File size exceeds 5MB limit: ${file.name}` 
        }, { status: 400 })
      }

      try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `posts/${userData.id}/${fileName}`

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('puzzle-media')
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('puzzle-media')
          .getPublicUrl(filePath)

        uploadedImages.push(publicUrl)

      } catch (error) {
        console.error('Error processing image:', error)
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
      }
    }

    // Create feed item record
    const feedItemData = {
      user_id: userData.id,
      type: 'post',
      text: text.trim(),
      image_url: uploadedImages[0] || null, // Primary image
      media_urls: uploadedImages.length > 0 ? uploadedImages : null, // All images as JSON
      created_at: new Date().toISOString()
    }

    const { data: feedItem, error: feedError } = await supabase
      .from('feed_items')
      .insert(feedItemData)
      .select()
      .single()

    if (feedError) {
      console.error('Error creating feed item:', feedError)
      return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    // Return success response with post data
    const postResponse = {
      id: feedItem.id,
      text: feedItem.text,
      image_urls: uploadedImages,
      user: {
        id: userData.id,
        name: userData.username,
        avatar: userData.avatar_url
      },
      created_at: feedItem.created_at,
      type: 'post'
    }

    return NextResponse.json({ 
      success: true, 
      post: postResponse 
    }, { status: 201 })

  } catch (error) {
    console.error('Error in posts API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 