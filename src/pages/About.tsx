import React from 'react';
import { useNavigate } from 'react-router-dom';

// Critique: This About page goes all out with modern web design trends: glassmorphism, gradients, animated SVGs, bold fonts, and a tech stack grid. All styles are inline for now for rapid iteration, but should be moved to CSS-in-JS or modules for maintainability.

const GITHUB_URL = 'https://github.com/manan152003/anv';

const About: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(ellipse at 60% 10%, #210f37 0%, #141414 60%, #1A1A1A 100%)',
      color: '#DFD0B8',
      fontFamily: 'Lora, serif',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      {/* Animated Gradient Blobs */}
      <div style={{
        position: 'absolute',
        top: '-200px',
        left: '-200px',
        width: 600,
        height: 600,
        background: 'radial-gradient(circle at 30% 30%, #FFD700 0%, #210f37 80%)',
        filter: 'blur(120px)',
        opacity: 0.5,
        zIndex: 1,
        animation: 'blob1 12s infinite alternate',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-300px',
        right: '-300px',
        width: 800,
        height: 800,
        background: 'radial-gradient(circle at 70% 70%, #7C6B6B 0%, #210f37 80%)',
        filter: 'blur(180px)',
        opacity: 0.6,
        zIndex: 1,
        animation: 'blob2 14s infinite alternate',
      }} />
      {/* Header/Nav */}
      <img
        src="/logo.png"
        alt="Anv Logo"
        style={{ position: 'absolute', left: 19, top: 21, width: 'auto', height: 60, zIndex: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')} />
      <div style={{ width: '100%', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: 97, zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 15, fontFamily: 'Lora, serif', fontSize: 24, fontWeight: 700, marginRight: 80 }}>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/home')}>HOME</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/discover')}>DISCOVER</span>
          <span style={{ opacity: 1, cursor: 'pointer' }} onClick={() => navigate('/profile')}>PROFILE</span>
          <span style={{ opacity: 0.6, cursor: 'pointer' }} onClick={() => navigate('/about')}>ABOUT</span>
        </div>
      </div>
      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        zIndex: 2,
        position: 'relative',
        marginTop: 60,
      }}>
        {/* Animated SVG Icon */}
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 24, filter: 'drop-shadow(0 0 32px #FFD70088)', animation: 'spin 12s linear infinite' }}>
          <circle cx="60" cy="60" r="54" stroke="#FFD700" strokeWidth="8" fill="none" />
          <path d="M60 20 L80 100 L40 100 Z" fill="#DFD0B8" stroke="#210f37" strokeWidth="3" />
        </svg>
        <h1 style={{
          fontFamily: 'Alfa Slab One, serif',
          fontSize: 90,
          fontWeight: 700,
          color: '#FFD700',
          letterSpacing: '-2px',
          textShadow: '0 8px 32px #210f37, 0 2px 0 #DFD0B8',
          margin: 0,
          lineHeight: 1.05,
          textAlign: 'center',
          background: 'linear-gradient(90deg, #FFD700 40%, #DFD0B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 32px #210f37AA)',
        }}>
          FEEL BORED
        </h1>
        <div style={{
          fontFamily: 'Lora, serif',
          fontSize: 32,
          color: '#DFD0B8',
          opacity: 0.85,
          marginTop: 18,
          marginBottom: 32,
          textAlign: 'center',
          maxWidth: 900,
          fontWeight: 500,
          textShadow: '0 2px 12px #210f37',
        }}>
          The <span style={{ color: '#FFD700', fontWeight: 700 }}>iconic</span> video discovery platform. <br />
          Minimal. Social. <span style={{ color: '#FFD700', fontWeight: 700 }}>Legendary.</span>
        </div>
        {/* Glassmorphic Info Card */}
        <div style={{
          background: 'rgba(33,15,55,0.55)',
          border: '2.5px solid #FFD700',
          borderRadius: 36,
          boxShadow: '0 8px 48px #210f37AA',
          padding: '48px 64px',
          maxWidth: 700,
          margin: '0 auto',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          marginBottom: 48,
          zIndex: 3,
        }}>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#FFD700', marginBottom: 18, letterSpacing: 1 }}>What is Feel Bored?</div>
          <div style={{ fontSize: 22, color: '#DFD0B8', lineHeight: 1.5, marginBottom: 18 }}>
            <b>Feel Bored</b> is a curated video discovery platform inspired by Letterboxd, Are.na, and the golden age of YouTube.<br />
            <span style={{ color: '#FFD700' }}>Find, share, and discuss</span> videos worth your time, in a premium, distraction-free, and <span style={{ color: '#FFD700' }}>modern</span> environment.
          </div>
          <div style={{ fontSize: 20, color: '#AFB774', marginBottom: 12 }}>
            Built with React, TypeScript, Node, Express, MongoDB, and a sprinkle of <span style={{ color: '#FFD700' }}>✨ magic</span>.
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{
            color: '#FFD700',
            fontWeight: 700,
            fontSize: 22,
            textDecoration: 'underline',
            marginTop: 12,
            display: 'inline-block',
            letterSpacing: 1,
          }}>View on GitHub</a>
        </div>
        {/* Tech Stack Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 36,
          margin: '0 auto',
          maxWidth: 700,
          marginBottom: 64,
        }}>
          {/* Critique: Use SVGs for crispness. Add more icons as needed. */}
          <img src="/vite.svg" alt="Vite" style={{ width: 64, height: 64, filter: 'drop-shadow(0 0 12px #FFD70088)' }} />
          <img src="/logo.svg" alt="Custom" style={{ width: 64, height: 64, filter: 'drop-shadow(0 0 12px #DFD0B888)' }} />
          <img src="/react.svg" alt="React" style={{ width: 64, height: 64, filter: 'drop-shadow(0 0 12px #61dafbaa)' }} />
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="16" fill="#210f37" /><text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="32" fill="#FFD700" fontFamily="Lora, serif">TS</text></svg>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" rx="16" fill="#210f37" /><text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="32" fill="#DFD0B8" fontFamily="Lora, serif">Node</text></svg>
        </div>
        {/* Call to Action */}
        <div style={{
          fontSize: 32,
          color: '#FFD700',
          fontWeight: 700,
          marginTop: 24,
          marginBottom: 12,
          textShadow: '0 2px 12px #210f37',
          letterSpacing: 1,
        }}>
          Ready to get inspired?
        </div>
        <button
          onClick={() => navigate('/discover')}
          style={{
            fontFamily: 'Lora, serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#210f37',
            background: 'linear-gradient(90deg, #FFD700 0%, #DFD0B8 100%)',
            border: 'none',
            borderRadius: 18,
            padding: '18px 54px',
            boxShadow: '0 4px 32px #FFD70044',
            cursor: 'pointer',
            marginTop: 8,
            marginBottom: 64,
            transition: 'transform 0.18s cubic-bezier(.4,2,.6,1)',
            outline: 'none',
          }}
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.07)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Discover Videos
        </button>
      </div>
      {/* Critique: For maintainability, move animations to CSS or styled-components. For accessibility, ensure all text has sufficient contrast and all images have alt text. */}
      {/* Keyframes for blobs and spin (inject into global CSS in production) */}
      <style>{`
        @keyframes blob1 { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.2) translate(60px, 40px); } }
        @keyframes blob2 { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.1) translate(-40px, -60px); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default About; 