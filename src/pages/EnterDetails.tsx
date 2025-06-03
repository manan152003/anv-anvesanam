import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface LocationState {
  url: string
}

const EnterDetails: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { url } = location.state as LocationState
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  // Extract YouTube video ID from URL
  const getVideoId = (url: string) => {
    const match = url.match(/v=([\w-]+)/)
    return match ? match[1] : null
  }

  // Fetch YouTube video title
  useEffect(() => {
    const fetchVideoTitle = async () => {
      const videoId = getVideoId(url)
      if (!videoId) return

      try {
        // Check if API key exists
        const apiKey = import.meta.env.VITE_YT_KEY
        if (!apiKey || apiKey === 'your_youtube_api_key_here') {
          // Fallback: extract title from URL or use default
          setTitle('just business, darling.')
          return
        }

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
        )
        const data = await response.json()
        
        if (data.items && data.items.length > 0) {
          setTitle(data.items[0].snippet.title)
        } else {
          setTitle('just business, darling.')
        }
      } catch (error) {
        console.error('Error fetching video title:', error)
        setTitle('just business, darling.')
      }
    }

    fetchVideoTitle()
  }, [url])

  const handleSubmit = () => {
    // TODO: Handle submission
    console.log({ url, title, category, rating, review })
  }

  return (
    <div 
      style={{ 
        minWidth: '100vw',
        minHeight: '100vh',
        background: '#141414',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
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
          pointerEvents: 'none'
        }}
      />

      {/* Logo */}
      <img
        src="/logo.png"
        alt="Anv Logo"
        style={{
          position: 'absolute',
          left: '32px',
          top: '32px',
          width: 'auto',
          height: '30px',
          zIndex: 10
        }}
      />

      {/* Main Content Container */}
      <div style={{
        width: '90%',
        maxWidth: '1290px',
        display: 'flex',
        flexDirection: 'column',
        gap: '87px',
        zIndex: 10,
      }}>
        {/* Top Section - Thumbnail and URL/Cancel */}
        <div style={{
          display: 'flex',
          gap: '107px',
          alignItems: 'flex-start',
          marginTop: '100px',
        }}>
          {/* Thumbnail */}
          <div style={{
            background: '#1A1A1A',
            borderRadius: '24px',
            overflow: 'hidden',
            width: '502px',
            height: '282px',
            flexShrink: 0,
          }}>
            {url && (
              <img
                src={`https://img.youtube.com/vi/${getVideoId(url)}/hqdefault.jpg`}
                alt="YouTube thumbnail"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>

          {/* URL and Cancel Section */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginTop: '100px',
          }}>
            <input
              value={url}
              readOnly
              style={{
                padding: '16px 24px',
                background: 'rgba(20, 20, 20, 0.6)',
                borderRadius: '28px',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                fontSize: '18px',
                opacity: 0.8,
                border: '1px solid #DFD0B8',
                width: '100%',
              }}
              aria-label="YouTube URL"
            />
            <button
              onClick={() => navigate('/')}
              style={{
                width: '160px',
                padding: '10px 0',
                borderRadius: '28px',
                background: '#075B5E',
                border: '1px solid #AFB774',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                fontSize: '18px',
                cursor: 'pointer',
                alignSelf: 'center',
                fontWeight: 500,
              }}
            >
              cancel
            </button>
          </div>
        </div>

        {/* Bottom Section - Form */}
        <div style={{
          display: 'flex',
          gap: '120px',
          alignItems: 'flex-start',
          marginTop: '-150px',
        }}>
          {/* Left Column - Title and Review */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}>
            {/* Title Section */}
            <div>
              <div style={{
                color: '#DFD0B8',
                opacity: 0.6,
                fontFamily: 'Lora, serif',
                fontSize: '16px',
                marginBottom: '6px',
              }}>
                title
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#DFD0B8',
                  fontFamily: 'Lora, serif',
                  fontSize: '28px',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
            </div>

            {/* Optional Review */}
            <div>
              <div style={{
                color: '#DFD0B8',
                opacity: 0.6,
                fontFamily: 'Lora, serif',
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '6px',
              }}>
                optional
              </div>
              <div style={{
                color: '#DFD0B8',
                opacity: 0.8,
                fontFamily: 'Lora, serif',
                fontSize: '16px',
                marginBottom: '12px',
              }}>
                why do you think its a great video ?
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                style={{
                  width: '320px',
                  height: '90px',
                  padding: '12px',
                  background: '#DFD0B8',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#141414',
                  fontFamily: 'Lora, serif',
                  fontSize: '16px',
                  resize: 'none',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Right Column - Category, Star, Submit */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            alignItems: 'flex-start',
          }}>
            {/* Category Section */}
            <div>
              <div style={{
                color: '#DFD0B8',
                opacity: 0.6,
                fontFamily: 'Lora, serif',
                fontSize: '16px',
                marginBottom: '6px',
              }}>
                category
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    padding: '6px 18px',
                    background: 'rgba(26, 26, 26, 0.6)',
                    borderRadius: '20px',
                    border: 'none',
                    color: '#DFD0B8',
                    fontFamily: 'Lora, serif',
                    fontSize: '28px',
                    outline: 'none',
                    fontWeight: 600,
                  }}
                  placeholder="sci-fi"
                />
                <button style={{
                  padding: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: '20px', color: '#DFD0B8' }}>⌄</span>
                </button>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <div style={{
                color: '#DFD0B8',
                opacity: 0.6,
                fontFamily: 'Lora, serif',
                fontSize: '16px',
                marginBottom: '6px',
              }}>
                star
              </div>
              <div style={{
                display: 'flex',
                gap: '6px',
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: star <= rating ? '#FFD700' : '#DFD0B8',
                      fontSize: '24px',
                      cursor: 'pointer',
                      opacity: star <= rating ? 1 : 0.6,
                      padding: 0,
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 36px',
                background: '#2B1B4B',
                borderRadius: '20px',
                border: 'none',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 600,
                marginTop: 'auto',
              }}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterDetails 