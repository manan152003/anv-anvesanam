import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and validate it
    const token = localStorage.getItem('authToken');
    if (token) {
      // TODO: Validate token with backend
      // For now, we'll just set a mock user
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        username: 'testuser'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual API call
      // Mock login for now
      const mockUser = {
        id: '1',
        email,
        name: 'Test User',
        username: 'testuser'
      };
      localStorage.setItem('authToken', 'mock-token');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (email: string, password: string, name: string, username: string) => {
    try {
      // TODO: Implement actual API call
      // Mock signup for now
      const mockUser = {
        id: '1',
        email,
        name,
        username
      };
      localStorage.setItem('authToken', 'mock-token');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 