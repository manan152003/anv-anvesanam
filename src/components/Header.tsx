import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  user?: { username: string; avatarUrl?: string } | null;
  onAddVideo?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, user, onAddVideo }) => {
  const navigate = useNavigate();

  return (
    <header style={{
      width: '100%',
      background: 'rgba(20, 20, 20, 0.8)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 97,
      borderBottom: '1px solid rgba(223, 208, 184, 0.1)',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Anv Logo"
        style={{
          position: 'absolute',
          left: 19,
          top: 21,
          width: 'auto',
          height: 60,
          zIndex: 10,
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
        }}
        onClick={() => navigate(isAuthenticated ? '/about' : '/')}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      />
      <nav style={{
        display: 'flex',
        gap: 20,
        fontFamily: 'Lora, serif',
        fontSize: 24,
        fontWeight: 700,
        marginLeft: 120,
        marginRight: 40,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        {isAuthenticated ? (
          <>
            <span style={{ cursor: 'pointer', opacity: 1 }} onClick={() => navigate('/discover')}>DISCOVER</span>
            <button
              style={{
                marginLeft: 24,
                background: '#22c55e',
                color: '#141414',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontSize: 20,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={onAddVideo}
            >
              + Log
            </button>
            {user && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 24,
                  cursor: 'pointer',
                  gap: 12,
                }}
                onClick={() => navigate('/profile')}
              >
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: '2px solid #DFD0B8',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <span style={{
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
                  whiteSpace: 'nowrap',
                }}>{user.username}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <span style={{ cursor: 'pointer', opacity: 1 }} onClick={() => navigate('/discover')}>DISCOVER</span>
            <span style={{ cursor: 'pointer', opacity: 1 }} onClick={() => navigate('/about')}>ABOUT</span>
            <span style={{ cursor: 'pointer', opacity: 1 }} onClick={() => navigate('/login')}>SIGN IN</span>
            <span style={{ cursor: 'pointer', opacity: 1 }} onClick={() => navigate('/signup')}>CREATE ACCOUNT</span>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header; 