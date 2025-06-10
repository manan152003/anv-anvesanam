interface VideoSubmission {
  url: string;
  title: string;
  category: string;
  rating: number;
  review?: string;
  userId: string;
  duration_seconds?: number | null;
  uploadDate_youtube?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to extract video ID from YouTube URL
const extractVideoId = (url: string): string | null => {
  // Handle youtu.be URLs
  if (url.includes('youtu.be')) {
    const match = url.match(/youtu\.be\/([\w-]+)/);
    return match ? match[1] : null;
  }
  // Handle standard YouTube URLs
  const match = url.match(/[?&]v=([\w-]+)/);
  return match ? match[1] : null;
};

export const submitVideo = async (submission: VideoSubmission): Promise<string> => {
  try {
    // Extract YouTube video ID using the helper function
    const youtubeVideoId = extractVideoId(submission.url);
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
        uploadDate_youtube: submission.uploadDate_youtube || new Date().toISOString(),
        duration_seconds: submission.duration_seconds ?? 0,
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
    return video._id;
  } catch (error) {
    console.error('Error in submitVideo:', error);
    throw error;
  }
};

export const getVideoById = async (videoId: string) => {
  const res = await fetch(`${API_URL}/videos/${videoId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch video');
  }
  return res.json();
};

export const getLatestSubmissionByVideoId = async (videoId: string) => {
  const res = await fetch(`${API_URL}/submissions/latest/${videoId}`);
  if (!res.ok) throw new Error('Failed to fetch latest submission');
  return res.json();
};

export const getSubmissionsByUser = async (userId: string) => {
  const res = await fetch(`${API_URL}/submissions?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
}; 