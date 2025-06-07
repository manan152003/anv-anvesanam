const API_URL = import.meta.env.VITE_API_URL;

export const getUserById = async (userId: string) => {
  const res = await fetch(`${API_URL}/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const getFollowingUsers = async (userId: string) => {
  const res = await fetch(`${API_URL}/users/${userId}/following`);
  if (!res.ok) throw new Error('Failed to fetch following users');
  return res.json();
}; 