import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClientLayout } from '@/client/components/ClientLayout'
import { ClientDashboard } from '@/client/pages/ClientDashboard'
import { ClientProfile } from '@/client/pages/ClientProfile'
import { ClientDocuments } from '@/client/pages/ClientDocuments'
import { CreateNewRequest } from '@/client/pages/CreateNewRequest'
import { RequestDetail } from '@/client/pages/RequestDetail'
import { Login } from '@/pages/Login'
import { SignUp } from '@/pages/SignUp'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { PublicRoute } from '@/components/common/PublicRoute'
import { SupabaseCheck } from '@/components/common/SupabaseCheck'

function App() {
  return (
    <BrowserRouter>
      <SupabaseCheck>
      <Routes>
        {/* Auth Routes - Redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* Protected Client Routes */}
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/client/dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="new-request" element={<CreateNewRequest />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="documents" element={<ClientDocuments />} />
        </Route>

        {/* Request Detail / Chat - Full screen layout */}
        <Route
          path="/client/request/:id"
          element={
            <ProtectedRoute>
              <RequestDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/chat/:id"
          element={
            <ProtectedRoute>
              <RequestDetail />
            </ProtectedRoute>
          }
        />

        {/* CA Routes - Placeholder for future */}
        <Route path="/ca" element={<div>CA Routes - Coming Soon</div>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      </SupabaseCheck>
    </BrowserRouter>
  )
}

export default App
