import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLists, getListsByUser } from '../services/listService';
import { getLatestSubmissionByVideoId, getSubmissionsByUser, getVideoById } from '../services/videoService';
import { getFollowingUsers, getUserByUsername } from '../services/userService';
import { getYouTubeThumbnail } from '../utils/youtube';

// Critique: This page is almost identical to Profile, but loads user by username param, not from auth.
// Critique: For now, use fetch(`/api/users/by-username/:username`) for user info. Add follow/unfollow button if not self.

const ProfilePublic: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [favList, setFavList] = useState<any>(null);
  const [recentList, setRecentList] = useState<any>(null);
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [listCount, setListCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favVideos, setFavVideos] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Critique: Fetch user by username, then fetch lists, submissions, followers, following
  useEffect(() => {
    if (!username) return;
    setLoading(true);
    
    const fetchProfileData = async () => {
      try {
        // Get user data by username
        const userData = await getUserByUsername(username);
        setProfileUser(userData);

        // Fetch all related data for this user
        const [listsData, submissionsData, followersData, followingData] = await Promise.all([
          getListsByUser(userData._id),
          getSubmissionsByUser(userData._id),
          fetch(`${import.meta.env.VITE_API_URL}/users/${userData._id}/followers`).then(res => res.json()),
          getFollowingUsers(userData._id)
        ]);

        setLists(listsData);
        const fav = listsData.find((l: any) => l.isDefault);
        setFavList(fav);
        setRecentList(fav);
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
                const videoId = typeof item.videoId === 'object' ? item.videoId._id : item.videoId;
                if (!videoId) return null;
                return await getVideoById(videoId);
              } catch {
                return null;
              }
            })
          );
          setFavVideos(videos.filter(Boolean));
        } else {
          setFavVideos([]);
        }

        // Recent Activity: fetch video details for up to 4 most recent submissions
        if (submissionsData && submissionsData.length > 0) {
          const sorted = submissionsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const recent = await Promise.all(
            sorted.slice(0, 4).map(async (submission: any) => {
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

        // Check if current user is following this profile
        if (currentUser) {
          setIsFollowing(followersData.some((f: any) => f._id === currentUser.id));
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, currentUser]);

  // Critique: Follow/unfollow logic
  const handleFollow = async () => {
    if (!currentUser || !profileUser) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUser.id, followingId: profileUser._id })
      });
      setIsFollowing(true);
      setFollowersCount(followersCount + 1);
    } catch (err) {
      console.error('Error following user:', err);
    }
  };
  const handleUnfollow = async () => {
    if (!currentUser || !profileUser) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/follow`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUser.id, followingId: profileUser._id })
      });
      setIsFollowing(false);
      setFollowersCount(followersCount - 1);
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

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
      }
      
      .video-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Loading and error states with modern styling
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

  if (error || !profileUser) {
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
            {error || 'Profile not found'}
          </div>
          <div style={{
            fontSize: '16px',
            color: 'rgba(255, 107, 107, 0.7)',
            fontFamily: 'Lora, serif'
          }}>
            Please check the username and try again
          </div>
        </div>
      </div>
    );
  }

  // Helper to get video thumbnail
  const getThumbnail = (video: any) => {
    if (!video) return '/logo.png';
    return video.thumbnailUrl_youtube || '/logo.png';
  };
  // Helper to get video title
  const getTitle = (item: any) => {
    if (item.videoId && typeof item.videoId === 'object' && item.videoId.title) {
      return item.videoId.title;
    }
    return 'Untitled';
  };
  const renderStars = (count = 4) => (
    <span style={{ color: '#FFD700', fontSize: 24, letterSpacing: 2 }}>
      {'★'.repeat(count)}<span style={{ color: '#DFD0B8' }}>{'★'.repeat(5 - count)}</span>
    </span>
  );

  // Critique: Render same layout as Profile, but with follow/unfollow button if not self
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
      {/* Header/Nav - keeping unchanged */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <img
          src="/logo.png"
          alt="Anv Logo"
          style={{
            position: 'absolute',
            left: 19,
            top: 21,
            width: 'auto',
            height: 60,
            zIndex: 10,
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
          onClick={() => navigate('/')}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        <div style={{
          width: '100%',
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 97,
          borderBottom: '1px solid rgba(223, 208, 184, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: 15,
            fontFamily: 'Lora, serif',
            fontSize: 24,
            fontWeight: 700,
            marginLeft: 983
          }}>
            <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/home')}>HOME</span>
            <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/discover')}>DISCOVER</span>
            <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/profile')}>PROFILE</span>
            <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/about')}>ABOUT</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginTop: 48, marginLeft: 80 }}>
        {/* Avatar */}
        <div style={{ width: 160, height: 160, borderRadius: '50%', overflow: 'hidden', background: '#1A1A1A', border: '4px solid #DFD0B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={profileUser.avatarUrl || '/logo.png'} alt="avatar" style={{ width: 140, height: 140, borderRadius: '50%' }} />
        </div>
        {/* User Info */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: 'Alfa Slab One, serif', fontSize: 56, color: '#DFD0B8', fontWeight: 700 }}>{profileUser.name}</div>
          <div style={{ fontSize: 22, color: '#DFD0B8', opacity: 0.7, marginTop: 2 }}>@{profileUser.username}</div>
          {/* Show follow/unfollow if not self */}
          {currentUser && currentUser.username !== profileUser.username && (
            isFollowing ? (
              <button style={{ marginTop: 8, marginRight: 16, fontFamily: 'Lora, serif', fontSize: 18, background: '#DFD0B8', color: '#141414', border: 'none', borderRadius: 8, padding: '4px 16px', fontWeight: 700, cursor: 'pointer' }} onClick={handleUnfollow}>Unfollow</button>
            ) : (
              <button style={{ marginTop: 8, marginRight: 16, fontFamily: 'Lora, serif', fontSize: 18, background: '#DFD0B8', color: '#141414', border: 'none', borderRadius: 8, padding: '4px 16px', fontWeight: 700, cursor: 'pointer' }} onClick={handleFollow}>Follow</button>
            )
          )}
          {/* Share button placeholder */}
          <span style={{ display: 'inline-block', width: 32, height: 32, borderRadius: '50%', background: '#DFD0B8', marginLeft: 8, verticalAlign: 'middle' }} />
          <span style={{ marginLeft: 8, fontSize: 16, color: '#DFD0B8', opacity: 0.7 }}>share button</span>
          <div style={{ fontSize: 18, color: '#DFD0B8', marginTop: 12 }}>{profileUser.bio}</div>
          <div style={{ fontSize: 16, color: '#DFD0B8', opacity: 0.7, marginTop: 4 }}>Member since {new Date(profileUser.createdAt).getFullYear()}</div>
        </div>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 48, marginLeft: 120, marginTop: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#DFD0B8' }}>{submissionCount}</div>
            <div style={{ fontSize: 20, color: '#DFD0B8', opacity: 0.8 }}>Videos Added</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#DFD0B8' }}>{listCount}</div>
            <div style={{ fontSize: 20, color: '#DFD0B8', opacity: 0.8 }}>Lists</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#DFD0B8' }}>{followersCount}</div>
            <div style={{ fontSize: 20, color: '#DFD0B8', opacity: 0.8 }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#DFD0B8' }}>{followingCount}</div>
            <div style={{ fontSize: 20, color: '#DFD0B8', opacity: 0.8 }}>Following</div>
          </div>
        </div>
      </div>
      {/* Favs */}
      <div style={{ marginTop: 64, marginLeft: 48, marginRight: 48 }}>
        <div style={{ fontFamily: 'Lora, serif', fontSize: 40, fontWeight: 700, color: '#DFD0B8', marginBottom: 16 }}>Favs</div>
        <div style={{ display: 'flex', gap: 32 }}>
          {favVideos.length === 0 ? (
            <div style={{ color: '#AFB774' }}>No favorites yet.</div>
          ) : (
            favVideos.map((video: any, idx: number) => (
              <div key={video._id || idx} style={{ width: 320, height: 180, borderRadius: 32, overflow: 'hidden', background: '#1A1A1A', border: '3px solid #848484', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
              onClick={e => {
                navigate('/home', { state: { videoId: video._id } });
              }}>
                <img src={getThumbnail(video)} alt={video.title_youtube || video.title || 'Untitled'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 32 }} />
              </div>
            ))
          )}
        </div>
      </div>
      {/* Recent Activity */}
      <div style={{ marginTop: 48, marginLeft: 48, marginRight: 48 }}>
        <div style={{ fontFamily: 'Lora, serif', fontSize: 40, fontWeight: 700, color: '#DFD0B8', marginBottom: 16 }}>Recent Activity</div>
        <div style={{ display: 'flex', gap: 32 }}>
          {recentActivities.length === 0 ? (
            <div style={{ color: '#AFB774' }}>No recent activity.</div>
          ) : (
            recentActivities.map((video: any, idx: number) => (
              <div key={video._id || idx} style={{ width: 320, height: 180, borderRadius: 32, overflow: 'hidden', background: '#1A1A1A', border: '3px solid #848484', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }} onClick={e => {
                navigate('/home', { state: { videoId: video._id } });
              }}>
                <img src={getThumbnail(video)} alt={video.title_youtube || video.title || 'Untitled'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 32 }} />
              </div>
            ))
          )}
        </div>
      </div>
      {/* Following */}
      <div style={{ marginTop: 48, marginLeft: 48, marginRight: 48, marginBottom: 64 }}>
        <div style={{ fontFamily: 'Lora, serif', fontSize: 40, fontWeight: 700, color: '#DFD0B8', marginBottom: 16 }}>Following</div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', maxWidth: 1200 }}>
          {followingUsers.length === 0 ? (
            <div style={{ color: '#AFB774' }}>Not following anyone yet.</div>
          ) : (
            followingUsers.map((f, idx) => (
              <div key={f._id || idx} style={{ width: 56, height: 56, borderRadius: '50%', background: '#DFD0B8', opacity: 0.9, display: 'inline-block', margin: 8, overflow: 'hidden', border: '2px solid #AFB774', cursor: 'pointer' }} onClick={() => navigate(`/profile/${f.username}`)}>
                <img src={f.avatarUrl || '/logo.png'} alt={f.username || 'user'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfilePublic; 