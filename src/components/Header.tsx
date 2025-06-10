import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobileView } from '../context/MobileViewContext';

interface HeaderProps {
  isAuthenticated: boolean;
  user?: { username: string; avatarUrl?: string } | null;
  onAddVideo?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, user, onAddVideo }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobileView } = useMobileView();

  const headerStyle = {
    width: '100%',
    background: 'rgba(20, 20, 20, 0.8)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 97,
    borderBottom: '1px solid rgba(223, 208, 184, 0.1)',
    position: 'relative' as const,
    zIndex: 10
  };

  const logoStyle = {
    marginLeft: 19,
    width: 'auto',
    height: 60,
    zIndex: 10,
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  };

  const discoverTextStyle = {
    cursor: 'pointer',
    opacity: 1,
    fontFamily: 'Lora, serif',
    fontSize: 24,
    fontWeight: 700,
    marginLeft: 32,
    color: '#DFD0B8',
    letterSpacing: '0.5px',
    display: isMobileView ? 'none' : 'block'
  };

  const navStyle = {
    display: isMobileView ? 'none' : 'flex',
    gap: 20,
    fontFamily: 'Lora, serif',
    fontSize: 20,
    fontWeight: 700,
    marginRight: 40,
    alignItems: 'center',
  };

  const addVideoButtonStyle = {
    background: '#DFD0B8',
    color: '#141414',
    border: 'none',
    borderRadius: 8,
    padding: '10px 24px',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginRight: 16,
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: 12,
  };

  const avatarStyle = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '2px solid #DFD0B8',
    objectFit: 'cover' as const,
  };

  const usernameStyle = {
    fontSize: 18,
    color: '#DFD0B8',
    fontWeight: 600,
    fontFamily: 'Lora, serif',
    letterSpacing: '0.5px',
    opacity: 0.95,
    marginLeft: 2,
    marginRight: 2,
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  };

  const navItemStyle = {
    cursor: 'pointer',
    opacity: 1,
    color: '#DFD0B8'
  };

  const mobileMenuButtonStyle = {
    display: isMobileView ? 'block' : 'none',
    marginRight: 16,
    color: '#DFD0B8',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
  };

  const mobileMenuStyle = {
    display: isMobileView && isMenuOpen ? 'block' : 'none',
    position: 'absolute' as const,
    top: 97,
    left: 0,
    right: 0,
    background: 'rgba(20, 20, 20, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(223, 208, 184, 0.1)',
    padding: 16,
  };

  const mobileMenuItemStyle = {
    display: 'block',
    padding: '12px 0',
    color: '#DFD0B8',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <img
          src="/logo.png"
          alt="Anv Logo"
          style={logoStyle}
          onClick={() => navigate(isAuthenticated ? '/about' : '/')}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        {isAuthenticated && (
          <span
            style={discoverTextStyle}
            onClick={() => navigate('/discover')}
          >
            DISCOVER
          </span>
        )}
      </div>

      <button
        style={mobileMenuButtonStyle}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <nav style={navStyle}>
        {isAuthenticated ? (
          <>
            <button
              style={addVideoButtonStyle}
              onClick={onAddVideo}
            >
              + ADD VIDEO
            </button>
            {user && (
              <div
                style={userSectionStyle}
                onClick={() => navigate('/profile')}
              >
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    style={avatarStyle}
                  />
                )}
                <span style={usernameStyle}>{user.username}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <span style={navItemStyle} onClick={() => navigate('/about')}>ABOUT</span>
            <span style={navItemStyle} onClick={() => navigate('/login')}>SIGN IN</span>
            <span style={navItemStyle} onClick={() => navigate('/signup')}>CREATE ACCOUNT</span>
          </>
        )}
      </nav>

      {isMenuOpen && (
        <div style={mobileMenuStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isAuthenticated ? (
              <>
                <button
                  style={addVideoButtonStyle}
                  onClick={() => {
                    onAddVideo?.();
                    setIsMenuOpen(false);
                  }}
                >
                  + ADD VIDEO
                </button>
                <span
                  style={mobileMenuItemStyle}
                  onClick={() => {
                    navigate('/discover');
                    setIsMenuOpen(false);
                  }}
                >
                  DISCOVER
                </span>
                <span
                  style={mobileMenuItemStyle}
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                >
                  PROFILE
                </span>
              </>
            ) : (
              <>
                <span
                  style={mobileMenuItemStyle}
                  onClick={() => {
                    navigate('/about');
                    setIsMenuOpen(false);
                  }}
                >
                  ABOUT
                </span>
                <span
                  style={mobileMenuItemStyle}
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  SIGN IN
                </span>
                <span
                  style={mobileMenuItemStyle}
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                >
                  CREATE ACCOUNT
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 