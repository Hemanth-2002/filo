import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create client with empty strings if env vars are missing (will fail gracefully on API calls)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log warning if env vars are missing (but don't throw to prevent app from loading)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables. Please check your .env file.')
  console.warn('Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

