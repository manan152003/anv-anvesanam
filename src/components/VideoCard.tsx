import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getYouTubeThumbnail } from '../utils/youtube';

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

  useEffect(() => {
    const loadThumbnail = async () => {
      if (video.youtube_id) {
        const url = await getYouTubeThumbnail(video.youtube_id);
        setThumbnailUrl(url);
      }
    };
    loadThumbnail();
  }, [video.youtube_id]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/video/${video._id}`} className="block relative">
        <div className="aspect-video bg-gray-100">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={video.title_youtube}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">Loading...</span>
            </div>
          )}
        </div>
      </Link>
      // ... rest of the existing code ...
    </div>
  );
};

export default VideoCard; 