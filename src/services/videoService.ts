interface VideoSubmission {
  url: string;
  title: string;
  category: string;
  rating: number;
  review?: string;
  userId: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const submitVideo = async (submission: VideoSubmission): Promise<void> => {
  try {
    // Extract YouTube video ID
    const videoIdMatch = submission.url.match(/v=([\w-]+)/);
    const youtubeVideoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!youtubeVideoId) throw new Error('Invalid YouTube URL');

    // First, get the category ID from the category name
    const categoryRes = await fetch(`${API_URL}/categories?slug=${submission.category}`);
    if (!categoryRes.ok) {
      throw new Error('Failed to fetch category');
    }
    const categories = await categoryRes.json();
    const category = categories.find((c: any) => c.slug === submission.category);
    if (!category) {
      throw new Error('Category not found');
    }

    // 1. Create or get video
    const videoRes = await fetch(`${API_URL}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        youtubeVideoId,
        title_youtube: submission.title,
        thumbnailUrl_youtube: `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`,
        uploadDate_youtube: new Date().toISOString(),
        duration_seconds: 0, // You might want to fetch this from YouTube API
        submitterUserId: submission.userId,
        categoryId: category._id,
      }),
    });

    if (!videoRes.ok) {
      const errorData = await videoRes.json();
      throw new Error(errorData.message || 'Failed to create video');
    }
    const video = await videoRes.json();

    // 2. Create submission
    const submissionBody: any = {
      userId: submission.userId,
      videoId: video._id,
      categoryId: category._id,
      rating: submission.rating,
    };
    if (submission.review) {
      submissionBody.userDescription = submission.review;
    }
    const submissionRes = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionBody),
    });

    if (!submissionRes.ok) {
      const errorData = await submissionRes.json();
      throw new Error(errorData.message || 'Failed to submit review');
    }
  } catch (error) {
    console.error('Error in submitVideo:', error);
    throw error;
  }
}; 