import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const YOUTUBE_REGEX = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+$/

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

    if (!isAuthenticated) {
      // Navigate to login page with the current URL as state
      navigate('/login', { state: { from: '/enter-details', url } })
      return
    }

    navigate('/enter-details', { state: { url } })
  }

  return (
    <div
      style={{
        minWidth: '100vw',
        minHeight: '100vh',
        background: '#141414',
        margin: 0,
        padding: 0,
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Background blur effect - bottom right ellipse */}
      <div
        style={{
          position: 'absolute',
          width: '840px',
          height: '772px',
          background: '#7C6B6B',
          borderRadius: '50%',
          filter: 'blur(900px)',
          right: '-700px',
          bottom: '-900px',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Main content container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1440px',
          height: '100%',
          margin: '0 auto',
          padding: '0 20px',
          zIndex: 2,
        }}
      >
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
          }}
        />

        {/* Headline and tagline */}
        <div
          style={{
            position: 'absolute',
            top: '210px',
            left: 0,
            width: '100%',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontFamily: 'Alfa Slab One, serif',
              fontSize: '150px',
              fontWeight: 'normal',
              color: '#DFD0B8',
              lineHeight: '1.1',
              letterSpacing: '0',
              textAlign: 'left',
              paddingLeft: '178px',
              margin: 0,
            }}
          >
            Feeling Bored
          </h1>
          <p
            style={{
              fontFamily: 'Lora, serif',
              fontWeight: '400',
              fontSize: '36px',
              color: '#DFD0B8',
              opacity: '0.6',
              margin: 0,
              textAlign: 'left',
              paddingLeft: '178px',
            }}
          >
            Discover videos worth your time
          </p>
        </div>

        {/* Input group */}
        <div
          style={{
            position: 'absolute',
            top: '512px',
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <label
            htmlFor="youtube-url"
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '24px',
              color: '#DFD0B8',
              opacity: '0.6',
              marginBottom: '13px',
              textAlign: 'center',
              fontWeight: '400',
            }}
          >
            Paste YouTube URL here...
          </label>
          <input
            id="youtube-url"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={{
              width: '750px',
              height: '50px',
              borderRadius: '28px',
              border: '3px solid rgba(223, 208, 184, 0.6)',
              backgroundColor: '#1A1A1A',
              color: '#DFD0B8',
              fontSize: '20px',
              fontFamily: 'Lora, serif',
              textAlign: 'center',
              padding: '0 24px',
              marginBottom: '16px',
              outline: 'none',
            }}
            placeholder=""
          />
          {error && (
            <div
              style={{
                color: '#ff4d4f',
                fontFamily: 'Lora, serif',
                fontSize: 14,
                marginBottom: 12,
                fontWeight: '400',
                opacity: '0.75',
              }}
            >
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={handleAddVideo}
            style={{
              width: '200px',
              height: '65px',
              borderRadius: '30px',
              border: 'none',
              backgroundColor: '#DFD0B8',
              color: 'rgba(20, 20, 20, 0.9)',
              fontSize: '24px',
              fontFamily: 'Lora, serif',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#C4B5A0'
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#DFD0B8'
            }}
          >
            Add Video
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home 