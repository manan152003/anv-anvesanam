import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Profile from '../pages/Profile';
import ProfilePublic from '../pages/ProfilePublic';

const ProfileRouter: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  // If no username is provided, redirect to the current user's profile if logged in, else to login
  if (!username) {
    return user ? <Navigate to={`/profile/${user.username}`} replace /> : <Navigate to="/login" replace />;
  }

  // If the username matches the current user, show the Profile component (require auth)
  if (user && username === user.username) {
    return <Profile />;
  }

  // Otherwise, show the public profile (accessible to all)
  return <ProfilePublic />;
};

export default ProfileRouter; 