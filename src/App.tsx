import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import EnterDetails from './pages/EnterDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Previews from './pages/Previews'
import Discover from './pages/Discover'
import About from './pages/About'
import ListView from './pages/ListView'
import ProfileRouter from './components/ProfileRouter'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
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
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
