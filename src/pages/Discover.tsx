import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getCategoryById } from '../services/categoryService';
import { getLatestSubmissionByVideoId } from '../services/videoService';

const API_URL = import.meta.env.VITE_API_URL;

interface Video {
  _id: string;
  title_youtube?: string;
  thumbnailUrl_youtube?: string;
  youtubeVideoId?: string;
  categoryId?: string | { name: string };
  uploadDate_youtube?: string;
  duration_seconds?: number;
  bestDescription?: string | null;
  trendingCount?: number;
  trendingAvgRating?: number;
}

interface FriendFeed {
  friend: { id: string; username: string };
  recentVideos: Video[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const TABS = [
  { label: 'FRIENDS ARE WATCHING', value: 'friends' },
  { label: 'SUNDAY PICKS', value: 'sunday' },
  { label: 'TRENDING THIS WEEK', value: 'trending' },
];

const SORT_OPTIONS = [
  { label: 'POPULARITY', value: 'popularity' },
  { label: 'NEWEST', value: 'newest' },
  { label: 'RATING (HIGH TO LOW)', value: 'rating_desc' },
  { label: 'RATING (LOW TO HIGH)', value: 'rating_asc' },
];

const Discover: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sort, setSort] = useState<string>('popularity');
  const [tab, setTab] = useState<string>('default');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friendsFeed, setFriendsFeed] = useState<FriendFeed[]>([]);
  const navigate = useNavigate();
  // TODO: Replace with real userId from auth context
  const userId = 'CURRENT_USER_ID';
  const [categoryMap, setCategoryMap] = useState<{ [videoId: string]: string }>({});

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    if (tab === 'default') {
      let url = `${API_URL}/videos`;
      if (selectedCategory) url += `?category=${selectedCategory}`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          let vids = data;
          if (sort === 'newest') {
            vids = vids.sort((a: any, b: any) => new Date(b.uploadDate_youtube).getTime() - new Date(a.uploadDate_youtube).getTime());
          } else if (sort === 'rating_desc') {
            vids = vids.sort((a: any, b: any) => (b.trendingAvgRating || 0) - (a.trendingAvgRating || 0));
          } else if (sort === 'rating_asc') {
            vids = vids.sort((a: any, b: any) => (a.trendingAvgRating || 0) - (b.trendingAvgRating || 0));
          }
          setVideos(vids);
        })
        .catch(() => setError('Failed to load videos'))
        .finally(() => setLoading(false));
    } else if (tab === 'friends') {
      fetch(`${API_URL}/submissions/friends-feed?userId=${userId}`)
        .then(res => res.json())
        .then(setFriendsFeed)
        .catch(() => setError('Failed to load friends feed'))
        .finally(() => setLoading(false));
    } else if (tab === 'sunday') {
      fetch(`${API_URL}/videos/sunday-picks`)
        .then(res => res.json())
        .then(setVideos)
        .catch(() => setError('Failed to load Sunday Picks'))
        .finally(() => setLoading(false));
    } else if (tab === 'trending') {
      fetch(`${API_URL}/videos/trending`)
        .then(res => res.json())
        .then(setVideos)
        .catch(() => setError('Failed to load trending videos'))
        .finally(() => setLoading(false));
    }
  }, [tab, selectedCategory, sort]);

  useEffect(() => {
    // For all videos, fetch latest submission and cache category name
    if (videos.length > 0) {
      videos.forEach(video => {
        if (!categoryMap[video._id]) {
          getLatestSubmissionByVideoId(video._id).then(sub => {
            if (sub && sub.categoryId && typeof sub.categoryId === 'object' && sub.categoryId.name) {
              setCategoryMap(prev => ({ ...prev, [video._id]: sub.categoryId.name }));
            }
          }).catch(() => {
            setCategoryMap(prev => ({ ...prev, [video._id]: '' }));
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [videos]);

  // Helper to get video thumbnail
  const getThumbnail = (video: Video) => {
    const id = video.youtubeVideoId || (video.thumbnailUrl_youtube && video.thumbnailUrl_youtube.split('/')[4]);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/logo.png';
  };

  // Helper to get category name from latest submission
  const getCategoryName = (video: Video) => categoryMap[video._id] || '';

  // Helper to format duration (beautified)
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Critique: For accessibility, all cards are focusable and have aria-labels. For maintainability, refactor to a VideoCard component and CSS-in-JS later.

  // Video Card Hover Overlay (Frame 28 style, two layouts)
  const HoverOverlay = ({ video }: { video: Video }) => {
    const hasDescription = Boolean(video.bestDescription);
    if (hasDescription) {
      // With description: two-row layout, as before
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(20,20,20,0.55)',
            color: '#DFD0B8',
            borderRadius: 32,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            padding: 28,
            opacity: 1,
            pointerEvents: 'auto',
            zIndex: 2,
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontFamily: 'Bellefair, serif',
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 0,
              textAlign: 'left',
              maxWidth: 340,
              lineHeight: 1.1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              whiteSpace: 'normal',
              textOverflow: 'ellipsis',
              alignSelf: 'flex-start',
            }}
          >
            {video.title_youtube}
          </div>
          {/* Description (centered) */}
          <div
            style={{
              fontSize: 16,
              margin: '18px 0',
              textAlign: 'center',
              maxWidth: 340,
              color: '#DFD0B8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              fontWeight: 400,
              alignSelf: 'center',
            }}
          >
            <span style={{ fontWeight: 700 }}>description:</span> <span>{video.bestDescription}</span>
          </div>
          {/* Bottom row: metadata left, buttons right */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginTop: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15, color: '#DFD0B8', fontWeight: 400 }}>
              <span>{getCategoryName(video)}</span>
              <span>•</span>
              <span>4.8</span>
              <span>•</span>
              <span>{formatDuration(video.duration_seconds)}</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                style={{ background: '#210f37', color: '#DFD0B8', borderRadius: 16, padding: '4px 12px', fontSize: 15, fontWeight: 700, cursor: 'pointer', border: '1px solid #AFB774' }}
                onClick={e => {
                  e.stopPropagation();
                  const id = video.youtubeVideoId;
                  if (id) window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
                }}
              >watch</button>
              <button
                style={{ background: '#210f37', color: '#DFD0B8',  borderRadius: 16, padding: '4px 12px', fontSize: 15, fontWeight: 700, cursor: 'pointer', border: '1px solid #AFB774' }}
                onClick={e => {
                  e.stopPropagation();
                  alert('Add to lists coming soon!');
                }}
              >add to lists</button>
            </div>
          </div>
        </div>
      );
    } else {
      // Without description: old layout, all centered
      return (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(20,20,20,0.55)',
            color: '#DFD0B8',
            borderRadius: 32,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 28,
            opacity: 1,
            pointerEvents: 'auto',
            zIndex: 2,
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s',
          }}
        >
          {/* Title centered */}
          <div
            style={{
              fontFamily: 'Bellefair, serif',
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 16,
              textAlign: 'center',
              maxWidth: 340,
              lineHeight: 1.1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              whiteSpace: 'normal',
              textOverflow: 'ellipsis',
              alignSelf: 'center',
            }}
          >
            {video.title_youtube}
          </div>
          {/* Metadata row centered below title */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15, color: '#DFD0B8', fontWeight: 400, marginBottom: 18 }}>
            <span>{getCategoryName(video)}</span>
            <span>•</span>
            <span>4.8</span>
            <span>•</span>
            <span>{formatDuration(video.duration_seconds)}</span>
          </div>
          {/* Buttons row centered below metadata */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              style={{ background: '#210f37', color: '#DFD0B8', border: 'none', borderRadius: 16, padding: '8px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
              onClick={e => {
                e.stopPropagation();
                const id = video.youtubeVideoId;
                if (id) window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
              }}
            >watch</button>
            <button
              style={{ background: '#210f37', color: '#DFD0B8', border: 'none', borderRadius: 16, padding: '8px 24px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
              onClick={e => {
                e.stopPropagation();
                alert('Add to lists coming soon!');
              }}
            >add to lists</button>
          </div>
        </div>
      );
    }
  };

  // Video Card
  const VideoCard = ({ video }: { video: Video }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        style={{
          borderRadius: 32,
          overflow: 'hidden',
          background: '#1A1A1A',
          boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.18)' : '0 2px 16px rgba(0,0,0,0.12)',
          position: 'relative',
          cursor: 'pointer',
          border: '2px solid #848484',
          minHeight: 210,
          transform: hovered ? 'scale(1.045)' : 'scale(1)',
          transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s',
        }}
        tabIndex={0}
        aria-label={video.title_youtube}
        onClick={() => navigate('/home', { state: { videoId: video._id } })}
        onKeyDown={e => { if (e.key === 'Enter') navigate('/home', { state: { videoId: video._id } }) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ position: 'relative', width: '100%', height: 210 }}>
          <img
            src={getThumbnail(video)}
            alt={video.title_youtube}
            style={{
              width: '100%',
              height: 210,
              objectFit: 'cover',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              filter: hovered ? 'blur(15px) brightness(0.9)' : 'none',
              transition: 'filter 0.18s',
            }}
          />
          {hovered && <HoverOverlay video={video} />}
        </div>
      </div>
    );
  };

  // Filter and sort logic (client-side fallback if backend does not support)
  useEffect(() => {
    if (tab === 'default' && videos.length > 0) {
      let filtered = videos;
      if (selectedCategory) {
        filtered = filtered.filter(v => {
          if (typeof v.categoryId === 'object' && v.categoryId && 'slug' in v.categoryId) {
            return v.categoryId.slug === selectedCategory;
          }
          return false;
        });
      }
      if (sort === 'newest') {
        filtered = filtered.sort((a: any, b: any) => new Date(b.uploadDate_youtube).getTime() - new Date(a.uploadDate_youtube).getTime());
      } else if (sort === 'rating_desc') {
        filtered = filtered.sort((a: any, b: any) => (b.trendingAvgRating || 0) - (a.trendingAvgRating || 0));
      } else if (sort === 'rating_asc') {
        filtered = filtered.sort((a: any, b: any) => (a.trendingAvgRating || 0) - (b.trendingAvgRating || 0));
      }
      setVideos([...filtered]);
    }
    // eslint-disable-next-line
  }, [selectedCategory, sort]);

  // Friends Feed Layout
  const FriendsFeed = () => (
    <div style={{ margin: '48px 48px 0 48px' }}>
      {friendsFeed.length === 0 ? (
        <div style={{ textAlign: 'center', fontSize: 24, color: '#DFD0B8' }}>No friends activity found.</div>
      ) : (
        friendsFeed.map(feed => (
          <div key={feed.friend.id} style={{ marginBottom: 48 }}>
            <div style={{ color: '#A0A0A0', fontSize: 18, marginBottom: 12 }}>@{feed.friend.username} recently added</div>
            <div style={{ display: 'flex', gap: 32 }}>
              {feed.recentVideos.map(video => <VideoCard key={video._id} video={video} />)}
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Main Render
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
          <span style={{ opacity: 0.6, cursor: 'pointer' }} onClick={() => { setTab('default'); }}>DISCOVER</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/profile')}>PROFILE</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/about')}>ABOUT</span>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 32, marginTop: 32, marginLeft: 32, fontSize: 28, fontFamily: 'Lora, serif', fontWeight: 700 }}>
        {TABS.map(t => (
          <span key={t.value} style={{ opacity: tab === t.value ? 0.6 : 1, cursor: 'pointer' }} onClick={() => setTab(t.value)}>{t.label}</span>
        ))}
      </div>
      {/* Filter/Sort Row (only for default tab) */}
      {tab === 'default' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 32, marginLeft: 32 }}>
          <div style={{ fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setSortOpen(s => !s)}>
            SORT BY <span style={{ fontSize: 18, marginLeft: 4 }}>⚲</span>
            {sortOpen && (
              <div style={{ position: 'absolute', background: '#1A1A1A', border: '1px solid #DFD0B8', borderRadius: 12, marginTop: 40, zIndex: 20, padding: 16 }}>
                {SORT_OPTIONS.map(opt => (
                  <div key={opt.value} style={{ padding: 8, cursor: 'pointer', color: sort === opt.value ? '#FFD700' : '#DFD0B8', fontWeight: sort === opt.value ? 700 : 400 }} onClick={() => { setSort(opt.value); setSortOpen(false); }}>{opt.label}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Main Content */}
      {loading ? (
        <div style={{ textAlign: 'center', fontSize: 32, color: '#DFD0B8', marginTop: 100 }}>Loading...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', fontSize: 24, color: '#ff4d4f', marginTop: 100 }}>{error}</div>
      ) : tab === 'friends' ? (
        <FriendsFeed />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, margin: '48px 48px 0 48px' }}>
          {videos.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', fontSize: 24, color: '#DFD0B8' }}>No videos found.</div>
          ) : (
            videos.map((video, idx) => (
              <VideoCard key={video._id + idx} video={video} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Discover; 