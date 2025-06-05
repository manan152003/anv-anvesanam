const API_URL = import.meta.env.VITE_API_URL;

export const getUserById = async (userId: string) => {
  const res = await fetch(`${API_URL}/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}; 