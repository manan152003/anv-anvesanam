import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideoById } from '../services/videoService';
import { getYouTubeThumbnail } from '../utils/youtube';
// ... other imports ...

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<any>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  // ... other state variables ...

  useEffect(() => {
    const loadVideo = async () => {
      if (!id) return;
      try {
        const videoData = await getVideoById(id);
        setVideo(videoData);
        if (videoData.youtube_id) {
          const url = await getYouTubeThumbnail(videoData.youtube_id);
          setThumbnailUrl(url);
        }
      } catch (error) {
        console.error('Error loading video:', error);
        navigate('/home');
      }
    };
    loadVideo();
  }, [id, navigate]);

  // ... rest of the component code ...

  return (
    <div className="container mx-auto px-4 py-8">
      {video && (
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
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
          // ... rest of the JSX ...
        </div>
      )}
    </div>
  );
};

export default VideoDetail; 