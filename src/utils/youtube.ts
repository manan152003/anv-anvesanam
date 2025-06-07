export const getYouTubeThumbnail = async (videoId: string): Promise<string> => {
  const maxresUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const response = await fetch(maxresUrl, { method: 'HEAD' });
    if (response.ok) {
      return maxresUrl;
    }
  } catch (error) {
    console.warn(`Failed to load maxresdefault for video ${videoId}:`, error);
  }

  return hqUrl;
}; 