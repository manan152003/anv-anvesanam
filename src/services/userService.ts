const API_URL = import.meta.env.VITE_API_URL;

export const getUserById = async (userId: string) => {
  const res = await fetch(`${API_URL}/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const getUserByUsername = async (username: string) => {
  const res = await fetch(`${API_URL}/users/by-username/${username}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const getFollowingUsers = async (userId: string) => {
  const res = await fetch(`${API_URL}/users/${userId}/following`);
  if (!res.ok) throw new Error('Failed to fetch following users');
  return res.json();
};

export const updateProfile = async (data: { name?: string; bio?: string; avatarUrl?: string }) => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return res.json();
}; 