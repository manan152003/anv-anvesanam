import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getVideoById, getLatestSubmissionByVideoId } from '../services/videoService'
import { getUserById } from '../services/userService'
import { getCategoryById } from '../services/categoryService'
import AddToListModal from '../components/AddToListModal'

interface LocationState {
  videoId?: string
}

const Previews: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState

  const [video, setVideo] = useState<any>(null)
  const [username, setUsername] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false)

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true)
      setError('')
      try {
        let data
        if (state?.videoId) {
          data = await getVideoById(state.videoId)
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
      } catch (err: any) {
        setError(err.message || 'Failed to load video')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
    // eslint-disable-next-line
  }, [state?.videoId])

  useEffect(() => {
    if (!video) return;
    const videoId = video.youtubeVideoId || (video.thumbnailUrl_youtube && video.thumbnailUrl_youtube.split('/')[4]);
    if (!videoId) return;
    const maxres = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    // Try maxres, fallback to hq if 404
    fetch(maxres, { method: 'HEAD' }).then(res => {
      if (res.ok) setThumbnailUrl(maxres);
      else setThumbnailUrl(hq);
    }).catch(() => setThumbnailUrl(hq));
  }, [video]);

  if (loading) {
    return <div style={{ color: '#DFD0B8', fontFamily: 'Lora, serif', fontSize: 32, textAlign: 'center', marginTop: 100 }}>Loading...</div>
  }
  if (error || !video) {
    return <div style={{ color: '#ff4d4f', fontFamily: 'Lora, serif', fontSize: 24, textAlign: 'center', marginTop: 100 }}>{error || 'Video not found'}</div>
  }

  // Get year from uploadDate_youtube
  const year = video.uploadDate_youtube ? new Date(video.uploadDate_youtube).getFullYear() : '2025'

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
        background: '#141414',
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
            onClick={() => setIsAddToListModalOpen(true)}
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 6.25V23.75M6.25 15H23.75" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <img
            src={thumbnailUrl}
            alt="Video Thumbnail"
            width={1448}
            height={927}
            style={{
              width: '1448px',
              height: '927px',
              borderRadius: '05px',
              objectFit: 'cover',
              maxWidth: '100%',
              display: 'block',
            }}
          />
          {/* Black gradient for text readability */}
          <div style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '320px',
            background: 'linear-gradient(180deg, rgba(20,20,20,0) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.98) 100%)',
            borderRadius: '0 0 8px 8px',
            zIndex: 2,
            pointerEvents: 'none',
          }} />
          {/* Overlayed Text */}
          <div style={{
            position: 'absolute',
            left: '60px',
            bottom: '40px',
            color: '#DFD0B8',
            zIndex: 3,
            width: '1330px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            height: '240px',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            overflow: 'hidden',
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              overflow: 'hidden',
            }}>
              <h1 style={{
                fontFamily: 'Bellefair, serif',
                fontSize: '75px',
                fontWeight: 400,
                margin: 0,
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                lineHeight: 1.1,
                maxHeight: '200px',
                overflow: 'hidden',
              }}>
                {video.title_youtube || video.title}
              </h1>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontFamily: 'Lora, serif',
                fontWeight: 400,
                fontSize: '20px',
                marginTop: '5px',
                width: '100%',
                gap: '20px',
              }}>
                <div style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '60%',
                }}>{year} • {category} • 4.8</div>
                <div style={{
                  textAlign: 'right',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '40%',
                }}>submitted via <span style={{ fontWeight: 700 }}>{username}</span></div>
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
    </div>
  )
}

export default Previews 