import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface LocationState {
  submittedVideoUrl?: string
  videoTitle?: string
}

const Previews: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState

  // Extract YouTube video ID from URL
  const getVideoId = (url: string) => {
    const match = url.match(/v=([\w-]+)/)
    return match ? match[1] : null
  }

  // Example data, replace with your actual video data
  const video = {
    thumbnail: 'https://img.youtube.com/vi/your_video_id/maxresdefault.jpg',
    title: 'JUST BUSINESS, DARLING.',
    year: 2025,
    genre: 'sci-fi',
    rating: 4.8,
    submitter: '@naanroti',
  };

  return (
    
    <div style={{ minHeight: '100vh', background: '#141414', color: '#DFD0B8' }}>
      {/* Header */}
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
      <div style={{
        width: '100%',
        background: '#181818',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '97px',
      }}>
        
        {/* Nav */}
        <div style={{
          display: 'flex',
          gap: '15px',
          fontFamily: 'Lora, serif',
          fontSize: '24px',
          fontWeight: 700,
          marginLeft: '983px',
        }}>
          <span style={{ opacity: 0.6, cursor: 'pointer' }} onClick={() => navigate('/home')}>HOME</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/discover')}>DISCOVER</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/profile')}>PROFILE</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/about')}>ABOUT</span>
        </div>
      </div>

      {/* Main Preview Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 97px)',
        padding: '0 0 0 0',
        position: 'relative',
      }}>
        {/* Video Thumbnail with Overlayed Text */}
        <div style={{
          position: 'relative',
          width: '1448px',
          height: '927px',
          maxWidth: '100%',
        }}>
          {/* Add to List Button */}
          <button
            aria-label="Add to list"
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              borderRadius: '55px',
              width: '75px',
              height: '56px',
              background: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              cursor: 'pointer',
              zIndex: 3,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 6.25V23.75M6.25 15H23.75" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <img
            src={video.thumbnail}
            alt="Video Thumbnail"
            width={1448}
            height={927}
            style={{
              width: '1448px',
              height: '927px',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              objectFit: 'cover',
              maxWidth: '100%',
              display: 'block',
            }}
          />
          {/* Overlayed Text */}
          <div style={{
            position: 'absolute',
            left: '60px',
            top: '760px',
            color: '#DFD0B8',
            zIndex: 2,
            width: '1330px',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          }}>
            <h1 style={{
              fontFamily: 'Bellefair, serif',
              fontSize: '75px',
              fontWeight: 400,
              margin: 0,
            }}>
              {video.title}
            </h1>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'Lora, serif',
              fontWeight: 400,
              fontSize: '20px',
              marginTop: '5px',
              width: '100%',
            }}>
              <div>{video.year} • {video.genre} • {video.rating}</div>
              <div>submitted via <span style={{ fontWeight: 700 }}>{video.submitter}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Previews 