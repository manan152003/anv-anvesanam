import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getVideoById, getLatestSubmissionByVideoId } from '../services/videoService'
import { getUserById } from '../services/userService'
import { getCategoryById } from '../services/categoryService'
import AddToListModal from '../components/AddToListModal'
import { getYouTubeThumbnail } from '../utils/youtube'
import { useAuth } from '../context/AuthContext'

interface LocationState {
  videoId?: string
}

const Previews: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [year, setYear] = useState('')
  const [username, setUsername] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true)
      setError('')
      try {
        let data
        if (location.state?.videoId) {
          data = await getVideoById(location.state.videoId)
        } else {
          // Fetch all videos and pick a random one
          const res = await fetch(`${import.meta.env.VITE_API_URL}/videos`)
          if (!res.ok) throw new Error('Failed to fetch videos')
          const videos = await res.json()
          if (!videos.length) throw new Error('No videos found')
          data = videos[Math.floor(Math.random() * videos.length)]
        }
        setVideo(data)
        // Fetch latest submission and category name, and username
        try {
          const submission = await getLatestSubmissionByVideoId(data._id)
          if (submission && submission.categoryId) {
            if (typeof submission.categoryId === 'object' && submission.categoryId.name) {
              setCategory(submission.categoryId.name)
            } else {
              const cat = await getCategoryById(submission.categoryId)
              setCategory(cat.name || '')
            }
          } else {
            setCategory('')
          }
          // Set username from latest submission
          if (submission && submission.userId && submission.userId.username) {
            setUsername(`@${submission.userId.username}`)
          } else {
            setUsername('@unknown')
          }
        } catch {
          setCategory('')
          setUsername('@unknown')
        }
        if (data.uploadDate_youtube) {
          setYear(new Date(data.uploadDate_youtube).getFullYear().toString());
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load video')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
    // eslint-disable-next-line
  }, [location.state?.videoId, navigate])

  useEffect(() => {
    const loadThumbnail = async () => {
      if (!video) return;
      const videoId = video.youtubeVideoId;
      if (!videoId) return;
      try {
        const url = await getYouTubeThumbnail(videoId);
        setThumbnailUrl(url);
      } catch (error) {
        console.error('Error loading thumbnail:', error);
        setThumbnailUrl('/logo.png');
      }
    };
    loadThumbnail();
  }, [video]);

  // Helper to get video thumbnail
  const getThumbnail = (video: any) => {
    if (!video) return '/logo.png';
    return video.thumbnailUrl_youtube || '/logo.png';
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #141414 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #DFD0B8',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ 
            color: '#DFD0B8', 
            fontFamily: 'Lora, serif', 
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '0.5px'
          }}>
            Loading experience...
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #141414 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(223, 208, 184, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(223, 208, 184, 0.1)'
        }}>
          <div style={{ 
            color: '#ff6b6b', 
            fontFamily: 'Lora, serif', 
            fontSize: '24px',
            marginBottom: '10px'
          }}>
            {error || 'Video not found'}
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #DFD0B8 0%, #C9B896 100%)',
              color: '#141414',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontFamily: 'Lora, serif',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    )
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

      {/* Header */}
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
        background: '#141414',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '97px',
        position: 'relative',
        zIndex: 5
      }}>
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

      {/* Main Content Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 97px)',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Enhanced Video Card */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1400px',
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
          transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          animation: 'slideUp 0.8s ease-out'
        }}>
          {/* Video Image Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden'
          }}>
            {/* Floating Action Button */}
            <button
              aria-label="Add to list"
              style={{
                position: 'absolute',
                top: '30px',
                right: '30px',
                borderRadius: '50%',
                width: '70px',
                height: '70px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                zIndex: 4,
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: 'scale(0.9)',
                opacity: imageLoaded ? 1 : 0
              }}
              onClick={() => setIsAddToListModalOpen(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(0.9)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6.25V23.75M6.25 15H23.75" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Main Video Image */}
            <img
              src={getThumbnail(video)}
              alt="Video Thumbnail"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'all 0.6s ease',
                transform: imageLoaded ? 'scale(1)' : 'scale(1.1)',
                filter: imageLoaded ? 'brightness(1)' : 'brightness(0.8)',
                cursor: 'pointer',
              }}
              onLoad={() => setImageLoaded(true)}
              onClick={() => {
                if (video.youtubeVideoId) {
                  window.open(`https://www.youtube.com/watch?v=${video.youtubeVideoId}`, '_blank');
                }
              }}
              title="Open on YouTube"
            />

            {/* Enhanced Gradient Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(180deg, rgba(20,20,20,0) 0%, rgba(20,20,20,0.3) 30%, rgba(10,10,10,0.8) 80%, rgba(10,10,10,0.95) 100%)',
              zIndex: 2
            }} />
          </div>

          {/* Content Section */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '60px 50px 40px',
            zIndex: 3
          }}>
            {/* Category Badge */}
            {category && (
              <div style={{
                display: 'inline-block',
                background: 'rgba(223, 208, 184, 0.15)',
                backdropFilter: 'blur(5px)',
                color: '#DFD0B8',
                padding: '8px 20px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '20px',
                border: '1px solid rgba(223, 208, 184, 0.2)',
                animation: 'fadeInUp 0.8s ease-out 0.3s both'
              }}>
                {category}
              </div>
            )}

            {/* Title */}
            <h1 style={{
              fontFamily: 'Bellefair, serif',
              fontSize: 'clamp(32px, 5vw, 72px)',
              fontWeight: 400,
              margin: '0 0 20px 0',
              color: '#DFD0B8',
              lineHeight: 1.1,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
              animation: 'fadeInUp 0.8s ease-out 0.1s both'
            }}>
              {video.title_youtube || video.title}
            </h1>

            {/* Metadata Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              animation: 'fadeInUp 0.8s ease-out 0.5s both'
            }}>
              {/* Left metadata */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                fontSize: '18px',
                color: 'rgba(223, 208, 184, 0.8)',
                fontWeight: 400
              }}>
                <span style={{
                  padding: '6px 16px',
                  background: 'rgba(223, 208, 184, 0.1)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(5px)'
                }}>
                  {year}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <span>{video?.avgRating ? video.avgRating.toFixed(1) : '0.0'}</span>
                  <div style={{
                    paddingBottom: '1px',
                    width: '20px',
                    height: '20px',
                    // background: 'linear-gradient(5deg,rgb(0, 0, 0), #FFA500)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    ★
                  </div>
                </div>
              </div>

              {/* Submitter info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '16px',
                color: 'rgba(223, 208, 184, 0.7)'
              }}>
                <span>submitted by</span>
                <span 
                  style={{ 
                    fontWeight: 700,
                    color: '#DFD0B8',
                    cursor: 'pointer',
                    padding: '5px 14px',
                    background: 'rgba(223, 208, 184, 0.1)',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(5px)'
                  }}
                  onClick={() => {
                    if (username && username.startsWith('@')) {
                      navigate(`/profile/${username.slice(1)}`);
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(223, 208, 184, 0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(223, 208, 184, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add to List Modal */}
      {video && (
        <AddToListModal
          isOpen={isAddToListModalOpen}
          onClose={() => setIsAddToListModalOpen(false)}
          videoId={video._id}
        />
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
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

export default Previews