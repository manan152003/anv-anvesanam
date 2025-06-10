import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListDetails, removeVideoFromList, updateList, deleteList } from '../services/listService';
import type { List } from '../types';

const ListView = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingError, setRenamingError] = useState('');
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (listId) fetchList();
    // eslint-disable-next-line
  }, [listId]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await getListDetails(listId!);
      setList(data);
      setNewName(data.name);
    } catch (err) {
      setError('Failed to load list');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId: string) => {
    if (!listId) return;
    try {
      await removeVideoFromList(listId, videoId);
      fetchList();
    } catch (err) {
      setError('Failed to remove video');
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || !listId) return;
    try {
      await updateList(listId, { name: newName });
      setRenaming(false);
      fetchList();
    } catch (err: any) {
      setRenamingError(err?.message || 'Failed to rename list');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #141414 100%)',
        color: '#DFD0B8',
        fontFamily: 'Lora, serif'
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
            fontSize: '18px',
            fontWeight: 300,
            letterSpacing: '0.5px'
          }}>
            Loading your list...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #141414 100%)',
        color: '#DFD0B8',
        fontFamily: 'Lora, serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: 'rgba(255, 77, 77, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 77, 77, 0.2)',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <div style={{
            fontSize: '24px',
            color: '#ff6b6b',
            fontFamily: 'Lora, serif',
            marginBottom: '10px'
          }}>
            {error}
          </div>
          <div style={{
            fontSize: '16px',
            color: 'rgba(255, 107, 107, 0.7)',
            fontFamily: 'Lora, serif'
          }}>
            Please try refreshing the page
          </div>
        </div>
      </div>
    );
  }

  if (!list) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #141414 100%)',
      color: '#DFD0B8', 
      fontFamily: 'Lora, serif',
      position: 'relative',
      overflow: 'auto'
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

      <div style={{ 
        maxWidth: 1200, 
        margin: '40px auto', 
        padding: '0 40px',
        position: 'relative',
        zIndex: 1
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            marginBottom: 32, 
            color: '#DFD0B8', 
            background: 'rgba(223, 208, 184, 0.1)',
            border: '1px solid rgba(223, 208, 184, 0.2)',
            borderRadius: '16px',
            padding: '12px 24px',
            fontSize: '16px',
            fontFamily: 'Lora, serif',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(223, 208, 184, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: '20px' }}>←</span> Back
        </button>

        <div style={{ 
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
          marginBottom: '40px',
          animation: 'slideUp 0.8s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              margin: 0,
              fontFamily: 'Lora, serif',
              color: '#DFD0B8'
            }}>
              {list.name}
            </h2>
            {!list.isDefault && (
              <>
                <button 
                  aria-label="Rename List"
                  onClick={() => setRenaming(true)} 
                  style={{ 
                    marginLeft: 16, 
                    color: '#DFD0B8',
                    background: 'rgba(223, 208, 184, 0.1)',
                    border: '1px solid rgba(223, 208, 184, 0.2)',
                    borderRadius: '16px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontFamily: 'Lora, serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(223, 208, 184, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17.25V14.75L14.81 2.94C15.2 2.55 15.83 2.55 16.22 2.94L17.06 3.78C17.45 4.17 17.45 4.8 17.06 5.19L5.25 17H2.75C2.34 17 2 16.66 2 16.25V13.75L3 17.25Z" stroke="#DFD0B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  aria-label="Delete List"
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this list?')) {
                      try {
                        await deleteList(list._id);
                        navigate(-1);
                      } catch (err) {
                        alert('Failed to delete list');
                      }
                    }
                  }}
                  style={{
                    marginLeft: 12,
                    color: '#ff4d4f',
                    background: 'rgba(255, 77, 77, 0.1)',
                    border: '1px solid rgba(255, 77, 77, 0.2)',
                    borderRadius: '16px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontFamily: 'Lora, serif',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 77, 77, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Delete List
                </button>
              </>
            )}
            {list.isDefault && (
              <span style={{ 
                marginLeft: 16, 
                fontSize: 14, 
                color: 'rgba(223, 208, 184, 0.6)',
                background: 'rgba(223, 208, 184, 0.1)',
                padding: '4px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(223, 208, 184, 0.2)'
              }}>
                Default List
              </span>
            )}
          </div>
          <div style={{ 
            marginBottom: 32, 
            fontSize: 16,
            color: 'rgba(223, 208, 184, 0.6)',
            fontFamily: 'Lora, serif'
          }}>
            {list.videoItems.length} videos
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '32px',
          animation: 'fadeInUp 0.8s ease-out 0.3s both'
        }}>
          {list.videoItems.length === 0 ? (
            <div style={{ 
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '60px 40px',
              background: 'rgba(223, 208, 184, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(223, 208, 184, 0.1)',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              <div style={{
                fontSize: '24px',
                color: '#DFD0B8',
                fontFamily: 'Lora, serif',
                marginBottom: '10px'
              }}>
                No videos in this list
              </div>
              <div style={{
                fontSize: '16px',
                color: 'rgba(223, 208, 184, 0.7)',
                fontFamily: 'Lora, serif'
              }}>
                Add some videos to get started
              </div>
            </div>
          ) : (
            list.videoItems.map((item: any, index: number) => (
              <div 
                key={typeof item.videoId === 'object' ? item.videoId._id : item.videoId}
                style={{
                  background: 'rgba(20, 20, 20, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(223, 208, 184, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)';
                }}
              >
                <div style={{ 
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  overflow: 'hidden'
                }}>
                  <img
                    src={item.videoId?.thumbnailUrl_youtube || (item.videoId?.youtubeVideoId ? `https://img.youtube.com/vi/${item.videoId.youtubeVideoId}/hqdefault.jpg` : '/placeholder-thumbnail.png')}
                    alt={item.videoId?.title_youtube || 'thumbnail'}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'all 0.6s ease',
                      transform: imageLoaded[item.videoId._id] ? 'scale(1)' : 'scale(1.1)',
                      filter: imageLoaded[item.videoId._id] ? 'brightness(1)' : 'brightness(0.8)'
                    }}
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [item.videoId._id]: true }))}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                  >
                    <button
                      onClick={() => navigate('/home', { state: { videoId: item.videoId._id } })}
                      style={{
                        background: 'rgba(223, 208, 184, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: 'scale(0.8)',
                        opacity: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(0.8)';
                        e.currentTarget.style.opacity = '0';
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5.14v14l11-7-11-7z" fill="#1A1A1A"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ 
                    fontSize: 18, 
                    fontWeight: 500,
                    fontFamily: 'Lora, serif',
                    marginBottom: 8,
                    color: '#DFD0B8'
                  }}>
                    {item.videoId?.title_youtube || 'Loading...'}
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: 'rgba(223, 208, 184, 0.6)',
                    fontFamily: 'Lora, serif',
                    marginBottom: 16
                  }}>
                    {item.addedAt ? new Date(item.addedAt).toLocaleString() : ''}
                  </div>
                  <button 
                    onClick={() => handleRemoveVideo(item.videoId._id || item.videoId)}
                    style={{ 
                      color: '#ff4d4f',
                      background: 'rgba(255, 77, 77, 0.1)',
                      border: '1px solid rgba(255, 77, 77, 0.2)',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontFamily: 'Lora, serif',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 77, 77, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
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

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ListView; 