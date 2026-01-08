import { useNavigate } from 'react-router-dom'
import { Home, MessageSquarePlus, FileText } from 'lucide-react'
import { QuickActionCard } from '@/components/common/QuickActionCard'
import { TaskCard } from '@/components/common/TaskCard'
import { mockUser, mockTasks } from '@/data/mockData'

export function ClientDashboard() {
  const navigate = useNavigate()

  const handleNewRequest = () => {
    navigate('/client/new-request')
  }

  const handleMyDocuments = () => {
    navigate('/client/documents')
  }

  const handleTaskClick = (taskId: string) => {
    // TODO: Navigate to task detail page
    console.log('View task:', taskId)
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
            Welcome, {mockUser.companyName}
          </h1>
          <p className="text-sm font-normal text-[#64748B]">GSTIN: {mockUser.gstin}</p>
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

        {/* Your Tasks */}
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-base font-semibold text-[rgba(0,0,0,0.65)]">Your Tasks</h2>
          <div className="flex flex-col gap-6 w-full">
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
    </div>
  )
}
