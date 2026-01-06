import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClientLayout } from '@/client/components/ClientLayout'
import { ClientDashboard } from '@/client/pages/ClientDashboard'
import { ClientProfile } from '@/client/pages/ClientProfile'
import { ClientDocuments } from '@/client/pages/ClientDocuments'
import { ClientChat } from '@/client/pages/ClientChat'
import { CreateNewRequest } from '@/client/pages/CreateNewRequest'
import { RequestDetail } from '@/client/pages/RequestDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client Routes */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<Navigate to="/client/dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="new-request" element={<CreateNewRequest />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="documents" element={<ClientDocuments />} />
          <Route path="chat" element={<ClientChat />} />
        </Route>

        {/* Request Detail - Full screen layout */}
        <Route path="/client/request/:id" element={<RequestDetail />} />

        {/* CA Routes - Placeholder for future */}
        <Route path="/ca" element={<div>CA Routes - Coming Soon</div>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
