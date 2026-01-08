import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronDown, FileText, FileStack, User, PanelRightOpen, PanelRightClose } from 'lucide-react'
import type { User as UserType, Request } from '@/types'

interface SidebarProps {
  user: UserType
  requests: Request[]
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ user, requests, collapsed = false, onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const [isRequestsOpen, setIsRequestsOpen] = useState(true)

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
            title="Create New Request"
          >
            <FileText className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsRequestsOpen(!isRequestsOpen)}
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
              'text-[#71717A] hover:bg-[#F3F3F5]'
            )}
            title="My Requests"
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
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </div>
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
            onClick={() => setIsRequestsOpen(!isRequestsOpen)}
            className="w-full flex items-center justify-between p-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileStack className="w-5 h-5" />
              <span>My Requests</span>
            </div>
            {isRequestsOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isRequestsOpen && (
            <div className="ml-8 mt-2 space-y-1">
              {requests.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">No requests yet</p>
              ) : (
                requests.map((request) => (
                  <Link
                    key={request.id}
                    to={`/client/request/${request.id}`}
                    className={cn(
                      'block p-2 rounded-lg text-sm transition-colors truncate',
                      location.pathname === `/client/request/${request.id}`
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                    title={request.title}
                  >
                    {request.title}
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
      <div className="h-[64px] px-4 border-t border-[rgba(0,0,0,0.1)] flex items-center flex-shrink-0">
        <div className="flex items-center gap-3 w-full">
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
          <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}

