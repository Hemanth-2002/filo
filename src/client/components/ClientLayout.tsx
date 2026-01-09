import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/common/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Conversation, User } from '@/types'

export function ClientLayout() {
  const location = useLocation()
  const { userProfile, user, loading } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  // Default user data if profile is not loaded yet
  const defaultUser: User = {
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    companyName: 'N/A',
    gstin: 'N/A',
  }

  const loadConversations = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
      } else {
        setConversations(data || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadConversations()
    }
  }, [user?.id])

  // Refresh conversations when location changes (e.g., after creating a new conversation)
  useEffect(() => {
    if (user?.id) {
      loadConversations()
    }
  }, [location.pathname, user?.id])

  // Only show loading if auth is still loading (not profile)
  // Profile can load in the background
  if (loading && !user) {
    return (
      <div className="flex h-screen overflow-hidden items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        user={userProfile || defaultUser}
        conversations={conversations}
        collapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
      />
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="flex justify-center w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
