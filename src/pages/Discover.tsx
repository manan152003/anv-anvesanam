import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getCategoryById } from '../services/categoryService';
import { getLatestSubmissionByVideoId } from '../services/videoService';
import AddToListModal from '../components/AddToListModal';
import { useAuth } from '../context/AuthContext';
import { useSwipeable } from 'react-swipeable';
import { getYouTubeThumbnail } from '../utils/youtube';

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
  { label: 'DEFAULT', value: 'default' },
  { label: 'NEWEST', value: 'newest' },
  { label: 'RATING (HIGH TO LOW)', value: 'rating_desc' },
  { label: 'RATING (LOW TO HIGH)', value: 'rating_asc' },
];

const Discover: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sort, setSort] = useState<string>('default');
  const [tab, setTab] = useState<string>('default');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [friendsFeed, setFriendsFeed] = useState<FriendFeed[]>([]);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [categoryMap, setCategoryMap] = useState<{ [videoId: string]: string }>({});
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [sundayStack, setSundayStack] = useState<Video[]>([]);
  const sortRef = useRef<HTMLDivElement>(null);
  const [swipeAnimation, setSwipeAnimation] = useState<{ x: number; y: number; rotation: number }>({ x: 0, y: 0, rotation: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

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
            vids = vids.sort((a: any, b: any) => (b.avgRating || 0) - (a.avgRating || 0));
          } else if (sort === 'rating_asc') {
            vids = vids.sort((a: any, b: any) => (a.avgRating || 0) - (b.avgRating || 0));
          }
          setVideos(vids);
        })
        .catch(() => setError('Failed to load videos'))
        .finally(() => setLoading(false));
    } else if (tab === 'friends') {
      if (!isAuthenticated || !user?.id) {
        setFriendsFeed([]);
        setLoading(false);
        return;
      }
      fetch(`${API_URL}/submissions/friends-feed?userId=${user.id}`)
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
    if (!video) return '/logo.png';
    return video.thumbnailUrl_youtube || '/logo.png';
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
            position: 'absolute' as 'absolute',
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
            pointerEvents: 'auto' as 'auto',
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
            }}
          >
            {video.title_youtube || 'Untitled'}
          </div>
          {/* Description */}
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.4,
              opacity: 0.9,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {video.bestDescription}
          </div>
        </div>
      );
    }
    // Without description: single-row layout
    return (
      <div
        style={{
          position: 'absolute' as 'absolute',
          inset: 0,
          background: 'rgba(20,20,20,0.55)',
          color: '#DFD0B8',
          borderRadius: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'stretch',
          padding: 28,
          opacity: 1,
          pointerEvents: 'auto' as 'auto',
          zIndex: 2,
          boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s',
        }}
      >
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
          }}
        >
          {video.title_youtube || 'Untitled'}
        </div>
      </div>
    );
  };

  // Video Card
  const VideoCard = ({ video, cardWidth = 432, cardHeight = 243, disableHover = false }: { video: Video, cardWidth?: number, cardHeight?: number, disableHover?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasDescription = Boolean(video.bestDescription);

    return (
      <div
        style={{
          width: cardWidth,
          height: cardHeight,
          borderRadius: 32,
          overflow: 'hidden',
          background: '#1A1A1A',
          border: '3px solid #848484',
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isHovered ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
        }}
        onMouseEnter={() => !disableHover && setIsHovered(true)}
        onMouseLeave={() => !disableHover && setIsHovered(false)}
        onClick={() => navigate('/home', { state: { videoId: video._id } })}
        tabIndex={0}
        aria-label={video.title_youtube}
        onKeyDown={e => { if (e.key === 'Enter') navigate('/home', { state: { videoId: video._id } }); }}
      >
        <img
          src={getThumbnail(video)}
          alt={video.title_youtube || 'Untitled'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 32,
            display: 'block',
          }}
        />
        {!disableHover && isHovered && <HoverOverlay video={video} />}
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
        filtered = filtered.sort((a: any, b: any) => (b.avgRating || 0) - (a.avgRating || 0));
      } else if (sort === 'rating_asc') {
        filtered = filtered.sort((a: any, b: any) => (a.avgRating || 0) - (b.avgRating || 0));
      }
      setVideos([...filtered]);
    }
    // eslint-disable-next-line
  }, [selectedCategory, sort]);

  // Friends Feed Layout (Refactored & Critiqued)
  const FriendsFeed = () => (
    <div style={{ margin: '48px 48px 0 48px' }}>
      {friendsFeed.length === 0 ? (
        <div style={{ textAlign: 'center', fontSize: 24, color: '#DFD0B8' }}>No friends activity found.</div>
      ) : (
        friendsFeed.map(feed => (
          <div key={feed.friend.id} style={{ marginBottom: 48 }}>
            <div style={{ color: '#A0A0A0', fontSize: 18, marginBottom: 4 }}>
              @{feed.friend.username} <span style={{ fontWeight: 400, fontSize: 16 }}>recently added</span>
            </div>
            {/* Critique: Add a horizontal line for separation */}
            <div style={{ borderBottom: '1px solid #444', margin: '8px 0 20px 0', width: '100%' }} />
            <div style={{ display: 'flex', gap: 32 }}>
              {feed.recentVideos.map(video => (
                <div key={video._id} style={{ width: 320, height: 180, display: 'flex', alignItems: 'center' }}>
                  <VideoCard video={video} cardWidth={320} cardHeight={180} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Sunday Picks Layout (Stacked Swipeable Cards)
  useEffect(() => {
    if (tab === 'sunday' && Array.isArray(videos)) {
      setSundayStack(videos);
    }
  }, [tab, videos]);

  const handleSwipe = (dir: 'left' | 'right') => {
    if (!sundayStack.length) return;
    const topVideo = sundayStack[0];
    if (dir === 'right') {
      navigate('/home', { state: { videoId: topVideo._id } });
    } else if (dir === 'left') {
      setSundayStack(prev => prev.slice(1));
    }
  };

  const SundayPicks = () => {
    if (!Array.isArray(sundayStack)) {
      return <div style={{ textAlign: 'center', color: '#ff4d4f', fontSize: 24 }}>Failed to load Sunday Picks</div>;
    }

    // Show completion message when stack is empty
    if (sundayStack.length === 0) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '70vh',
          gap: '32px'
        }}>
          <div style={{ 
            fontSize: 32, 
            fontFamily: 'Bellefair, serif', 
            color: '#DFD0B8', 
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: 1.4
          }}>
            That's it for today! Come back tomorrow for more curated picks.
          </div>
          <button
            onClick={() => {
              setSundayStack(videos);
              setSwipeAnimation({ x: 0, y: 0, rotation: 0 });
            }}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontFamily: 'Lora, serif',
              color: '#DFD0B8',
              background: 'rgba(223, 208, 184, 0.1)',
              border: '1px solid rgba(223, 208, 184, 0.2)',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              ':hover': {
                background: 'rgba(223, 208, 184, 0.15)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)'
              }
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(223, 208, 184, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(223, 208, 184, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
          >
            Do Again
          </button>
        </div>
      );
    }

    // Only show top two cards for the stack effect
    const visibleCards = sundayStack.slice(0, 2);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', position: 'relative' }}>
        <div style={{ fontSize: 24, fontFamily: 'Lora, serif', marginBottom: 32, color: '#DFD0B8', opacity: 0.9 }}>
          specially curated just for you.
        </div>
        <div style={{ position: 'relative', width: 520, height: 340, marginBottom: 32 }}>
          {visibleCards.map((video, idx) => {
            const isTop = idx === 0;
            // Top card: normal, swipeable
            // Second card: offset, scaled, faded, not swipeable
            const style: React.CSSProperties = isTop
              ? {
                  position: 'absolute' as 'absolute',
                  left: 0,
                  top: 0,
                  width: 520,
                  height: 340,
                  zIndex: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                  opacity: 1,
                  transition: isSwiping ? 'none' : 'all 0.2s cubic-bezier(.4,2,.6,1)',
                  touchAction: 'pan-y',
                  userSelect: 'auto' as 'auto',
                  pointerEvents: 'auto' as 'auto',
                  transform: `translate(${swipeAnimation.x}px, ${swipeAnimation.y}px) rotate(${swipeAnimation.rotation}deg)`,
                }
              : {
                  position: 'absolute' as 'absolute',
                  left: 0,
                  top: 30,
                  width: 520,
                  height: 340,
                  zIndex: 1,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
                  cursor: 'default',
                  opacity: 0.7,
                  transform: 'scale(0.96)',
                  transition: 'all 0.2s cubic-bezier(.4,2,.6,1)',
                  touchAction: 'none',
                  userSelect: 'none' as 'none',
                  pointerEvents: 'none' as 'none',
                };
            const handlers = isTop
              ? useSwipeable({
                  onSwiping: (e) => {
                    setIsSwiping(true);
                    const x = e.deltaX;
                    const y = e.deltaY * 0.3; // Reduce vertical movement
                    const rotation = x * 0.1; // Rotate based on horizontal movement
                    setSwipeAnimation({ x, y, rotation });
                  },
                  onSwipedLeft: () => {
                    setIsSwiping(false);
                    setSwipeAnimation({ x: -1000, y: 0, rotation: -30 });
                    setTimeout(() => {
                      handleSwipe('left');
                      setSwipeAnimation({ x: 0, y: 0, rotation: 0 });
                    }, 300);
                  },
                  onSwipedRight: () => {
                    setIsSwiping(false);
                    setSwipeAnimation({ x: 1000, y: 0, rotation: 30 });
                    setTimeout(() => {
                      handleSwipe('right');
                      setSwipeAnimation({ x: 0, y: 0, rotation: 0 });
                    }, 300);
                  },
                  onSwiped: () => {
                    setIsSwiping(false);
                    setSwipeAnimation({ x: 0, y: 0, rotation: 0 });
                  },
                  trackMouse: true,
                })
              : {};
            return (
              <div
                key={video._id}
                {...handlers}
                style={style}
                onClick={isTop ? () => navigate('/home', { state: { videoId: video._id } }) : undefined}
              >
                <VideoCard video={video} cardWidth={520} cardHeight={340} disableHover={true} />
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 22, fontFamily: 'Lora, serif', color: '#DFD0B8', opacity: 0.7, marginTop: 24 }}>
          swipe right to watch, left to discard
        </div>
      </div>
    );
  };

  // Trending This Week Layout
  const TrendingThisWeek = () => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const trendingVideos = videos.slice(0, 8); // up to 8 for stack cycling
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Rotate every 5 seconds
    useEffect(() => {
      if (tab !== 'trending' || trendingVideos.length < 2) return;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIdx(prev => (prev + 1) % trendingVideos.length);
      }, 5000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [tab, trendingVideos.length]);

    if (trendingVideos.length === 0) {
      return <div style={{ textAlign: 'center', color: '#ff4d4f', fontSize: 24 }}>No trending videos</div>;
    }

    // Calculate stack: next 4 videos after currentIdx, wrapping around
    const stack = [];
    for (let i = 0; i < Math.min(5, trendingVideos.length); i++) {
      stack.push(trendingVideos[(currentIdx + i) % trendingVideos.length]);
    }
    // The front card (bottom of stack) index
    const frontIdx = (currentIdx + stack.length - 1) % trendingVideos.length;
    // Remove the front card from the stack for display
    const stackWithoutFront = stack.filter((video, idx) => ((currentIdx + idx) % trendingVideos.length) !== frontIdx);

    // Minimal stack card (no border, no shadow, no title)
    const StackCard = ({ video, onClick }: { video: Video, onClick: () => void }) => (
      <div
        style={{
          width: 241,
          height: 141,
          borderRadius: 45,
          overflow: 'hidden',
          cursor: 'pointer',
          margin: 0,
          boxShadow: 'none',
          border: 'none',
          background: '#1A1A1A',
        }}
        tabIndex={0}
        aria-label={video.title_youtube}
        onClick={onClick}
        onKeyDown={e => { if (e.key === 'Enter') onClick(); }}
      >
        <img
          src={getThumbnail(video)}
          alt={video.title_youtube}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 45,
            display: 'block',
          }}
        />
      </div>
    );

    // Critique: Main card is 1350x759, stack is 4 cards, 241x141, 19px gap, top-right overlay, no border/shadow/title.
    return (
      <div style={{marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', position: 'relative'}}>
        {/* Big window with overlay stack */}
        <div style={{ width: 1350, height: 759, borderRadius: 36, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', background: '#1A1A1A', position: 'relative' }}>
          <VideoCard video={trendingVideos[frontIdx]} cardWidth={1350} cardHeight={759} disableHover={true} />
          {/* Overlay stack in top right, overlapping vertically with only bottom visible */}
          <div style={{ position: 'absolute', top: 212, right: 19, width: 241, height: 141 + (stackWithoutFront.length - 1) * 50, zIndex: 10, pointerEvents: 'auto' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {stackWithoutFront.map((video, idx) => (
                <div
                  key={video._id}
                  style={{
                    position: 'absolute',
                    top: idx * 50, // Overlap so only bottom 50px is visible
                    left: 0,
                    width: 241,
                    height: 141,
                    zIndex: idx + 1, // Last card is on top
                    pointerEvents: 'auto',
                  }}
                >
                  <StackCard video={video} onClick={() => setCurrentIdx((currentIdx + idx) % trendingVideos.length)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sort Dropdown Component
  const SortDropdown = () => (
    <div ref={sortRef} style={{ position: 'relative', zIndex: 110 }}>
      <div 
        style={{
          fontSize: '18px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          borderRadius: '16px',
          background: sortOpen 
            ? 'rgba(223, 208, 184, 0.15)' 
            : 'rgba(223, 208, 184, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(223, 208, 184, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          color: '#DFD0B8',
          fontFamily: 'Lora, serif',
          letterSpacing: '0.5px',
          boxShadow: sortOpen 
            ? '0 8px 25px rgba(0, 0, 0, 0.3)' 
            : '0 4px 15px rgba(0, 0, 0, 0.2)',
          transform: sortOpen ? 'translateY(-2px)' : 'translateY(0)',
          zIndex: 120
        }} 
        onClick={() => setSortOpen(s => !s)}
        onMouseEnter={e => {
          if (!sortOpen) {
            e.currentTarget.style.background = 'rgba(223, 208, 184, 0.12)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
          }
        }}
        onMouseLeave={e => {
          if (!sortOpen) {
            e.currentTarget.style.background = 'rgba(223, 208, 184, 0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
          }
        }}
      >
        SORT BY
        <span style={{ 
          transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fontSize: '14px',
          opacity: 0.8
        }}>
          ▼
        </span>
      </div>
      {sortOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '12px',
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(223, 208, 184, 0.2)',
          borderRadius: '20px',
          zIndex: 130,
          padding: '12px',
          minWidth: '320px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          animation: 'fadeInDown 0.3s ease-out',
          overflow: 'hidden'
        }}>
          {SORT_OPTIONS.map((opt, index) => (
            <div 
              key={opt.value}
              style={{
                padding: '14px 18px',
                cursor: 'pointer',
                color: sort === opt.value ? '#FFFFFF' : '#DFD0B8',
                fontWeight: sort === opt.value ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                background: sort === opt.value 
                  ? 'rgba(223, 208, 184, 0.15)' 
                  : 'transparent',
                marginBottom: index < SORT_OPTIONS.length - 1 ? '4px' : '0',
                fontFamily: 'Lora, serif',
                fontSize: '16px',
                letterSpacing: '0.3px',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 140
              }}
              onClick={() => { 
                setSort(opt.value); 
                setSortOpen(false); 
              }}
              onMouseEnter={e => {
                if (sort !== opt.value) {
                  e.currentTarget.style.background = 'rgba(223, 208, 184, 0.08)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={e => {
                if (sort !== opt.value) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              {sort === opt.value && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: 'linear-gradient(135deg, #DFD0B8, #C9B896)',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px rgba(223, 208, 184, 0.5)'
                }} />
              )}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Add CSS animations to the document
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
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
      
      @keyframes fadeInDown {
        from { 
          opacity: 0; 
          transform: translateY(-20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes fadeInRight {
        from { 
          opacity: 0; 
          transform: translateX(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0; 
          transform: scale(0.9) translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: scale(1) translateY(0); 
        }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        gap: 32px;
        margin: 48px;
        animation: fadeInUp 0.8s ease-out;
      }
      
      .modern-tab {
        position: relative;
        overflow: hidden;
      }
      
      .modern-tab::before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #DFD0B8, #C9B896);
        transform: scaleX(0);
        transition: transform 0.3s ease;
        border-radius: 2px;
      }
      
      .modern-tab.active::before {
        transform: scaleX(1);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Main Render
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      color: '#DFD0B8',
      fontFamily: 'Lora, serif',
      position: 'relative',
      overflow: 'auto'
    }}>
      {/* Tabs with modern styling */}
      <div style={{
        display: 'flex',
        gap: '40px',
        marginTop: '40px',
        marginLeft: '40px',
        fontSize: '28px',
        fontFamily: 'Lora, serif',
        fontWeight: 700,
        position: 'relative',
        zIndex: 1
      }}>
        {tab !== 'default' && (
          <span
            className="modern-tab"
            style={{
              opacity: 1,
              cursor: 'pointer',
              padding: '12px 0',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              letterSpacing: '0.5px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#DFD0B8',
            }}
            onClick={() => setTab('default')}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '24px' }}>←</span>
            DISCOVER
          </span>
        )}
        {TABS.map(t => (
          <span
            key={t.value}
            className={`modern-tab ${tab === t.value ? 'active' : ''}`}
            style={{
              opacity: tab === t.value ? 1 : 0.7,
              cursor: 'pointer',
              padding: '12px 0',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              letterSpacing: '0.5px',
              position: 'relative'
            }}
            onClick={() => setTab(t.value)}
            onMouseEnter={e => {
              if (tab !== t.value) {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (tab !== t.value) {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {t.label}
          </span>
        ))}
      </div>

      {/* Sort Row (only for default tab) with modern styling */}
      {tab === 'default' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          marginTop: '32px',
          marginLeft: '40px',
          position: 'relative',
          zIndex: 105
        }}>
          <SortDropdown />
        </div>
      )}

      {/* Main Content with modern styling */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {loading ? (
          <div style={{ 
            minHeight: '50vh', 
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
                Loading content...
              </div>
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
            margin: '40px',
            animation: 'fadeInUp 0.8s ease-out'
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
              Please try refreshing the page or check your connection
            </div>
          </div>
        ) : tab === 'friends' ? (
          <FriendsFeed />
        ) : tab === 'sunday' ? (
          <SundayPicks />
        ) : tab === 'trending' ? (
          <TrendingThisWeek />
        ) : (
          <div className="video-grid">
            {videos.length === 0 ? (
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
                  fontFamily: 'Bellefair, serif',
                  marginBottom: '10px'
                }}>
                  No videos found
                </div>
                <div style={{
                  fontSize: '16px',
                  color: 'rgba(223, 208, 184, 0.7)',
                  fontFamily: 'Lora, serif'
                }}>
                  Try adjusting your filters or check back later
                </div>
              </div>
            ) : (
              videos.map((video, idx) => (
                <div
                  key={video._id + idx}
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${idx * 0.1}s both`
                  }}
                >
                  <VideoCard video={video} />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add to List Modal */}
      {selectedVideoId && (
        <AddToListModal
          isOpen={isAddToListModalOpen}
          onClose={() => setIsAddToListModalOpen(false)}
          videoId={selectedVideoId}
        />
      )}
    </div>
  );
};

export default Discover; 