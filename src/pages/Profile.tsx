import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLists } from '../services/listService';
import { getLatestSubmissionByVideoId, getSubmissionsByUser, getVideoById } from '../services/videoService';
import { getFollowingUsers } from '../services/userService';
import EditProfileModal from '../components/EditProfileModal';

// Critique: Keeping all styles inline for now for consistency with the rest of the app. Consider refactoring to CSS-in-JS or modules for maintainability.

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favList, setFavList] = useState<any>(null);
  const [recentList, setRecentList] = useState<any>(null);
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [listCount, setListCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [favVideos, setFavVideos] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for thumbnails
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});

  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes slideInLeft {
        from { 
          opacity: 0; 
          transform: translateX(-40px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .stat-card {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      }
      
      .video-card {
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        overflow: hidden;
      }
      
      .video-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      }
      
      .video-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.5s;
      }
      
      .video-card:hover::before {
        left: 100%;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Helper to get video thumbnail
  const getThumbnail = (video: any) => {
    if (!video) return '/logo.png';
    return video.thumbnailUrl_youtube || '/logo.png';
  };

  // Critique: Fetch all lists, then filter for Favs (isDefault) and Recent Activity (most recent submissions)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getUserLists(),
      user ? getSubmissionsByUser(user.id) : Promise.resolve([]),
      user ? fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}/followers`).then(res => res.json()) : Promise.resolve([]),
      user ? getFollowingUsers(user.id) : Promise.resolve([])
    ])
      .then(async ([listsData, submissionsData, followersData, followingData]) => {
        setLists(listsData);
        const fav = listsData.find((l: any) => l.isDefault);
        setFavList(fav);
        setRecentList(fav); // Critique: For now, keep as is
        setFollowingUsers(followingData);
        setSubmissionCount(submissionsData.length);
        setListCount(listsData.length);
        setFollowersCount(followersData.length);
        setFollowingCount(followingData.length);
        // Fetch video details for favs
        if (fav && fav.videoItems && fav.videoItems.length > 0) {
          const videos = await Promise.all(
            fav.videoItems.slice(0, 3).map(async (item: any) => {
              if (typeof item.videoId === 'object') return item.videoId;
              try {
                return await getVideoById(item.videoId);
              } catch {
                return null;
              }
            })
          );
          setFavVideos(videos.filter(Boolean));
        } else {
          setFavVideos([]);
        }
        // Recent Activity: fetch video details for all submissions
        if (submissionsData && submissionsData.length > 0) {
          const sorted = submissionsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const recent = await Promise.all(
            sorted.map(async (submission: any) => {
              try {
                // Handle both string and object videoIds
                const videoId = typeof submission.videoId === 'object' ? submission.videoId._id : submission.videoId;
                if (!videoId) return null;
                const video = await getVideoById(videoId);
                return { ...video, rating: submission.rating, submissionId: submission._id };
              } catch {
                return null;
              }
            })
          );
          setRecentActivities(recent.filter(Boolean));
        } else {
          setRecentActivities([]);
        }
      })
      .catch(() => setError('Failed to load lists, submissions, or followers'))
      .finally(() => setLoading(false));
  }, [user]);

  // Load thumbnails for videos
  useEffect(() => {
    const loadThumbnails = async () => {
      const urls: Record<string, string> = {};
      for (const video of [...favVideos, ...recentActivities]) {
        if (video && !thumbnailUrls[video._id]) {
          urls[video._id] = await getThumbnail(video);
        }
      }
      setThumbnailUrls(prev => ({ ...prev, ...urls }));
    };
    loadThumbnails();
  }, [favVideos, recentActivities]);

  // Helper to get video title
  const getTitle = (item: any) => {
    if (item.videoId && typeof item.videoId === 'object' && item.videoId.title) {
      return item.videoId.title;
    }
    return 'Untitled';
  };

  // Loading Component
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
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
            fontSize: '18px',
            fontWeight: 300,
            letterSpacing: '0.5px'
          }}>
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: 'rgba(255, 77, 77, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 77, 77, 0.2)',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '24px',
            color: '#ff6b6b',
            fontFamily: 'Bellefair, serif',
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

  if (!user || !favList || !recentList) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: 'rgba(223, 208, 184, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(223, 208, 184, 0.1)',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '24px',
            color: '#DFD0B8',
            fontFamily: 'Bellefair, serif'
          }}>
            Profile not found
          </div>
        </div>
      </div>
    );
  }

  // Modern Video Card Component
  const VideoCard = ({ video, index }: { video: any, index: number }) => (
    <div
      className="video-card"
      style={{
        width: '320px',
        height: '180px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(223, 208, 184, 0.1)',
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`
      }}
      onClick={() => navigate('/home', { state: { videoId: video._id } })}
    >
      <img
        src={getThumbnail(video)}
        alt={video.title_youtube || video.title || 'Untitled'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '24px'
        }}
      />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      color: '#DFD0B8',
      fontFamily: 'Lora, serif',
      position: 'relative',
      overflow: 'auto'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(223, 208, 184, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(223, 208, 184, 0.02) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '40px',
          marginTop: '60px',
          marginLeft: '80px',
          animation: 'slideInLeft 0.8s ease-out'
        }}>
          {/* Avatar */}
          <div style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '4px solid rgba(223, 208, 184, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
          }}
          >
            <img
              src={user.avatarUrl}
              alt="avatar"
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* User Info */}
          <div style={{ marginTop: '16px', flex: 1 }}>
            <div style={{
              fontFamily: 'Bellefair, serif',
              fontSize: '56px',
              color: '#DFD0B8',
              fontWeight: 700,
              marginBottom: '8px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              {user.name}
            </div>
            <div style={{
              fontSize: '22px',
              color: 'rgba(223, 208, 184, 0.7)',
              marginBottom: '20px'
            }}>
              @{user.username}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <button
                style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '16px',
                  background: 'rgba(223, 208, 184, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: '#DFD0B8',
                  border: '1px solid rgba(223, 208, 184, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}
                onClick={() => setIsEditModalOpen(true)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(223, 208, 184, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                edit profile
              </button>
              <button
                style={{
                  fontFamily: 'Lora, serif',
                  fontSize: '16px',
                  background: 'rgba(175, 183, 116, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: '#AFB774',
                  border: '1px solid rgba(175, 183, 116, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}
                onClick={() => { logout(); navigate('/login'); }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(175, 183, 116, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(175, 183, 116, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                logout
              </button>
            </div>

            <div style={{
              fontSize: '18px',
              color: 'rgba(223, 208, 184, 0.9)',
              marginBottom: '8px',
              lineHeight: 1.5
            }}>
              {user.bio}
            </div>
            <div style={{
              fontSize: '16px',
              color: 'rgba(223, 208, 184, 0.6)'
            }}>
              Member since 2025
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '32px',
            marginTop: '24px',
            animation: 'fadeInUp 0.8s ease-out 0.3s both'
          }}>
            {[
              { label: 'Videos Added', value: submissionCount },
              { label: 'Lists', value: listCount },
              { label: 'Followers', value: followersCount },
              { label: 'Following', value: followingCount }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card"
                style={{
                  textAlign: 'center',
                  padding: '24px 20px',
                  background: 'rgba(223, 208, 184, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(223, 208, 184, 0.1)',
                  minWidth: '120px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#DFD0B8',
                  marginBottom: '8px',
                  fontFamily: 'Bellefair, serif'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(223, 208, 184, 0.7)',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favs Section */}
        <div style={{
          marginTop: '80px',
          marginLeft: '48px',
          marginRight: '48px',
          animation: 'fadeInUp 0.8s ease-out 0.5s both'
        }}>
          <div style={{
            fontFamily: 'Bellefair, serif',
            fontSize: '40px',
            fontWeight: 700,
            color: '#DFD0B8',
            marginBottom: '32px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Favs
          </div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {favVideos.length === 0 ? (
              <div style={{
                padding: '40px',
                background: 'rgba(175, 183, 116, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(175, 183, 116, 0.1)',
                color: 'rgba(175, 183, 116, 0.8)',
                fontFamily: 'Lora, serif',
                fontSize: '18px'
              }}>
                No favorites yet. Start adding videos to see them here!
              </div>
            ) : (
              favVideos.map((video: any, idx: number) => (
                <VideoCard key={video._id || idx} video={video} index={idx} />
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div style={{
          marginTop: '64px',
          marginLeft: '48px',
          marginRight: '48px',
          animation: 'fadeInUp 0.8s ease-out 0.7s both'
        }}>
          <div style={{
            fontFamily: 'Bellefair, serif',
            fontSize: '40px',
            fontWeight: 700,
            color: '#DFD0B8',
            marginBottom: '32px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Recent Activity
          </div>
          <div style={{
            display: 'flex',
            gap: '32px',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            paddingBottom: 8,
            scrollbarColor: '#DFD0B8 #1a1a1a',
            scrollbarWidth: 'thin'
          }}>
            {recentActivities.length === 0 ? (
              <div style={{
                padding: '40px',
                background: 'rgba(175, 183, 116, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(175, 183, 116, 0.1)',
                color: 'rgba(175, 183, 116, 0.8)',
                fontFamily: 'Lora, serif',
                fontSize: '18px'
              }}>
                No recent activity. Start exploring and rating videos!
              </div>
            ) : (
              recentActivities.map((video: any, idx: number) => (
                <div key={video._id || idx} style={{ display: 'inline-block' }}>
                  <VideoCard video={video} index={idx} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Following Section */}
        <div style={{
          marginTop: '64px',
          marginLeft: '48px',
          marginRight: '48px',
          marginBottom: '80px',
          animation: 'fadeInUp 0.8s ease-out 0.9s both'
        }}>
          <div style={{
            fontFamily: 'Bellefair, serif',
            fontSize: '40px',
            fontWeight: 700,
            color: '#DFD0B8',
            marginBottom: '32px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            Following
          </div>
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            maxWidth: '1200px'
          }}>
            {followingUsers.length === 0 ? (
              <div style={{
                padding: '40px',
                background: 'rgba(175, 183, 116, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(175, 183, 116, 0.1)',
                color: 'rgba(175, 183, 116, 0.8)',
                fontFamily: 'Lora, serif',
                fontSize: '18px'
              }}>
                Not following anyone yet. Discover and follow interesting people!
              </div>
            ) : (
              followingUsers.map((f, idx) => (
                <div
                  key={f._id || idx}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(223, 208, 184, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(175, 183, 116, 0.3)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                    animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                  }}
                  onClick={() => navigate(`/profile/${f.username}`)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <img
                    src={f.avatarUrl || '/logo.png'}
                    alt={f.username || 'user'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Profile; 