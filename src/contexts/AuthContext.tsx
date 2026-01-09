import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { User as UserType } from '@/types'

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: UserType | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: SignUpData) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

interface SignUpData {
  phone: string
  name: string
  state: string
  gstin?: string
  business_type?: string
  turnover?: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserType | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, gstin, business_type')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      if (data) {
        return {
          name: data.name || '',
          email: data.email || '',
          companyName: data.business_type || 'N/A',
          gstin: data.gstin || 'N/A',
        } as UserType
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  useEffect(() => {
    let mounted = true
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    // If Supabase credentials are missing or invalid, skip auth and set loading to false
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl.trim() === '' || supabaseAnonKey.trim() === '') {
      console.warn('Supabase credentials missing or invalid - skipping authentication')
      setLoading(false)
      setUser(null)
      setSession(null)
      setUserProfile(null)
      return
    }

    // Set a timeout to prevent infinite loading (reduced to 2 seconds)
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Session check timed out - setting loading to false')
        setLoading(false)
      }
    }, 2000) // 2 second timeout

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      clearTimeout(timeoutId)
      if (!mounted) return

      if (error) {
        console.error('Error getting session:', error)
        setLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)
      
      // Set loading to false immediately after getting session
      // Fetch profile in the background (non-blocking)
      if (mounted) {
        setLoading(false)
      }
      
      // Fetch profile asynchronously (don't block UI)
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (mounted) {
            setUserProfile(profile)
          }
        }).catch((error) => {
          console.error('Error fetching user profile:', error)
          if (mounted) {
            setUserProfile(null)
          }
        })
      } else {
        setUserProfile(null)
      }
    }).catch((error) => {
      clearTimeout(timeoutId)
      console.error('Error in getSession:', error)
      if (mounted) {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)
      
      // Set loading to false immediately
      if (mounted) {
        setLoading(false)
      }
      
      // Fetch profile asynchronously (don't block UI)
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (mounted) {
            setUserProfile(profile)
          }
        }).catch((error) => {
          console.error('Error fetching user profile:', error)
          if (mounted) {
            setUserProfile(null)
          }
        })
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        return { error: authError }
      }

      if (authData.user) {
        // Insert user data into the users table
        // Note: Password is stored here because the schema requires it, but authentication
        // is handled by Supabase Auth. Consider making the password field nullable or
        // removing it from the users table in the future for better security.
        const { error: dbError } = await supabase.from('users').insert({
          id: authData.user.id,
          email,
          password, // Required by schema, but Supabase Auth handles actual authentication
          phone: userData.phone,
          name: userData.name,
          state: userData.state,
          gstin: userData.gstin || null,
          business_type: userData.business_type || null,
          turnover: userData.turnover || null,
        })

        if (dbError) {
          // If user creation in DB fails, we should clean up the auth user
          // For now, just return the error
          return { error: dbError }
        }

        // Fetch user profile after successful signup
        const profile = await fetchUserProfile(authData.user.id)
        setUserProfile(profile)
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

