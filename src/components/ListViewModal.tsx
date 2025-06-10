import React, { useEffect, useState } from 'react';
import { getListDetails, removeVideoFromList, updateList, deleteList } from '../services/listService';
import { getVideoById } from '../services/videoService';
import type { List } from '../types';
import { getYouTubeThumbnail } from '../utils/youtube';
import { useMobileView } from '../context/MobileViewContext';

interface ListViewModalProps {
  listId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onListDeleted?: () => void;
}

const ListViewModal = ({ listId, isOpen, onClose, onListDeleted }: ListViewModalProps) => {
  const { isMobileView } = useMobileView();
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingError, setRenamingError] = useState('');
  const [videoCache, setVideoCache] = useState<Record<string, any>>({});
  const [thumbnailUrls, setThumbnailUrls] = useState<{ [key: string]: string }>({});
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen && listId) fetchList();
    // eslint-disable-next-line
  }, [isOpen, listId]);

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

  useEffect(() => {
    if (!list) return;
    const missingIds = list.videoItems
      .filter(item => typeof item.videoId === 'string' && !videoCache[item.videoId])
      .map(item => item.videoId as string);

    if (missingIds.length === 0) return;

    missingIds.forEach(async (id) => {
      try {
        const video = await getVideoById(id);
        setVideoCache(prev => ({ ...prev, [id]: video }));
      } catch {}
    });
  }, [list, videoCache]);

  useEffect(() => {
    const loadThumbnails = async () => {
      if (list && list.videoItems) {
        const urls: { [key: string]: string } = {};
        await Promise.all(
          list.videoItems.map(async (item: any) => {
            if (item.videoId && item.videoId.youtube_id) {
              const url = await getYouTubeThumbnail(item.videoId.youtube_id);
              urls[item.videoId._id] = url;
            }
          })
        );
        setThumbnailUrls(urls);
      }
    };
    loadThumbnails();
  }, [list]);

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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: isMobileView ? '0' : '24px',
          padding: isMobileView ? '20px' : '40px',
          width: isMobileView ? '100%' : '90vw',
          maxWidth: '1200px',
          maxHeight: isMobileView ? '100vh' : '90vh',
          overflow: 'auto',
          color: '#DFD0B8',
          fontFamily: 'Lora, serif',
          boxShadow: isMobileView ? 'none' : '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
          animation: isMobileView ? 'slideUpMobile 0.3s ease-out' : 'slideUp 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{ 
            marginBottom: isMobileView ? 16 : 32, 
            color: '#DFD0B8', 
            background: 'rgba(223, 208, 184, 0.1)',
            border: '1px solid rgba(223, 208, 184, 0.2)',
            borderRadius: isMobileView ? '12px' : '16px',
            padding: isMobileView ? '8px 16px' : '12px 24px',
            fontSize: isMobileView ? '14px' : '16px',
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
          <span style={{ fontSize: isMobileView ? '16px' : '20px' }}>←</span> Back
        </button>

        {loading ? (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 0'
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
              letterSpacing: '0.5px',
              marginTop: '20px'
            }}>
              Loading your list...
            </div>
          </div>
        ) : error ? (
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
              Please try again later
            </div>
          </div>
        ) : !list ? null : (
          <>
            <div style={{ 
              background: 'rgba(20, 20, 20, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: isMobileView ? '16px' : '24px',
              padding: isMobileView ? '20px' : '40px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
              marginBottom: isMobileView ? '20px' : '40px',
              animation: 'slideUp 0.8s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: isMobileView ? 16 : 24, flexWrap: isMobileView ? 'wrap' : 'nowrap', gap: isMobileView ? '8px' : '0' }}>
                {renaming ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobileView ? '8px' : '16px', width: '100%', flexWrap: isMobileView ? 'wrap' : 'nowrap' }}>
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      style={{ 
                        flex: 1,
                        fontSize: isMobileView ? 18 : 24,
                        padding: isMobileView ? '8px 16px' : '12px 20px',
                        borderRadius: isMobileView ? '12px' : '16px',
                        border: '1px solid rgba(223, 208, 184, 0.2)',
                        background: 'rgba(223, 208, 184, 0.05)',
                        color: '#DFD0B8',
                        fontFamily: 'Lora, serif',
                        outline: 'none',
                        minWidth: isMobileView ? '100%' : 'auto'
                      }}
                    />
                    <button 
                      onClick={handleRename} 
                      style={{ 
                        padding: isMobileView ? '8px 16px' : '12px 24px',
                        background: 'rgba(223, 208, 184, 0.1)',
                        border: '1px solid rgba(223, 208, 184, 0.2)',
                        borderRadius: isMobileView ? '12px' : '16px',
                        color: '#DFD0B8',
                        fontSize: isMobileView ? '14px' : '16px',
                        fontFamily: 'Lora, serif',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        flex: isMobileView ? '1' : 'auto'
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
                      Save
                    </button>
                    <button 
                      onClick={() => setRenaming(false)} 
                      style={{ 
                        padding: isMobileView ? '8px 16px' : '12px 24px',
                        background: 'rgba(255, 77, 77, 0.1)',
                        border: '1px solid rgba(255, 77, 77, 0.2)',
                        borderRadius: isMobileView ? '12px' : '16px',
                        color: '#ff4d4f',
                        fontSize: isMobileView ? '14px' : '16px',
                        fontFamily: 'Lora, serif',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        flex: isMobileView ? '1' : 'auto'
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
                      Cancel
                    </button>
                    {renamingError && (
                      <span style={{ color: '#ff4d4f', marginLeft: isMobileView ? '0' : '16px', fontSize: isMobileView ? '12px' : '14px', width: '100%' }}>{renamingError}</span>
                    )}
                  </div>
                ) : (
                  <>
                    <h2 style={{ 
                      fontSize: isMobileView ? 24 : 32, 
                      fontWeight: 700, 
                      margin: 0,
                      fontFamily: 'Lora, serif',
                      color: '#DFD0B8',
                      flex: isMobileView ? '1 1 100%' : 'auto'
                    }}>
                      {list.name}
                    </h2>
                    {!list.isDefault && (
                      <>
                        <button 
                          aria-label="Rename List"
                          onClick={() => setRenaming(true)} 
                          style={{ 
                            marginLeft: isMobileView ? 0 : 16, 
                            color: '#DFD0B8',
                            background: 'rgba(223, 208, 184, 0.1)',
                            border: '1px solid rgba(223, 208, 184, 0.2)',
                            borderRadius: isMobileView ? '12px' : '16px',
                            padding: isMobileView ? '6px 12px' : '8px 16px',
                            fontSize: isMobileView ? '12px' : '14px',
                            fontFamily: 'Lora, serif',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: isMobileView ? '1' : 'auto'
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
                          <svg width={isMobileView ? "14" : "18"} height={isMobileView ? "14" : "18"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 17.25V14.75L14.81 2.94C15.2 2.55 15.83 2.55 16.22 2.94L17.06 3.78C17.45 4.17 17.45 4.8 17.06 5.19L5.25 17H2.75C2.34 17 2 16.66 2 16.25V13.75L3 17.25Z" stroke="#DFD0B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          aria-label="Delete List"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this list?')) {
                              try {
                                await deleteList(list._id);
                                onClose();
                                if (onListDeleted) onListDeleted();
                              } catch (err) {
                                alert('Failed to delete list');
                              }
                            }
                          }}
                          style={{
                            marginLeft: isMobileView ? 0 : 12,
                            color: '#ff4d4f',
                            background: 'rgba(255, 77, 77, 0.1)',
                            border: '1px solid rgba(255, 77, 77, 0.2)',
                            borderRadius: isMobileView ? '12px' : '16px',
                            padding: isMobileView ? '6px 12px' : '8px 16px',
                            fontSize: isMobileView ? '12px' : '14px',
                            fontFamily: 'Lora, serif',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: isMobileView ? '1' : 'auto'
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
                        marginLeft: isMobileView ? 0 : 16, 
                        fontSize: isMobileView ? 12 : 14, 
                        color: 'rgba(223, 208, 184, 0.6)',
                        background: 'rgba(223, 208, 184, 0.1)',
                        padding: isMobileView ? '2px 8px' : '4px 12px',
                        borderRadius: isMobileView ? '8px' : '12px',
                        border: '1px solid rgba(223, 208, 184, 0.2)',
                        flex: isMobileView ? '1' : 'auto'
                      }}>
                        Default List
                      </span>
                    )}
                  </>
                )}
              </div>
              <div style={{ 
                marginBottom: isMobileView ? 16 : 24, 
                fontSize: isMobileView ? 14 : 16,
                color: 'rgba(223, 208, 184, 0.6)',
                fontFamily: 'Lora, serif'
              }}>
                {list.videoItems.length} videos
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: isMobileView ? '1fr' : 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: isMobileView ? '16px' : '32px',
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
                list.videoItems.map((item: any, index: number) => {
                  let videoObj: any = typeof item.videoId === 'object'
                    ? item.videoId
                    : videoCache[item.videoId as string];

                  const thumbnail =
                    videoObj?.thumbnailUrl_youtube ||
                    (videoObj?.youtubeVideoId
                      ? `https://img.youtube.com/vi/${videoObj.youtubeVideoId}/hqdefault.jpg`
                      : '/placeholder-thumbnail.png');

                  const title =
                    videoObj?.title_youtube ||
                    (typeof item.videoId === 'object' && item.videoId.title_youtube) ||
                    (typeof item.videoId === 'string' ? 'Loading...' : '');

                  return (
                    <div 
                      key={typeof item.videoId === 'string' ? item.videoId : item.videoId._id}
                      style={{
                        background: 'rgba(20, 20, 20, 0.8)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: isMobileView ? '16px' : '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
                        animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isMobileView) {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(223, 208, 184, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobileView) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)';
                        }
                      }}
                    >
                      <div style={{ 
                        position: 'relative',
                        width: '100%',
                        paddingTop: '56.25%', // 16:9 aspect ratio
                        overflow: 'hidden'
                      }}>
                        <img
                          src={thumbnail}
                          alt={title}
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
                            onClick={() => window.location.href = `/home?videoId=${item.videoId._id}`}
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
                          {title}
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
                          onClick={() => handleRemoveVideo(typeof item.videoId === 'object' ? item.videoId._id : item.videoId)}
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
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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

          @keyframes slideUpMobile {
            0% {
              opacity: 0;
              transform: translateY(100%);
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

export default ListViewModal; 