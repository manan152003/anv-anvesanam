import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const YOUTUBE_REGEX = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+/

const Home: React.FC = () => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleAddVideo = () => {
    if (!YOUTUBE_REGEX.test(url.trim())) {
      setError('Please enter a valid YouTube URL')
      return
    }
    setError('')

    // Clean the URL by removing any parameters after the video ID
    const cleanUrl = url.trim().split('&')[0]

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/enter-details', url: cleanUrl } })
      return
    }

    navigate('/enter-details', { state: { url: cleanUrl } })
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #141414 100%)',
      color: '#DFD0B8', 
      fontFamily: 'Lora, serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(223, 208, 184, 0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '20%',
        left: '5%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(223, 208, 184, 0.02) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      {/* Logo */}
      <img
        src="/logo.png"
        alt="Anv Logo"
        style={{
          position: 'absolute',
          left: '19px',
          top: '21px',
          width: 'auto',
          height: '60px',
          zIndex: 10,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      />

      {/* Main Content Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <h1 style={{
            fontFamily: 'Alfa Slab One, serif',
            fontSize: 'clamp(60px, 10vw, 150px)',
            fontWeight: 'normal',
            color: '#DFD0B8',
            lineHeight: '1.1',
            letterSpacing: '0',
            margin: '0 0 20px 0',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            Feeling Bored
          </h1>
          <p style={{
            fontFamily: 'Lora, serif',
            fontWeight: '400',
            fontSize: 'clamp(24px, 3vw, 36px)',
            color: '#DFD0B8',
            opacity: '0.6',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Discover videos worth your time
          </p>
        </div>

        {/* Input Card */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
          animation: 'slideUp 0.8s ease-out 0.3s both'
        }}>
          <label
            htmlFor="youtube-url"
            style={{
              display: 'block',
              fontFamily: 'Lora, serif',
              fontSize: '24px',
              color: '#DFD0B8',
              opacity: '0.6',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: '400',
            }}
          >
            Paste YouTube URL here...
          </label>
          <div style={{
            position: 'relative',
            marginBottom: '24px'
          }}>
            <input
              id="youtube-url"
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              style={{
                width: '100%',
                height: '60px',
                borderRadius: '16px',
                border: '1px solid rgba(223, 208, 184, 0.2)',
                backgroundColor: 'rgba(223, 208, 184, 0.05)',
                color: '#DFD0B8',
                fontSize: '18px',
                fontFamily: 'Lora, serif',
                padding: '0 24px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              onFocus={(e) => {
                e.currentTarget.style.border = '1px solid rgba(223, 208, 184, 0.4)'
                e.currentTarget.style.backgroundColor = 'rgba(223, 208, 184, 0.08)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = '1px solid rgba(223, 208, 184, 0.2)'
                e.currentTarget.style.backgroundColor = 'rgba(223, 208, 184, 0.05)'
              }}
            />
          </div>
          {error && (
            <div style={{
              color: '#ff4d4f',
              fontFamily: 'Lora, serif',
              fontSize: '14px',
              marginBottom: '20px',
              padding: '12px',
              background: 'rgba(255, 77, 79, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 77, 79, 0.2)',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={handleAddVideo}
            style={{
              width: '100%',
              height: '60px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #DFD0B8 0%, #C9B896 100%)',
              color: '#141414',
              fontSize: '20px',
              fontFamily: 'Lora, serif',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Add Video
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(60px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

export default Home 