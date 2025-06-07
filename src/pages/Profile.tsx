import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLists } from '../services/listService';
import { getLatestSubmissionByVideoId, getSubmissionsByUser, getVideoById } from '../services/videoService';
import { getFollowingUsers } from '../services/userService';

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
        // Recent Activity: fetch video details for up to 4 most recent submissions
        if (submissionsData && submissionsData.length > 0) {
          const sorted = submissionsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const recent = await Promise.all(
            sorted.slice(0, 4).map(async (submission: any) => {
              try {
                const video = await getVideoById(submission.videoId);
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

  // Critique: Loading and error states are handled simply for now. Improve with skeletons/spinners for better UX.
  if (loading) return <div style={{ color: '#DFD0B8', fontFamily: 'Lora, serif', fontSize: 32, textAlign: 'center', marginTop: 100 }}>Loading...</div>;
  if (error) return <div style={{ color: '#ff4d4f', fontFamily: 'Lora, serif', fontSize: 24, textAlign: 'center', marginTop: 100 }}>{error}</div>;

  // Critique: Defensive checks for missing user or lists
  if (!user || !favList || !recentList) return <div style={{ color: '#DFD0B8', fontFamily: 'Lora, serif', fontSize: 24, textAlign: 'center', marginTop: 100 }}>Profile not found</div>;

  // Helper to get video thumbnail
  const getThumbnail = (item: any) => {
    if (item.videoId && typeof item.videoId === 'object' && item.videoId.thumbnailUrl) {
      return item.videoId.thumbnailUrl;
    }
    return '/logo.png';
  };

  // Helper to get video title
  const getTitle = (item: any) => {
    if (item.videoId && typeof item.videoId === 'object' && item.videoId.title) {
      return item.videoId.title;
    }
    return 'Untitled';
  };

  // Critique: For now, use static stars (4/5) for all videos. Replace with real ratings if available.
  const renderStars = (count = 4) => (
    <span style={{ color: '#FFD700', fontSize: 24, letterSpacing: 2 }}>
      {'★'.repeat(count)}<span style={{ color: '#DFD0B8' }}>{'★'.repeat(5 - count)}</span>
    </span>
  );

  // Critique: Favs and Recent Activity use the same list for now. Replace with real data if available.
  return (
    <div style={{ minHeight: '100vh', background: '#141414', color: '#DFD0B8', fontFamily: 'Lora, serif' }}>
      {/* Header/Nav */}
      <img
        src="/logo.png"
        alt="Anv Logo"
        style={{ position: 'absolute', left: 19, top: 21, width: 'auto', height: 60, zIndex: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')} />
      <div style={{ width: '100%', background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 97 }}>
        <div style={{ display: 'flex', gap: 15, fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 700, marginLeft: 983 }}>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/home')}>HOME</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/discover')}>DISCOVER</span>
          <span style={{ opacity: 0.6, cursor: 'pointer',  }} onClick={() => navigate('/profile')}>PROFILE</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/about')}>ABOUT</span>
        </div>
      </div>
      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginTop: 48, marginLeft: 80 }}>
        {/* Avatar */}
        <div style={{ width: 160, height: 160, borderRadius: '50%', overflow: 'hidden', background: '#1A1A1A', border: '4px solid #DFD0B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Critique: Use a static avatar for now. Replace with user.avatar if available. */}
          <img src={user.avatarUrl} alt="avatar" style={{ width: 140, height: 140, borderRadius: '50%' }} />
        </div>
        {/* User Info */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: 'Alfa Slab One, serif', fontSize: 56, color: '#DFD0B8', fontWeight: 700 }}>{user.name}</div>
          <div style={{ fontSize: 22, color: '#DFD0B8', opacity: 0.7, marginTop: 2 }}>@{user.username}</div>
          <button style={{ marginTop: 8, marginRight: 16, fontFamily: 'Lora, serif', fontSize: 18, background: '#DFD0B8', color: '#141414', border: 'none', borderRadius: 8, padding: '4px 16px', fontWeight: 700, cursor: 'pointer' }}>edit profile</button>
          {/* Logout button */}
          <button style={{ marginTop: 8, marginRight: 16, fontFamily: 'Lora, serif', fontSize: 18, background: '#AFB774', color: '#141414', border: 'none', borderRadius: 8, padding: '4px 16px', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => { logout(); navigate('/login'); }}>
            logout
          </button>
          {/* Share button placeholder */}
          <span style={{ display: 'inline-block', width: 32, height: 32, borderRadius: '50%', background: '#DFD0B8', marginLeft: 8, verticalAlign: 'middle' }} />
          <span style={{ marginLeft: 8, fontSize: 16, color: '#DFD0B8', opacity: 0.7 }}>share button</span>
          <div style={{ fontSize: 18, color: '#DFD0B8', marginTop: 12 }}>{user.bio}</div>
          <div style={{ fontSize: 16, color: '#DFD0B8', opacity: 0.7, marginTop: 4 }}>Member since 2025</div>
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
                <img src={video.thumbnailUrl_youtube || video.thumbnailUrl || '/logo.png'} alt={video.title_youtube || video.title || 'Untitled'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 32 }} />
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
                <img src={video.thumbnailUrl_youtube || video.thumbnailUrl || '/logo.png'} alt={video.title_youtube || video.title || 'Untitled'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 32 }} />
                {/* Optionally show rating or other info here */}
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
  );
};

export default Profile; 