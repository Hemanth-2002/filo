import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Plus, Folder } from 'lucide-react'
import { QuickActionCard } from '@/components/common/QuickActionCard'
import { TaskCard } from '@/components/common/TaskCard'
import { RequestCard } from '@/components/common/RequestCard'
import { mockUser, mockTasks } from '@/data/mockData'
import { storageUtils } from '@/utils/storage'
import type { Request } from '@/types'

export function ClientDashboard() {
  const navigate = useNavigate()
  const [recentRequests, setRecentRequests] = useState<Request[]>([])

  useEffect(() => {
    // Load recent requests (last 5)
    const allRequests = storageUtils.getRequests()
    const sorted = allRequests
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    setRecentRequests(sorted)
  }, [])

  const handleNewRequest = () => {
    navigate('/client/new-request')
  }

  const handleMyDocuments = () => {
    // TODO: Navigate to documents page
    console.log('View documents')
  }

  const handleTaskClick = (taskId: string) => {
    // TODO: Navigate to task detail page
    console.log('View task:', taskId)
  }

  const handleRequestClick = (requestId: string) => {
    navigate(`/client/request/${requestId}`)
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb and Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Welcome, {mockUser.companyName}</h1>
          <p className="text-muted-foreground mt-1">GSTIN: {mockUser.gstin}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            title="New Request"
            description="Ask a question or start a filing"
            icon={Plus}
            onClick={handleNewRequest}
          />
          <QuickActionCard
            title="My Documents"
            description="View uploaded files"
            icon={Folder}
            onClick={handleMyDocuments}
          />
        </div>
      </div>

      {/* My Requests */}
      {recentRequests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Requests</h2>
            <button
              onClick={() => navigate('/client/new-request')}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => handleRequestClick(request.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Your Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <div className="grid grid-cols-1 gap-4">
          {mockTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
