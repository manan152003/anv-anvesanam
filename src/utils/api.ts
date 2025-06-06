const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { requiresAuth = true, ...fetchOptions } = options;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  });

  if (requiresAuth) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }
    headers.append('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
}; 