import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronDown, FileText, FileStack, PanelRightOpen, PanelRightClose, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { User as UserType, Conversation } from '@/types'

interface SidebarProps {
  user: UserType
  conversations: Conversation[]
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ user, conversations, collapsed = false, onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, user: authUser } = useAuth()
  const [isConversationsOpen, setIsConversationsOpen] = useState(true)

  // Get conversation title from first user message
  const getConversationTitle = (conversation: Conversation): string => {
    const firstUserMessage = conversation.messages.find((msg) => msg.role === 'user')
    if (firstUserMessage) {
      const preview = firstUserMessage.content
      return preview.length > 30 ? `${preview.substring(0, 30)}...` : preview
    }
    return 'New conversation'
  }


  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  if (collapsed) {
    return (
      <div className="w-[52px] h-screen bg-[#FAFAFA] border-r border-[rgba(0,0,0,0.1)] flex flex-col">
        {/* Logo */}
        <div className="h-[64px] border-b border-[rgba(0,0,0,0.1)] flex items-center justify-center flex-shrink-0">
          <img src="/filo_logo.svg" alt="Filo" className="w-8 h-8" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto flex flex-col items-center">
          <Link
            to="/client/new-request"
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
              location.pathname === '/client/new-request'
                ? 'bg-[#EFF6FF] text-[#2563EB]'
                : 'text-[#71717A] hover:bg-[#F3F3F5]'
            )}
          title="New Request"
          >
            <FileText className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsConversationsOpen(!isConversationsOpen)}
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
              'text-[#71717A] hover:bg-[#F3F3F5]'
            )}
            title="My Chats"
          >
            <FileStack className="w-5 h-5" />
          </button>
        </nav>

        {/* Toggle Button */}
        {onToggleCollapse && (
          <div className="h-[64px] border-t border-[rgba(0,0,0,0.1)] flex items-center justify-center flex-shrink-0">
            <button
              onClick={onToggleCollapse}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#71717A] hover:bg-[#F3F3F5] transition-colors"
              title="Expand sidebar"
            >
              <PanelRightOpen className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className="h-[64px] border-t border-[rgba(0,0,0,0.1)] flex items-center justify-center flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#71717A] hover:bg-[#F3F3F5] transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-[rgba(0,0,0,0.1)] flex flex-col">
      {/* Logo */}
      <div className="h-[64px] px-6 border-b border-[rgba(0,0,0,0.1)] flex items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <img src="/logo_with_text.svg" alt="Filo" className="h-6" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/client/new-request"
          className={cn(
            'flex items-center justify-between p-3 rounded-lg transition-colors',
            location.pathname === '/client/new-request'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            <span>Create New Request</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Link>

        <div>
          <button
            onClick={() => setIsConversationsOpen(!isConversationsOpen)}
            className="w-full flex items-center justify-between p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileStack className="w-5 h-5" />
              <span>My Chats</span>
            </div>
            {isConversationsOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isConversationsOpen && (
            <div className="ml-8 mt-2 space-y-1">
              {conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">No conversations yet</p>
              ) : (
                conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    to={`/client/chat/${conversation.id}`}
                    className={cn(
                      'block p-2 rounded-lg text-sm transition-colors truncate',
                      location.pathname === `/client/chat/${conversation.id}`
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                    title={getConversationTitle(conversation)}
                  >
                    {getConversationTitle(conversation)}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Toggle Button */}
      {onToggleCollapse && (
        <div className="h-[64px] px-4 border-t border-[rgba(0,0,0,0.1)] flex items-center flex-shrink-0">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Collapse sidebar"
          >
            <PanelRightClose className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* User Profile */}
      <div className="px-4 py-3 border-t border-[rgba(0,0,0,0.1)] flex-shrink-0">
        <div className="flex items-center gap-3 w-full mb-2">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

