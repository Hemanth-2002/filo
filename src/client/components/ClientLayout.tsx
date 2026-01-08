import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/common/Sidebar'
import { mockUser } from '@/data/mockData'
import { storageUtils } from '@/utils/storage'
import type { Request } from '@/types'

export function ClientLayout() {
  const location = useLocation()
  const [requests, setRequests] = useState<Request[]>([])
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  const loadRequests = () => {
    // Load requests from localStorage
    const loadedRequests = storageUtils.getRequests()
    // Sort by creation date (newest first)
    const sortedRequests = loadedRequests.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setRequests(sortedRequests)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  // Refresh requests when location changes (e.g., after creating a new request)
  useEffect(() => {
    loadRequests()
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        user={mockUser}
        requests={requests}
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
