import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import EnterDetails from './pages/EnterDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Previews from './pages/Previews'
import Discover from './pages/Discover'
import About from './pages/About'
import ListView from './pages/ListView'
import ProfileRouter from './components/ProfileRouter'
import Landing from './pages/Landing'
import Header from './components/Header'
import AddVideoModal from './components/AddVideoModal'
import { GoogleOAuthProvider } from '@react-oauth/google'

const queryClient = new QueryClient()

function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect logic for root
  if (!isLoading && location.pathname === '/') {
    if (isAuthenticated) {
      return <Navigate to="/discover" replace />
    }
  }

  // Handler for AddVideoModal submit
  const handleAddVideo = (url: string) => {
    setAddModalOpen(false)
    navigate('/enter-details', { state: { url } })
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onAddVideo={isAuthenticated ? () => setAddModalOpen(true) : undefined}
      />
      <AddVideoModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddVideo}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/enter-details"
          element={
            <ProtectedRoute>
              <EnterDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Previews />
            </ProtectedRoute>
          }
        />
        <Route path="/discover" element={<Discover />} />
        <Route path="/about" element={<About />} />
        <Route path="/lists/:listId" element={<ListView />} />
        <Route path="/profile" element={<ProfileRouter />} />
        <Route path="/profile/:username" element={<ProfileRouter />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

export default App
