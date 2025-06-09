import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCategories } from '../services/categoryService'
import { submitVideo } from '../services/videoService'
import type { Category } from '../types'

interface LocationState {
  url: string
}

const EnterDetails: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [categoryDropdown, setCategoryDropdown] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const DESCRIPTION_LIMIT = 200
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null)
  const [uploadDate, setUploadDate] = useState<string>('')
  const [imageLoaded, setImageLoaded] = useState(false)

  // Get URL from location state
  const url = (location.state as LocationState)?.url

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
        if (fetchedCategories.length > 0) {
          setCategory(fetchedCategories[0].slug)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Redirect if not authenticated or no URL
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/enter-details', url } })
      return
    }
    
    if (!url) {
      navigate('/')
      return
    }
  }, [isAuthenticated, navigate, url])

  // Extract YouTube video ID from URL
  const getVideoId = (url: string) => {
    const match = url.match(/v=([\w-]+)/)
    return match ? match[1] : null
  }

  // Fetch YouTube video title, duration, and upload date
  useEffect(() => {
    if (!url) return

    const fetchVideoDetails = async () => {
      const videoId = getVideoId(url)
      if (!videoId) return

      try {
        const apiKey = import.meta.env.VITE_YT_KEY
        if (!apiKey || apiKey === 'your_youtube_api_key_here') {
          setTitle('default')
          setDurationSeconds(0)
          setUploadDate('')
          return
        }

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`
        )
        const data = await response.json()
        if (data.items && data.items.length > 0) {
          setTitle(data.items[0].snippet.title)
          setUploadDate(data.items[0].snippet.publishedAt)
          const iso = data.items[0].contentDetails.duration
          const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
          const [, h, m, s] = match ? match.map(Number) : []
          setDurationSeconds((h || 0) * 3600 + (m || 0) * 60 + (s || 0))
        } else {
          setTitle('title')
          setDurationSeconds(0)
          setUploadDate('')
        }
      } catch (error) {
        console.error('Error fetching video details:', error)
        setTitle('title')
        setDurationSeconds(0)
        setUploadDate('')
      }
    }

    fetchVideoDetails()
  }, [url])

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      if (!user) throw new Error('User not found')
      const submission = {
        url,
        title,
        category,
        rating,
        review,
        userId: user.id,
        duration_seconds: durationSeconds,
        uploadDate_youtube: uploadDate,
      }
      console.log('Submitting video:', submission)
      const videoId = await submitVideo(submission)
      setSuccessMessage('Your video is added.')
      setTimeout(() => {
        navigate('/home', {
          state: {
            videoId
          }
        })
      }, 250)
    } catch (error) {
      console.error('Error submitting video:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit video')
      setIsSubmitting(false)
    }
  }

  if (!url) {
    return null
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

      {/* Main Content Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '120px 40px 40px',
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Video Preview Card */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
          marginBottom: '40px',
          animation: 'slideUp 0.8s ease-out'
        }}>
          {/* Video Thumbnail */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden'
          }}>
            {url && (
              <img
                src={`https://img.youtube.com/vi/${getVideoId(url)}/maxresdefault.jpg`}
                alt="YouTube thumbnail"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'all 0.6s ease',
                  transform: imageLoaded ? 'scale(1)' : 'scale(1.1)',
                  filter: imageLoaded ? 'brightness(1)' : 'brightness(0.8)'
                }}
                onLoad={() => setImageLoaded(true)}
              />
            )}
            {/* Play Button Overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5.14v14l11-7-11-7z" fill="#1A1A1A"/>
              </svg>
            </div>
          </div>

          {/* URL Display */}
          <div style={{
            padding: '30px',
            borderTop: '1px solid rgba(223, 208, 184, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px'
          }}>
            <input
              value={url}
              readOnly
              style={{
                flex: 1,
                background: 'rgba(223, 208, 184, 0.05)',
                borderRadius: '16px',
                color: 'rgba(223, 208, 184, 0.8)',
                fontFamily: 'Lora, serif',
                fontSize: '18px',
                padding: '12px 24px',
                border: '1px solid rgba(223, 208, 184, 0.2)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              aria-label="YouTube URL"
            />
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 32px',
                background: 'rgba(223, 208, 184, 0.1)',
                borderRadius: '16px',
                border: '1px solid rgba(223, 208, 184, 0.2)',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
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
              Cancel
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          animation: 'fadeInUp 0.8s ease-out 0.3s both'
        }}>
          {/* Left Column */}
          <div style={{
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)'
          }}>
            {/* Title Section */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(223, 208, 184, 0.6)',
                fontSize: '20px',
                marginBottom: '12px'
              }}>
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly
                style={{
                  width: '100%',
                  background: 'rgba(223, 208, 184, 0.05)',
                  borderRadius: '16px',
                  color: '#DFD0B8',
                  fontSize: '24px',
                  padding: '16px',
                  border: '1px solid rgba(223, 208, 184, 0.2)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Review Section */}
            <div>
              <label style={{
                display: 'block',
                color: '#DFD0B8',
                fontSize: '20px',
                marginBottom: '12px'
              }}>
                Optional Review
              </label>
              <div style={{
                color: 'rgba(223, 208, 184, 0.6)',
                fontSize: '16px',
                marginBottom: '16px'
              }}>
                Why do you think it's a great video?
              </div>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={review}
                  onChange={(e) => {
                    if (e.target.value.length <= DESCRIPTION_LIMIT) setReview(e.target.value)
                  }}
                  style={{
                    width: '100%',
                    height: '150px',
                    background: 'rgba(223, 208, 184, 0.05)',
                    borderRadius: '16px',
                    color: '#DFD0B8',
                    fontSize: '16px',
                    padding: '16px',
                    border: '1px solid rgba(223, 208, 184, 0.2)',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '0',
                  color: 'rgba(223, 208, 184, 0.6)',
                  fontSize: '14px'
                }}>
                  {review.length}/{DESCRIPTION_LIMIT}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{
            background: 'rgba(20, 20, 20, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)'
          }}>
            {/* Category Section */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(223, 208, 184, 0.6)',
                fontSize: '20px',
                marginBottom: '12px'
              }}>
                Category
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setCategoryDropdown((v) => !v)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(223, 208, 184, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(223, 208, 184, 0.2)',
                    color: '#DFD0B8',
                    fontSize: '18px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{category || 'Select a category'}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="#DFD0B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {categoryDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    background: 'rgba(20, 20, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(223, 208, 184, 0.2)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    zIndex: 100,
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {categories.map(cat => (
                      <div
                        key={cat._id}
                        onClick={() => { setCategory(cat.slug); setCategoryDropdown(false); }}
                        style={{
                          padding: '12px 16px',
                          color: '#DFD0B8',
                          fontSize: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: category === cat.slug ? 'rgba(223, 208, 184, 0.1)' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(223, 208, 184, 0.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = category === cat.slug ? 'rgba(223, 208, 184, 0.1)' : 'transparent'
                        }}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Star Rating */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(223, 208, 184, 0.6)',
                fontSize: '20px',
                marginBottom: '12px'
              }}>
                Rating
              </label>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: star <= rating ? '#FFD700' : 'rgba(223, 208, 184, 0.3)',
                      fontSize: '32px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: star <= rating ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = star <= rating ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div style={{ 
                color: '#ff4d4f',
                fontSize: '14px',
                marginBottom: '16px',
                padding: '12px',
                background: 'rgba(255, 77, 79, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 77, 79, 0.2)'
              }}>
                {error}
              </div>
            )}
            {successMessage && (
              <div style={{ 
                color: '#52c41a',
                fontSize: '14px',
                marginBottom: '16px',
                padding: '12px',
                background: 'rgba(82, 196, 26, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(82, 196, 26, 0.2)'
              }}>
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #DFD0B8 0%, #C9B896 100%)',
                borderRadius: '16px',
                border: 'none',
                color: '#141414',
                fontSize: '18px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Video'}
            </button>
          </div>
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

export default EnterDetails