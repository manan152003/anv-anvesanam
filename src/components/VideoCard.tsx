import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getYouTubeThumbnail } from '../utils/youtube';
import { useMobileView } from '../context/MobileViewContext';

interface Video {
  _id: string;
  youtube_id: string;
  title_youtube: string;
  // Add other video properties as needed
}

interface VideoCardProps {
  video: Video;
  onRatingChange?: (rating: number) => void;
  onRemove?: () => void;
  showRating?: boolean;
  showRemove?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onRatingChange, onRemove, showRating = true, showRemove = false }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const { isMobileView } = useMobileView();

  useEffect(() => {
    const loadThumbnail = async () => {
      if (video.youtube_id) {
        const url = await getYouTubeThumbnail(video.youtube_id);
        setThumbnailUrl(url);
      }
    };
    loadThumbnail();
  }, [video.youtube_id]);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    width: isMobileView ? '100%' : 'auto',
  };

  const thumbnailContainerStyle = {
    position: 'relative' as const,
    paddingTop: '56.25%', // 16:9 aspect ratio
    backgroundColor: '#f3f4f6',
  };

  const thumbnailStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  };

  const loadingStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyle = {
    padding: 16,
  };

  const titleStyle = {
    fontSize: isMobileView ? 16 : 18,
    fontWeight: 600,
    marginBottom: 8,
    display: '-webkit-box',
    WebkitLineClamp: isMobileView ? 2 : 'none',
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  };

  const ratingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: isMobileView ? 'center' : 'flex-start',
  };

  const removeButtonStyle = {
    marginTop: 8,
    color: '#ef4444',
    cursor: 'pointer',
    width: isMobileView ? '100%' : 'auto',
    padding: isMobileView ? '8px' : '0',
    border: isMobileView ? '1px solid #ef4444' : 'none',
    borderRadius: isMobileView ? 4 : 0,
    backgroundColor: isMobileView ? 'transparent' : 'transparent',
  };

  return (
    <div style={cardStyle}>
      <Link to={`/video/${video._id}`} style={{ display: 'block', position: 'relative' }}>
        <div style={thumbnailContainerStyle}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={video.title_youtube}
              style={thumbnailStyle}
            />
          ) : (
            <div style={loadingStyle}>
              <span style={{ color: '#9ca3af' }}>Loading...</span>
            </div>
          )}
        </div>
      </Link>
      <div style={contentStyle}>
        <h3 style={titleStyle}>
          {video.title_youtube}
        </h3>
        {showRating && onRatingChange && (
          <div style={ratingContainerStyle}>
            {/* Add your rating component here */}
          </div>
        )}
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            style={removeButtonStyle}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCard; 