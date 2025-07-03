import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage helpers
export const getImageUrl = (path: string) => {
  if (!path) return null
  if (path.startsWith('http')) return path // External URLs
  return supabase.storage.from('puzzle-media').getPublicUrl(path).data.publicUrl
}

export const uploadImage = async (file: File, folder: string = 'puzzles') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('puzzle-media')
    .upload(fileName, file)
  
  if (error) throw error
  return data.path
}

// Database helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', user.id)
    .single()
  
  return profile
}

try {
  // fetch puzzles
} catch (error) {
  console.error("[ Server ] Error fetching puzzles:", error); // Should log the real error
}

// Add this function to your existing supabase.ts file

export const getPuzzleWithAggregates = async (puzzleId: string) => {
  const [puzzleResult, aggregatesResult] = await Promise.all([
    supabase
      .from('puzzles')
      .select(`
        *,
        brand:brands(*),
        tags:puzzle_tags(tag:tags(*))
      `)
      .eq('id', puzzleId)
      .eq('approval_status', 'approved')
      .single(),
    
    supabase
      .from('puzzle_aggregates')
      .select('*')
      .eq('id', puzzleId)
      .single()
  ])

  if (puzzleResult.error) throw puzzleResult.error

  const puzzle = puzzleResult.data
  const aggregates = aggregatesResult.data

  return {
    ...puzzle,
    tags: puzzle.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    aggregates
  }
}