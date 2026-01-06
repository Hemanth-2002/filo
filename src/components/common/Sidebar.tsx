import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronDown, FileText, FileStack, User } from 'lucide-react'
import type { User as UserType, Request } from '@/types'

interface SidebarProps {
  user: UserType
  requests: Request[]
}

export function Sidebar({ user, requests }: SidebarProps) {
  const location = useLocation()
  const [isRequestsOpen, setIsRequestsOpen] = useState(true)

  return (
    <div className="w-64 h-screen bg-white border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
          <span className="text-xl font-bold">Filo</span>
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

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
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
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

