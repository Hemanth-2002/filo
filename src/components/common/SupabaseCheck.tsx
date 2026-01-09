import { Navigate, useLocation } from 'react-router-dom'

export function SupabaseCheck({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  // Check if Supabase credentials are invalid or missing
  const hasInvalidCredentials = !supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.trim() === '' || supabaseAnonKey.trim() === ''

  // If credentials are invalid and we're not on the login/signup pages, redirect to login
  if (hasInvalidCredentials) {
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      return <Navigate to="/login" replace />
    }
  }

  return <>{children}</>
}

