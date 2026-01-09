import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, MessageSquarePlus, FileText } from 'lucide-react'
import { QuickActionCard } from '@/components/common/QuickActionCard'
import { ConversationCard } from '@/components/common/ConversationCard'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Conversation } from '@/types'

export function ClientDashboard() {
  const navigate = useNavigate()
  const { user, userProfile } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchConversations()
    }
  }, [user?.id])

  const fetchConversations = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const handleNewRequest = () => {
    navigate('/client/new-request')
  }

  const handleMyDocuments = () => {
    navigate('/client/documents')
  }

  const handleConversationClick = (conversationId: string) => {
    navigate(`/client/chat/${conversationId}`)
  }

  return (
    <div className="flex flex-col items-center gap-14 py-8 px-12 w-full max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 w-full">
        <Home className="w-4 h-4 text-[rgba(0,0,0,0.45)]" />
        <div className="flex items-center justify-center gap-2.5">
          <span className="text-sm font-medium text-[#0A0A0A]">Home</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col items-center gap-12 w-full">
        {/* Welcome Section */}
        <div className="flex flex-col gap-1.5 w-full">
          <h1 className="text-lg font-bold text-[#0F172A] leading-[1.56em]">
            Welcome, {userProfile?.companyName || userProfile?.name || 'User'}
          </h1>
          {userProfile?.gstin && userProfile.gstin !== 'N/A' && (
            <p className="text-sm font-normal text-[#64748B]">GSTIN: {userProfile.gstin}</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-base font-semibold text-[rgba(0,0,0,0.65)]">Quick Actions</h2>
          <div className="flex items-stretch gap-3 w-full">
            <QuickActionCard
              title="New Request"
              description="Ask a question or start a filing"
              icon={MessageSquarePlus}
              onClick={handleNewRequest}
              className="flex-1"
            />
            <QuickActionCard
              title="My Documents"
              description="View uploaded files"
              icon={FileText}
              onClick={handleMyDocuments}
              className="flex-1"
            />
          </div>
        </div>

        {/* Your Chats */}
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-base font-semibold text-[rgba(0,0,0,0.65)]">Your Chats</h2>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No conversations yet. Start a new chat to get started!
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  onClick={() => handleConversationClick(conversation.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
