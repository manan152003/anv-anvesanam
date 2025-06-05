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
  const DESCRIPTION_LIMIT = 200;

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

  // Fetch YouTube video title
  useEffect(() => {
    if (!url) return

    const fetchVideoTitle = async () => {
      const videoId = getVideoId(url)
      if (!videoId) return

      try {
        // Check if API key exists
        const apiKey = import.meta.env.VITE_YT_KEY
        if (!apiKey || apiKey === 'your_youtube_api_key_here') {
          // Fallback: extract title from URL or use default
          setTitle('default')
          return
        }

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
        )
        const data = await response.json()
        
        if (data.items && data.items.length > 0) {
          setTitle(data.items[0].snippet.title)
        } else {
          setTitle('title')
        }
      } catch (error) {
        console.error('Error fetching video title:', error)
        setTitle('title')
      }
    }

    fetchVideoTitle()
  }, [url])

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      if (!user) throw new Error('User not found');
      const submission = { url, title, category, rating, review, userId: user.id };
      console.log('Submitting video:', submission);
      await submitVideo(submission);
      
      // Show success message
      setSuccessMessage('Your video is added.');
      
      // Redirect to home page after 1.5 seconds
      setTimeout(() => {
        navigate('/home', {
          state: {
            submittedVideoUrl: url,
            videoTitle: title
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Error submitting video:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit video');
      setIsSubmitting(false);
    }
  }

  // If no URL, don't render the component
  if (!url) {
    return null
  }

  return (
    <div 
      style={{ 
        minWidth: '100vw',
        minHeight: '100vh',
        background: '#141414',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 0,
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

      {/* Main 1440x1024 container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1440px',
          height: '1024px',
          maxWidth: '100vw',
          maxHeight: '100vh',
          background: 'none',
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

        {/* Top Section - Thumbnail and URL/Cancel */}
        <div style={{
          display: 'flex',
          gap: '107px',
          alignItems: 'flex-start',
          marginTop: '115px',
          paddingLeft: '108px',
        }}>
          {/* Thumbnail */}
          <div style={{
            position: 'relative',
            background: '#1A1A1A',
            borderRadius: '50px',
            overflow: 'hidden',
            width: '533px',
            height: '300px',
            flexShrink: 0,
            border: '3px solid #848484',
          }}>
            {url && (
              <img
                src={`https://img.youtube.com/vi/${getVideoId(url)}/hqdefault.jpg`}
                alt="YouTube thumbnail"
                width={533}
                height={300}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
            {/* SVG overlay */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}>
              <svg width="101" height="102" viewBox="0 0 101 102" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.0417 13.125L79.9583 51L21.0417 88.875V13.125Z" stroke="#1A1A1A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>

          {/* URL and Cancel Section */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginTop: '90px',
          }}>
            <input
              value={url}
              readOnly
              style={{
                background: '#1a1a1a',
                borderRadius: '24px',
                color: 'rgba(223, 208, 184, 0.6)',
                fontFamily: 'Lora, serif',
                fontSize: '20px',
                fontWeight: 700,
                border: '3px solid rgba(223, 208, 184, 0.6)',
                width: '650px',
                height: '50px',
                textAlign: 'center',
                padding: '12px 75px',
                boxShadow: 'inset 0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              }}
              aria-label="YouTube URL"
            />
            <button
              onClick={() => navigate('/')}
              style={{
                width: '200px',
                height: '65px',
                borderRadius: '30px',
                border: '1px solid #AFB774',
                background: '#075b5e',
                color: '#dfd0b8',
                fontFamily: 'Lora, serif',
                fontWeight: 500,
                fontSize: '24px',
                textAlign: 'center',
                opacity: 0.9,
                cursor: 'pointer',
                alignSelf: 'center',
                marginTop: '24px',
                display: 'block',
              }}
            >
              cancel
            </button>
          </div>
        </div>

        {/* Bottom Section - Form */}
        <div style={{
          position: 'relative',
          marginTop: '87px',
        }}>
          {/* Left Column - Title and Review - positioned to align with thumbnail */}
          <div style={{
            position: 'absolute',
            left: '108px', // Same as thumbnail left position
            top: 0,
            width: '533px', // Same width as thumbnail for alignment
          }}>
            {/* Title Section */}
            <div style={{ marginBottom: '88px' }}>
              <div style={{
                color: 'rgba(223, 208, 184, 0.6)',
                fontFamily: 'Lora, serif',
                fontSize: '30px',
                fontWeight: 400,
                marginBottom: '15px',
              }}>
                title
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(223, 208, 184, 1)',
                  fontFamily: 'Lora, serif',
                  fontSize: '50px',
                  fontWeight: 600,
                  outline: 'none',
                  padding: 0,
                  marginLeft: '50px',
                }}
              />
            </div>

            {/* Optional Review */}
            <div>
              <div style={{
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                fontSize: '48px',
                fontWeight: 400,
                marginBottom: '8px',
              }}>
                optional
              </div>
              <div style={{
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                fontWeight: 400,
                fontSize: '30px',
                opacity: 0.6,
                lineHeight: '128%',
                textAlign: 'center',
                marginBottom: '16px',
              }}>
                why do you think its a great video ?
              </div>
              <div style={{ position: 'relative', width: '440px', height: '120px' }}>
                <textarea
                  value={review}
                  onChange={(e) => {
                    if (e.target.value.length <= DESCRIPTION_LIMIT) setReview(e.target.value)
                  }}
                  style={{
                    width: '440px',
                    height: '150px',
                    padding: '16px',
                    background: '#DFD0B8',
                    borderRadius: '16px',
                    border: 'none',
                    color: '#141414',
                    fontFamily: 'Lora, serif',
                    fontSize: '20px',
                    fontWeight: 400,
                    resize: 'none',
                    outline: 'none',
                    marginLeft: '20px',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: -20,
                  right: 0,
                  color: 'rgba(20,20,20,0.9)',
                  fontFamily: 'Lora, serif',
                  fontSize: 14,
                  opacity: 0.7,
                  pointerEvents: 'none',
                }}>
                  {review.length}/{DESCRIPTION_LIMIT}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Category, Star, Submit - positioned to align with URL section */}
          <div style={{
            position: 'absolute',
            left: '950px', // Position to align with URL section (108px + 533px + 107px gap)
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '42px',
            alignItems: 'flex-start',
          }}>
            {/* Category Section */}
            <div style={{ position: 'relative' }}>
              <div style={{
                color: '#DFD0B8',
                opacity: 0.6,
                fontFamily: 'Lora, serif',
                fontSize: '30px',
                fontWeight: 400,
                marginBottom: '24px',
              }}>
                category
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
              }}>
                <button
                  type="button"
                  onClick={() => setCategoryDropdown((v) => !v)}
                  style={{
                    padding: '6px 30px',
                    background: 'rgba(26, 26, 26, 0.6)',
                    borderRadius: '20px',
                    border: '1px solid #DFD0B8',
                    color: '#DFD0B8',
                    fontFamily: 'Lora, serif',
                    fontSize: '25px',
                    fontWeight: 600,
                    textAlign: 'center',             
                    outline: 'none',
                    cursor: 'pointer',
                    minWidth: '120px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '50px',
                  }}
                >
                  {category || 'other'} 
                </button>
                {categoryDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: '#1A1A1A',
                    border: '1px solid #DFD0B8',
                    borderRadius: '20px',
                    zIndex: 100,
                    minWidth: '240px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    padding: '8px',
                  }}>
                    {categories.map(cat => (
                      <div
                        key={cat._id}
                        onClick={() => { setCategory(cat.slug); setCategoryDropdown(false); }}
                        style={{
                          padding: '8px 16px',
                          color: '#DFD0B8',
                          fontFamily: 'Lora, serif',
                          fontSize: '25px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: category === cat.slug ? 'rgba(223,208,184,0.1)' : 'transparent',
                          borderRadius: '12px',
                          textAlign: 'center',
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
            <div>
              <div style={{
                color: 'rgba(223, 208, 184, 0.6)',
                fontSize: '30px',
                fontWeight: 400,
                marginBottom: '2px',
              }}>
                star
              </div>
              <div style={{
                display: 'flex',
                gap: '5px',
                marginLeft: '50px',
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: star <= rating ? '#FFD700' : '#DFD0B8',
                      fontSize: '40px',
                      cursor: 'pointer',
                      opacity: star <= rating ? 1 : 0.6,
                      padding: 0,
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
              {error && (
                <div style={{ 
                  color: '#ff4d4f', 
                  fontFamily: 'Lora, serif', 
                  fontSize: 14, 
                  marginTop: 16,
                  textAlign: 'center',
                  opacity: 0.75,  
                  marginLeft: '50px',
                }}>
                  {error}
                </div>
              )}
              {successMessage && (
                <div style={{ 
                  color: '#52c41a', 
                  fontFamily: 'Lora, serif', 
                  fontSize: 16, 
                  marginTop: 16,
                  textAlign: 'center',
                  opacity: 0.9,  
                  marginLeft: '50px',
                  fontWeight: 500,
                }}>
                  {successMessage}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: '200px',
                height: '65px',
                borderRadius: '30px',
                border: '1px solid #afb774',
                background: '#210f37',
                color: '#dfd0b8',
                fontFamily: 'Lora, serif',
                fontWeight: 500,
                fontSize: '24px',
                textAlign: 'center',
                opacity: isSubmitting ? 0.5 : 0.9,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                marginTop: '20px',
                alignSelf: 'center',
                display: 'block',
                marginLeft: '46px',
              }}
            >
              {isSubmitting ? 'submitting...' : 'submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterDetails