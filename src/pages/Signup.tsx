import React, { useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { useMobileView } from '../context/MobileViewContext';

interface LocationState {
  from: string;
  url?: string;
}

const Signup = () => {
  const { isMobileView } = useMobileView();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random());
  const [error, setError] = useState('');
  const { signup, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googleInfo, setGoogleInfo] = useState<{ email: string; name: string; picture: string } | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const usernameCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  // Get the redirect path and URL from location state
  const { from, url } = (location.state as LocationState) || { from: '/enter-details' };

  // Username check function
  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/check-username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch {
      setUsernameAvailable(null);
    }
    setCheckingUsername(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, name, username, avatarUrl, bio);
      // Fetch user data after signup
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            username: userData.username,
            avatarUrl: userData.avatarUrl,
            bio: userData.bio,
            role: userData.role,
          });
          navigate('/discover');
          return;
        }
      }
      // fallback
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  const handleGoogleSignup = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setError('Google sign up failed');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/google-signup/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      if (response.status === 409) {
        setError('User already exists. Please log in.');
        return;
      }
      if (!response.ok) {
        setError('Google sign up failed');
        return;
      }
      const data = await response.json();
      setGoogleToken(credentialResponse.credential);
      setGoogleInfo(data);
      setShowCompleteProfile(true);
    } catch (err) {
      setError('Google sign up failed');
    }
  };

  const handleCompleteProfile = async (username: string, password: string, confirmPassword: string) => {
    if (!googleToken || !googleInfo) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/google-signup/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken, username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Profile completion failed');
        return;
      }
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      // Fetch user data after Google signup
      const token = data.token;
      const meResponse = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (meResponse.ok) {
        const userData = await meResponse.json();
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          username: userData.username,
          avatarUrl: userData.avatarUrl,
          bio: userData.bio,
          role: userData.role,
        });
        navigate('/discover');
        return;
      }
      // fallback
      window.location.reload();
    } catch (err) {
      setError('Profile completion failed');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobileView ? '16px' : '20px',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: isMobileView ? '100%' : '500px',
    background: 'rgba(20, 20, 20, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: isMobileView ? '16px' : '24px',
    padding: isMobileView ? '24px' : '40px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
    animation: 'fadeInUp 0.8s ease-out',
    position: 'relative' as const,
    zIndex: 1
  };

  const titleStyle = {
    textAlign: 'center' as const,
    fontSize: isMobileView ? '24px' : '32px',
    fontWeight: 700,
    color: '#DFD0B8',
    marginBottom: isMobileView ? '24px' : '32px',
    fontFamily: 'Lora, serif'
  };

  const inputContainerStyle = {
    marginBottom: isMobileView ? '16px' : '24px'
  };

  const labelStyle = {
    display: 'block',
    color: 'rgba(223, 208, 184, 0.8)',
    fontSize: isMobileView ? '14px' : '16px',
    marginBottom: '8px',
    fontFamily: 'Lora, serif'
  };

  const inputStyle = {
    width: '100%',
    padding: isMobileView ? '10px 14px' : '12px 16px',
    background: 'rgba(223, 208, 184, 0.05)',
    border: '1px solid rgba(223, 208, 184, 0.2)',
    borderRadius: isMobileView ? '8px' : '12px',
    color: '#DFD0B8',
    fontSize: isMobileView ? '14px' : '16px',
    transition: 'all 0.3s ease',
    fontFamily: 'Lora, serif'
  };

  const buttonStyle = {
    width: '100%',
    padding: isMobileView ? '12px 0' : '14px 0',
    background: 'linear-gradient(90deg, #DFD0B8 0%, #AFB774 100%)',
    color: '#181818',
    fontWeight: 700,
    fontSize: isMobileView ? '16px' : '18px',
    border: 'none',
    borderRadius: isMobileView ? '8px' : '12px',
    marginTop: '8px',
    marginBottom: '16px',
    cursor: 'pointer',
    fontFamily: 'Lora, serif',
    boxShadow: '0 2px 8px rgba(223, 208, 184, 0.13)'
  };

  const dividerStyle = {
    textAlign: 'center' as const,
    margin: isMobileView ? '12px 0' : '16px 0',
    color: '#DFD0B8',
    fontFamily: 'Lora, serif'
  };

  const linkContainerStyle = {
    textAlign: 'center' as const,
    marginTop: isMobileView ? '16px' : '24px',
    color: 'rgba(223, 208, 184, 0.8)',
    fontFamily: 'Lora, serif',
    fontSize: isMobileView ? '14px' : '16px'
  };

  return (
    <div style={containerStyle}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '10%',
        width: isMobileView ? '200px' : '300px',
        height: isMobileView ? '200px' : '300px',
        background: 'radial-gradient(circle, rgba(223, 208, 184, 0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '20%',
        left: '5%',
        width: isMobileView ? '150px' : '200px',
        height: isMobileView ? '150px' : '200px',
        background: 'radial-gradient(circle, rgba(223, 208, 184, 0.02) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Create your account</h2>

        {error && (
          <div style={{
            background: 'rgba(255, 77, 77, 0.1)',
            border: '1px solid rgba(255, 77, 77, 0.2)',
            color: '#ff6b6b',
            padding: isMobileView ? '12px' : '16px',
            borderRadius: isMobileView ? '8px' : '12px',
            marginBottom: isMobileView ? '16px' : '24px',
            animation: 'fadeIn 0.3s ease-out',
            fontSize: isMobileView ? '14px' : '16px'
          }}>
            {error}
          </div>
        )}

        {showCompleteProfile && googleInfo ? (
          <div style={formContainerStyle}>
            <h2 style={titleStyle}>Complete your profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: isMobileView ? 16 : 24 }}>
              <img src={googleInfo.picture} alt="avatar" style={{ width: isMobileView ? 48 : 64, height: isMobileView ? 48 : 64, borderRadius: '50%', marginBottom: 8 }} />
              <div style={{ color: '#DFD0B8', fontSize: isMobileView ? 16 : 18 }}>{googleInfo.name}</div>
              <div style={{ color: '#AFB774', fontSize: isMobileView ? 13 : 15 }}>{googleInfo.email}</div>
            </div>
            <CompleteProfileForm onSubmit={handleCompleteProfile} error={error} isMobileView={isMobileView} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isMobileView ? '16px' : '24px' }}>
            <div>
              <label htmlFor="name" style={labelStyle}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.1)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.05)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.2)';
                }}
              />
            </div>

            <div>
              <label htmlFor="username" style={labelStyle}>
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameAvailable(null);
                  if (usernameCheckTimeout.current) clearTimeout(usernameCheckTimeout.current);
                  const value = e.target.value;
                  usernameCheckTimeout.current = setTimeout(() => checkUsername(value), 500);
                }}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.1)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.05)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.2)';
                }}
                placeholder="Choose a unique username"
              />
              {username && (
                <div style={{ marginTop: 6, fontSize: 14, color: usernameAvailable === null ? '#AFB774' : usernameAvailable ? 'green' : 'red' }}>
                  {checkingUsername ? 'Checking username...' : usernameAvailable === null ? '' : usernameAvailable ? 'Username is available!' : 'Username is taken.'}
                </div>
              )}
              <div style={{
                marginTop: '10px',
                padding: '10px 14px',
                background: 'rgba(223, 208, 184, 0.13)',
                border: '1px solid #AFB774',
                borderRadius: '8px',
                color: '#AFB774',
                fontSize: '15px',
                fontFamily: 'Lora, serif',
                fontWeight: 500,
                letterSpacing: '0.2px',
                boxShadow: '0 2px 8px rgba(175, 183, 116, 0.07)',
                textAlign: 'left',
                lineHeight: 1.4
              }}>
                ⓘ Username <b>cannot be changed</b> once set
              </div>
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.1)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.05)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.2)';
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.1)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.05)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.2)';
                }}
              />
            </div>

            <div>
              <label htmlFor="bio" style={labelStyle}>
                Bio (Optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.1)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(223, 208, 184, 0.05)';
                  e.target.style.borderColor = 'rgba(223, 208, 184, 0.2)';
                }}
                placeholder="Tell us about yourself"
              />
            </div>

            <button
              type="submit"
              style={buttonStyle}
            >
              Create Account
            </button>
            <div style={dividerStyle}>or</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => setError('Google sign up failed')}
                theme="filled_black"
                shape="rectangular"
                text="signup_with"
                locale="en"
              />
            </div>
          </form>
        )}

        <div style={linkContainerStyle}>
          Already have an account?{' '}
          <Link
            to="/login"
            state={{ from, url }}
            style={{
              color: '#DFD0B8',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#C9B896';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#DFD0B8';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Sign in
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

function CompleteProfileForm({ onSubmit, error, isMobileView }: { onSubmit: (username: string, password: string, confirmPassword: string) => void; error: string; isMobileView: boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const usernameCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  const inputStyle = {
    padding: isMobileView ? '10px 14px' : '12px 16px',
    borderRadius: isMobileView ? '8px' : '12px',
    border: '1px solid #AFB774',
    fontSize: isMobileView ? '14px' : '16px',
    width: '100%',
    marginBottom: isMobileView ? '12px' : '16px',
    background: 'rgba(223, 208, 184, 0.05)',
    color: '#DFD0B8'
  };

  const buttonStyle = {
    padding: isMobileView ? '12px' : '14px',
    borderRadius: isMobileView ? '8px' : '12px',
    background: '#AFB774',
    color: '#181818',
    fontWeight: 700,
    fontSize: isMobileView ? '16px' : '18px',
    border: 'none',
    cursor: 'pointer',
    width: '100%'
  };

  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/check-username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch {
      setUsernameAvailable(null);
    }
    setCheckingUsername(false);
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(username, password, confirmPassword); }} style={{ display: 'flex', flexDirection: 'column', gap: isMobileView ? '12px' : '20px' }}>
      <input type="text" placeholder="Choose a username" value={username} onChange={e => {
        setUsername(e.target.value);
        setUsernameAvailable(null);
        if (usernameCheckTimeout.current) clearTimeout(usernameCheckTimeout.current);
        const value = e.target.value;
        usernameCheckTimeout.current = setTimeout(() => checkUsername(value), 500);
      }} required style={inputStyle} />
      {username && (
        <div style={{ marginTop: 6, fontSize: isMobileView ? '12px' : '14px', color: usernameAvailable === null ? '#AFB774' : usernameAvailable ? 'green' : 'red' }}>
          {checkingUsername ? 'Checking username...' : usernameAvailable === null ? '' : usernameAvailable ? 'Username is available!' : 'Username is taken.'}
        </div>
      )}
      <input type="password" placeholder="Set a password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
      <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} />
      {error && <div style={{ color: '#ff6b6b', marginBottom: 8, fontSize: isMobileView ? '12px' : '14px' }}>{error}</div>}
      <button type="submit" style={buttonStyle}>Complete Signup</button>
    </form>
  );
}

export default Signup; 