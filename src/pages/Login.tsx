import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from: string;
  url?: string;
}

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path and URL from location state
  const { from = '/enter-details', url } = (location.state as LocationState) || {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(identifier, password);
      // Navigate to the original destination with the URL if it exists
      navigate(from, { state: url ? { url } : undefined });
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(223, 208, 184, 0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '20%',
        left: '5%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(223, 208, 184, 0.02) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: 0
      }} />

      {/* Logo */}
      <img
        src="/logo.png"
        alt="Anv Logo"
        style={{
          position: 'absolute',
          left: '19px',
          top: '21px',
          width: 'auto',
          height: '60px',
          zIndex: 10,
          cursor: 'pointer',
          transition: 'transform 0.3s ease'
        }}
        onClick={() => navigate('/')}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      />

      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(223, 208, 184, 0.1)',
        animation: 'fadeInUp 0.8s ease-out',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: 700,
          color: '#DFD0B8',
          marginBottom: '32px',
          fontFamily: 'Bellefair, serif'
        }}>
          Welcome back
        </h2>

        {error && (
          <div style={{
            background: 'rgba(255, 77, 77, 0.1)',
            border: '1px solid rgba(255, 77, 77, 0.2)',
            color: '#ff6b6b',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label htmlFor="identifier" style={{
              display: 'block',
              color: 'rgba(223, 208, 184, 0.8)',
              fontSize: '16px',
              marginBottom: '8px',
              fontFamily: 'Lora, serif'
            }}>
              Email or Username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(223, 208, 184, 0.05)',
                border: '1px solid rgba(223, 208, 184, 0.2)',
                borderRadius: '12px',
                color: '#DFD0B8',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                fontFamily: 'Lora, serif'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(223, 208, 184, 0.1)';
                e.target.style.borderColor = 'rgba(223, 208, 184, 0.4)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(223, 208, 184, 0.05)';
                e.target.style.borderColor = 'rgba(223, 208, 184, 0.2)';
              }}
              placeholder="Enter your email or username"
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              color: 'rgba(223, 208, 184, 0.8)',
              fontSize: '16px',
              marginBottom: '8px',
              fontFamily: 'Lora, serif'
            }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(223, 208, 184, 0.05)',
                border: '1px solid rgba(223, 208, 184, 0.2)',
                borderRadius: '12px',
                color: '#DFD0B8',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                fontFamily: 'Lora, serif'
              }}
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

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #DFD0B8 0%, #C9B896 100%)',
              borderRadius: '12px',
              border: 'none',
              color: '#141414',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Lora, serif',
              marginTop: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Sign in
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'rgba(223, 208, 184, 0.8)',
          fontFamily: 'Lora, serif'
        }}>
          Don't have an account?{' '}
          <Link
            to="/signup"
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
            Sign up
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

export default Login; 