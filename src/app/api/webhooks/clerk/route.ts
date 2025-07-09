import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: NextRequest) {
  // Get the headers
  const headersList = await headers()
  const svix_id = headersList.get('svix-id')
  const svix_timestamp = headersList.get('svix-timestamp')
  const svix_signature = headersList.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    try {
      const { id, email_addresses, first_name, last_name, image_url, username } = evt.data

      // Create user in Supabase
      const { error } = await supabase
        .from('users')
        .insert({
          clerk_id: id,
          email: email_addresses[0]?.email_address || '',
          username: username || `${first_name || ''} ${last_name || ''}`.trim() || email_addresses[0]?.email_address?.split('@')[0] || 'User',
          avatar_url: image_url || null,
        })

      if (error) {
        console.error('Error creating user in Supabase:', error)
        return new Response('Error creating user', { status: 500 })
      }

      console.log('User created successfully:', id)
    } catch (error) {
      console.error('Error processing user.created webhook:', error)
      return new Response('Error processing webhook', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    try {
      const { id, email_addresses, first_name, last_name, image_url, username } = evt.data

      // Update user in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          email: email_addresses[0]?.email_address || '',
          username: username || `${first_name || ''} ${last_name || ''}`.trim() || email_addresses[0]?.email_address?.split('@')[0] || 'User',
          avatar_url: image_url || null,
        })
        .eq('clerk_id', id)

      if (error) {
        console.error('Error updating user in Supabase:', error)
        return new Response('Error updating user', { status: 500 })
      }

      console.log('User updated successfully:', id)
    } catch (error) {
      console.error('Error processing user.updated webhook:', error)
      return new Response('Error processing webhook', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    try {
      const { id } = evt.data

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', id)

      if (error) {
        console.error('Error deleting user in Supabase:', error)
        return new Response('Error deleting user', { status: 500 })
      }

      console.log('User deleted successfully:', id)
    } catch (error) {
      console.error('Error processing user.deleted webhook:', error)
      return new Response('Error processing webhook', { status: 500 })
    }
  }

  return new Response('', { status: 200 })
} 